'use client'
import React from "react"
import { Input } from "./ui/input"
import { Message, useChat } from "ai/react"
import { Button } from "./ui/button"
import { Send } from "lucide-react"
import MessageList from "./MessageList"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"

type Props = {
    chatId: number
}

const ChatComponent = ({chatId}: Props) => {
    const { data, isLoading } = useQuery({
        queryKey: ["chat", chatId],
        queryFn: async () => {
          const response = await axios.post<Message[]>("/api/get-messages", {
            chatId,
          });
          return response.data;
        },
      });

    const {input, handleInputChange, handleSubmit, messages} = useChat({ // send message to openai api endpoint
        api: '/api/chat',
        body: {
            chatId
        },
        initialMessages: data || [],
    });

    // scroll to bottom when new message is added
    React.useEffect(() => {
        const messageContainer = document.getElementById("message-container");
        if (messageContainer) {
          messageContainer.scrollTo({
            top: messageContainer.scrollHeight,
            behavior: "smooth",
          });
        }
      }, [messages]);

    return (
        <div className="relative max-h-screen overflow-auto">
            <div className="sticky top-0 inset-x-0 p-2 bg-white h-fit">
                <h3 className="text-xl font-bold">Chat</h3>
            </div>

            <MessageList messages={messages} isLoading={isLoading}/>

            <form className="sticky bottom-0 inset-x-0 px-2 py-4 bg-white" onSubmit={handleSubmit} autoComplete="on">
                <div className="flex">
                <Input value={input} onChange={handleInputChange} placeholder="Ask any question..." className="w-full"/>
                <Button className='bg-blue-600 ml-2 hover:bg-blue-800'>
                    <Send className="h-4 w-4"/>
                </Button>
                </div>
            </form>
        </div>
    )
}

export default ChatComponent