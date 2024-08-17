"use client";

import { DrizzleChat } from "@/lib/db/schema";
import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";
import { PlusCircle, Trash, TrashIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import axios from "axios";
import SubscriptionButton from "./SubcriptionButton";
import { checkSubscription } from "@/lib/subcription";
import router from "next/router";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"



type Props = {
  chats: DrizzleChat[];
  chatId: number;
  isPro: boolean;
};

const ChatSideBar = ({ chats, chatId, isPro }: Props) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [successMessage, setSuccessMessage] = React.useState(null);
  const [selectedChatId, setSelectedChatId] = React.useState(null);
  

  const handleDeleteChat = async (chatId: number) => {
    setIsLoading(true); // Set loading state to true when delete starts
    setError(null);   // Clear previous errors
    setSuccessMessage(null); // Clear previous success messages

    try {
      const response = await fetch('/api/delete-chat', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ chatId }),
      });

      if (response.ok) {
        // Handle success - remove chat from UI or refresh
        toast.success('Chat deleted successfully');
        router.reload(); // Reload the page or update state to remove chat from UI
      } else {
        console.error('Failed to delete chat');
      }
    } catch (error) {
      toast.error('Failed to delete chat');
    } finally {
      setIsLoading(false); // Set loading state to false when delete finishes
    }
  };

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
            <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant={"destructive"}>
            <Trash
              className="w-4 h-4 text-white hover:text-red-900 cursor-pointer"
            />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will remove the
                chat and any data associated with it.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  handleDeleteChat(chat.id);
                }}
              >
                Yes, delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
          </div>
        ))}
      </div>

      <div className="absolute bottom-4 left-4">
        <div className="flex items-center gap-2 text-sm text-slate-500 flex-wrap">
          <Link href="/">Home</Link>
          <Link href="/">Source</Link>
        </div>
        <div className="mt-2 bg-purple-600">
        <SubscriptionButton isPro={isPro} />
        </div>
      </div>
    </div>
  );
};

export default ChatSideBar;