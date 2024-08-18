import { db } from "@/lib/db";
import { chats, messages } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

// API route for deleting a chat
export async function DELETE(req: Request) {
    try {
        const { chatId } = await req.json();

        // Delete the chat messages first, then delete the chat
        await db
            .delete(messages)
            .where(eq(messages.chatId, chatId));
        await db
            .delete(chats)
            .where(eq(chats.id, chatId));

        return NextResponse.json({ success: true, message: "Chat deleted successfully" }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ success: false, message: "Failed to delete chat" }, { status: 500 });
    }
}
