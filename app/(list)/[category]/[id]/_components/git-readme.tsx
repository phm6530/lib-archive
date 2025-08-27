import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Github } from "lucide-react";
import { ReactNode } from "react";

export default function GitReadMeDialog({ children }: { children: ReactNode }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="cursor-pointer bg-transparent border-2"
        >
          <Github /> Read Me
        </Button>
      </DialogTrigger>
      <DialogContent className=" flex flex-col gap-0 p-0 sm:max-h-[min(640px,80vh)] sm:max-w-4xl [&>button:last-child]:top-3.5">
        <DialogHeader className="contents space-y-0 text-left">
          <DialogTitle className="border-b px-6 py-4  flex items-center gap-3 text-xs">
            <Github /> Read Me
          </DialogTitle>
          <div className="overflow-y-auto p-5 py-10">
            <DialogDescription asChild>{children}</DialogDescription>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
