import { Pinecone } from '@pinecone-database/pinecone';
import { donwloadFromS3 } from './s3-server';
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";

let pinecone : Pinecone | null = null;

export const getPinecone = async () => {
    if (!pinecone) {
        pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY! });
    }
    return pinecone;
}

export const loadS3IntoPinecone = async (file_key: string) => {
    //1. obtain pdf , donwload and read
    console.log("Loading file from S3 into Pinecone")
    const file_name = await donwloadFromS3(file_key);

    if (!file_name) {
        console.log("File name is null")
        return;
    }

    const loader = new PDFLoader(file_name);
    const pages = await loader.load()
    return pages
}
