import { Pinecone } from '@pinecone-database/pinecone';
import { donwloadFromS3 } from './s3-server';
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { Document, RecursiveCharacterTextSplitter } from "@pinecone-database/doc-splitter";

let pinecone : Pinecone | null = null;

export const getPinecone = async () => {
    if (!pinecone) {
        pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY! });
    }
    return pinecone;
}

type PDFPage = {
    pageContent: string
    metaData: {
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
    const file_name = await donwloadFromS3(file_key);

    if (!file_name) {
        console.log("File name is null")
        return;
    }

    const loader = new PDFLoader(file_name);
    const pages = (await loader.load()) as unknown as PDFPage[];

    //2. splite and segment the pdf
    return pages
}

async function prepareDocument(page: PDFPage) {
    
}
