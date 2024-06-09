import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ui/dark-mode-toggle";
import { UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { LogIn } from "lucide-react";
import Link from "next/link";
import Image from 'next/image';


export default async function Home() {
  const {userId} = await auth()
  const isAuth = !!userId

  return (
    <main>
      <div className=" p-4 flex h-14 items-center justify-between supports-backdrop-blur:bg-background/60 sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
      <span className="font-bold">FileChatAI</span>
      <UserButton afterSignOutUrl="/"/>
      <ModeToggle />
      </div>
      <div className="w-screen min-h-screen bg-[conic-gradient(at_bottom_left,_var(--tw-gradient-stops))] from-fuchsia-300 via-green-400 to-rose-700">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="flex flex-col items-center text-center">
            <div className="flex items-center">
              <h1 className="mr-3 text-4xl font-semibold">Chat with any PDFs</h1>
            </div>
            <div className="flex mt-2">
              {
                isAuth && <Button className="text-sm font-medium">Chat with PDF</Button>
              }
              </div>

              <p className="max-w-xl mt-1 text-lg text-slate-600">
                Powered by OpenAI, instantly answer questions and understand research with AI
              </p>

              <div className="w-full mt-4">
                {
                  isAuth ? (<h1>fileupload</h1>) :
                  <Link href="/sign-in">
                  <Button>
                    Login to get started!
                    <LogIn className="w-4 h-4 ml-4" />
                  </Button>
                  </Link>
                }
              </div>

              <div className="mt-6">
              <Image src="/example.png" alt="chatwithpdf" width={500} height={300} className="rounded-lg"/>
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}
