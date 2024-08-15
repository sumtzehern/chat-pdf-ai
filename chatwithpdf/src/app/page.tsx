import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ui/dark-mode-toggle";
import { UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { LogIn } from "lucide-react";
import Link from "next/link";
import Image from 'next/image';
import FileUpload from "@/components/FileUpload";
import { db } from "@/lib/db";
import { chats } from "@/lib/db/schema";
import { eq } from "drizzle-orm";


export default async function Home() {
  const {userId} = await auth()
  const isAuth = !!userId

  // redirect user to chatdashboard if they already have a chat
  let firstChat;
  if (userId) {
    firstChat = await db.select().from(chats).where(eq(chats.userId, userId));
    if (firstChat) {
      firstChat = firstChat[0];
    }
  }

  return (
    <main>
      <div className=" p-4 flex h-14 items-center justify-between supports-backdrop-blur:bg-background/60 sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
      <span className="font-bold">FileChatAI</span>
      <div className="flex items-center">
          <div className="mr-4 h-8">
            <UserButton afterSignOutUrl="/"/>
          </div>
          <ModeToggle />
        </div>
      </div>
      <div className="w-screen min-h-screen bg-gradient-to-b from-blue-400 to-emerald-400">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="flex flex-col items-center text-center">
            <div className="flex items-center">
              <h1 className="mr-3 text-4xl font-semibold dark:text-slate-800">Chat with any PDFs</h1>
            </div>
            <div className="flex mt-2">
              {
                isAuth && <Button className="text-sm font-medium dark:bg-slate-800 dark:text-slate-300">
                  <Link href={`/chat/${firstChat?.id}`}>Go to Chats 👉🏼</Link>
                  </Button>
              }
              </div>

              <p className="max-w-xl mt-1 text-lg text-slate-800">
                Powered by OpenAI, instantly answer questions and understand research with AI
              </p>

              <div className="w-full mt-4">
                {
                  isAuth ? (<FileUpload />) :
                  <Link href="/sign-in">
                  <Button>
                    Login to get started!
                    <LogIn className="w-4 h-4 ml-4" />
                  </Button>
                  </Link>
                }
              </div>

              <div className="mt-6">
              <Image priority src="/example.png" alt="chatwithpdf" width={500} height={300} className="rounded-lg"/>
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}
function styled(UserButton: unknown) {
  throw new Error("Function not implemented.");
}

