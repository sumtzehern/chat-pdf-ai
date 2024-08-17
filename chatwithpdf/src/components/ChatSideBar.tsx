"use client";

import { DrizzleChat } from "@/lib/db/schema";
import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";
import { PlusCircle, Trash } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import axios from "axios";

type Props = {
  chats: DrizzleChat[];
  chatId: number;
};

const ChatSideBar = ({ chats, chatId }: Props) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const handleSubcription = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get("/api/stripe")
      window.location.href = response.data.url; // Redirect to billing stripe page

    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="w-full h-screen p-2 text-gray-500 bg-gray-900">
      <Link href={"/"}>
        <Button className="w-full border-dashed border-white border">
          <PlusCircle className="mr-2 w-4 h-4" />
          New Chat
        </Button>
      </Link>

      <div className="flex max-h-screen pb-20 flex-col gap-2 mt-4">
        {chats.map((chat) => (
          <div
            key={chat.id}
            className={cn("rounded-lg p-3 text-slate-300 flex items-center justify-between", {
              "bg-blue-700 text-white": chat.id === chatId,
              "hover:text-white": chat.id !== chatId,
            })}
          >
            <Link href={`/chat/${chat.id}`} className="w-full">
              <p className="overflow-hidden text-sm truncate whitespace-nowrap text-ellipsis">
              {chat.pdfName.length > 10 ? `${chat.pdfName.substring(0, 20)}...` : chat.pdfName}
              </p>
            </Link>
            <Trash
              className="w-5 h-5 text-red-700 hover:text-red-900 cursor-pointer"
            />
          </div>
        ))}
      </div>

      <div className="absolute bottom-4 left-4">
        <div className="flex items-center gap-2 text-sm text-slate-500 flex-wrap">
          <Link href="/">Home</Link>
          <Link href="/">Source</Link>
        </div>
        <Button className="mt-2 text-white bg-purple-700 hover:bg-fuchsia-700" disabled={isLoading} onClick={handleSubcription}>Upgrade to Pro</Button>
      </div>
    </div>
  );
};

export default ChatSideBar;