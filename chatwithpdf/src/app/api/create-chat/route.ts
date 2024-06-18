import { loadS3IntoPinecone } from "@/lib/db/pinecone";
import { messages } from "@/lib/db/schema";
import { NextResponse } from "next/server";

export async function POST(req: Request, res: Response) {

    try {
        const body = await req.json();
        const { file_key, file_name } = body;
        const pages = await loadS3IntoPinecone(file_key);
        return NextResponse.json({pages}, {status: 200})

    } catch (error) {
        console.log(error)
        return NextResponse.json({error: "Internal Server Error"}, {status: 500})
    }
}