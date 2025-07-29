import FileUploadComponent from "./components/upload-file";
import ChatComponent from "./components/chat";
import { UserButton } from "@clerk/nextjs";
import { ModeToggle } from "./components/toggle-theme";

export default function Home() {
  return (
  <div>
    <div className="min-h-screen w-screen flex">
      <div className="flex flex-col w-[30vw] border-r-4">
        <div className="p-3 flex items-center border-b-4 gap-4">
          <UserButton />
          <ModeToggle />
        </div>
        <div className="w-[30vw] p-4 flex items-center justify-center border-r-4">
          <FileUploadComponent />
        </div>
      </div>
      <div className="w-[70vw] border-l-1">
        <ChatComponent />
      </div>
    </div>
  </div>);
}
