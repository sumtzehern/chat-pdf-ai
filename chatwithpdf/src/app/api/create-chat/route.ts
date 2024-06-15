import { messages } from "@/lib/db/schema";
import { NextResponse } from "next/server";

export async function POST(req: Request, res: Response) {

    try {
        const body = await req.json();
        const { file_key, file_name } = body;
        return NextResponse.json({messages: "success"}, {status: 200})

    } catch (error) {
        console.log(error)
        return NextResponse.json({error: "Internal Server Error"}, {status: 500})
    }
}