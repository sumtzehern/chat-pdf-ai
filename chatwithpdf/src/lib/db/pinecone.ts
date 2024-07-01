import { Pinecone, PineconeRecord } from '@pinecone-database/pinecone';
import { downloadFromS3 } from './s3-server';
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { Document, RecursiveCharacterTextSplitter } from "@pinecone-database/doc-splitter";
import { getEmbedding } from '../embeddings';
import md5 from 'md5';
import { metadata } from '@/app/layout';
import { convertToAscii } from "../utils";

let pinecone : Pinecone | null = null;

export const getPineconeClient =  () => {
    return new Pinecone({
        apiKey: process.env.PINECONE_API_KEY!,
    });
}

type PDFPage = {
    pageContent: string
    metadata: {
        loc: {
            pageNumber: number
        }
    }
}

/**
 * Loads a PDF file from S3 and prepares it for indexing in Pinecone.
 *
 * @param {string} file_key - The key of the PDF file in S3.
 * @return {Promise<PDFPage[]>} A promise that resolves to an array of PDFPage objects representing the pages of the PDF file.
 */
export const loadS3IntoPinecone = async (file_key: string) => {
    //1. obtain pdf , donwload and read
    console.log("Loading file from S3 into Pinecone")
    const file_name = await downloadFromS3(file_key);

    if (!file_name) {
        throw new Error("Failed to download file from S3");
    }

    const loader = new PDFLoader(file_name);
    const pages = (await loader.load()) as unknown as PDFPage[];

    //2. Split and segment the pdf into small chunks
    // eg: split pages of array into smaller chunks
    const document = await Promise.all(pages.map(prepareDocument))

    //3. vector and embed individual docs
    const vectors = await Promise.all(document.flat().map(embedDocuments))

    //4 . upload into pinecone
    const client = getPineconeClient();
    const pineconeIndex = client.Index(process.env.PINECONE_INDEX_NAME!);

    console.log("Uploading vectors to Pinecone")
    
    const namespace = pineconeIndex.namespace(convertToAscii(file_key));
    await pineconeIndex.upsert(vectors);

  return document[0];
}

async function embedDocuments(doc: Document){
    try {
        const embeddings = await getEmbedding(doc.pageContent)
        // hash the content
        const hash = md5(doc.pageContent)
        return {
            id: hash,
            values: embeddings,
            metadata: {
                text: doc.metadata.text,
                pageNumber: doc.metadata.pageNumber
            }
        } as PineconeRecord

    } catch(error) {    
        console.log('error calling openai embedding api', error) 
        throw error
    }
}

/**
 * Truncates a string to a specified number of bytes.
 *
 * @param {string} str - The string to be truncated.
 * @param {number} maxBytes - The maximum number of bytes the string can have.
 * @return {string} The truncated string.
 */
export const truncateStringByBytes = (str: string, maxBytes: number) => {
    const encoder = new TextEncoder();
    return new TextDecoder().decode(encoder.encode(str).slice(0, maxBytes))
}

/**
 * Prepares a document for indexing by splitting the content into smaller documents based on character count.
 *
 * @param {PDFPage} page - The PDF page containing the content to be prepared.
 * @return {Promise<Document[]>} A promise that resolves to an array of prepared Document objects.
 */
async function prepareDocument(page: PDFPage) {
    let { pageContent, metadata } = page;
    pageContent = pageContent.replace(/\n/g, "");
    // split the docs
    const splitter = new RecursiveCharacterTextSplitter();
    const docs = await splitter.splitDocuments([
      new Document({
        pageContent,
        metadata: {
          pageNumber: metadata.loc.pageNumber,
          text: truncateStringByBytes(pageContent, 36000),
        },
      }),
    ]);
    return docs;
  }
