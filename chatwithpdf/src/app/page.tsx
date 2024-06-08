import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ui/dark-mode-toggle";


export default function Home() {
  return (
    <main>
      <div className=" p-4 flex h-14 items-center justify-between supports-backdrop-blur:bg-background/60 sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
      <span className="font-bold">FileChatAI</span>
      <ModeToggle />
      </div>
      <Button>
      Get Started
    </Button>
    </main>
  );
}
