"use client";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from "next/link";
import { Button } from "@/components/ui/button";

import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Book, Github, Presentation, User } from "lucide-react";
import SignIn from "../modal-login";

export interface NotionDatabase {
  properties: {
    카테고리: {
      select: {
        options: Array<{
          name: string;
        }>;
      };
    };
  };
}

export default function Component({ response }: { response: NotionDatabase }) {
  const pathname = usePathname();
  const path = pathname.split("/");

  const notionCategories =
    response.properties.카테고리.select.options.map((e) => {
      return {
        name: e.name,
        path: `/${e.name.toLowerCase()}`,
      };
    }) ?? [];

  const categories = [{ name: "Home", path: "/" }, ...notionCategories];

  return (
    <header className="border-b ">
      <div className="flex h-16 items-center justify-between gap-4">
        <div className="flex flex-1 items-center gap-2">
          {/* Main nav */}
          <div className="flex flex-1 items-center gap-6 ">
            {categories.map((link, index) => (
              <Button
                variant={"link"}
                className={cn(
                  "text-muted-foreground hover:text-primary py-1.5 px-0 font-medium",
                  path[1] === link.path.slice(1) ? "text-primary underline" : ""
                )}
                key={`${link.name}-${index}`}
              >
                <Link href={link.path}>{link.name}</Link>
              </Button>
            ))}
          </div>
        </div>

        <div className="flex items-center  max-md:hidden">
          {/* GitHub Icon */}
          <Tooltip>
            <TooltipTrigger>
              <Button
                asChild
                variant={"ghost"}
                size={"icon"}
                className="text-muted-foreground hover:text-primary"
              >
                <Link
                  href={"https://github.com/phm6530/"}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub"
                >
                  <Github className="h-5 w-5" />
                </Link>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Git</p>
            </TooltipContent>
          </Tooltip>

          {/* Portfolio Icon */}

          <Tooltip>
            <TooltipTrigger>
              <Button
                asChild
                variant={"ghost"}
                size={"icon"}
                className="text-muted-foreground hover:text-primary"
              >
                <Link
                  href={"https://www.h-creations.com/"} // Placeholder link
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Presentation className="h-5 w-5" />
                </Link>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Portpolio</p>
            </TooltipContent>
          </Tooltip>

          {/* Blog Icon */}

          <Tooltip>
            <TooltipTrigger>
              <Button
                asChild
                variant={"ghost"}
                size={"icon"}
                className="text-muted-foreground hover:text-primary"
              >
                <Link
                  href={"https://blog.h-creations.com/"}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Blog"
                >
                  <Book className="h-5 w-5" />
                </Link>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>blog</p>
            </TooltipContent>
          </Tooltip>
          <SignIn>
            <Button
              variant={"outline"}
              size={"icon"}
              className="text-muted-foreground hover:text-primary cursor-pointer bg-transparent"
            >
              <User className="h-5 w-5" />
            </Button>
          </SignIn>
        </div>
      </div>
    </header>
  );
}
