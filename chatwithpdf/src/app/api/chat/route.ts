import { openai } from "@ai-sdk/openai";
import { convertToCoreMessages, streamText, AIStream } from "ai";
import { getContext } from "@/lib/context";
import { db } from "@/lib/db";
import { chats, messages as _messages } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { messages, chatId } = await req.json();
    const _chats = await db.select().from(chats).where(eq(chats.id, chatId));
    if (_chats.length != 1) {
      return NextResponse.json({ error: "chat not found" }, { status: 404 });
    }

    const fileKey = _chats[0].fileKey;
    const lastMessage = messages[messages.length - 1];
    const context = await getContext(lastMessage.content, fileKey);

    // Construct the custom system prompt with context
    const systemPrompt = `AI assistant is a powerful, human-like artificial intelligence with expert knowledge.
    Please answer the question using the information provided in the CONTEXT BLOCK.
    If the context does not provide the answer, say "I'm sorry, but the context does not contain the answer to that question." and summarize the context.
    Do not provide any additional information that is not in the context.
    
    START CONTEXT BLOCK
    ${context}
    END OF CONTEXT BLOCK
    
    User's Question: "${lastMessage.content}"
    AI Assistant's Answer:`;   

    // AI response with custom prompt and context
    const response = await streamText({
      model: openai("gpt-4o-mini"),
      system: systemPrompt,
      messages: convertToCoreMessages(messages),
      async onFinish(completion) {
        // save user message into db
        await db.insert(_messages).values([{
          chatId: chatId,
          content: lastMessage.content,
          role: "user",
        }]);
      },
    });

    return response.toDataStreamResponse();
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
