"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

import { getCategories } from "./action/nav-action";
import { useQuery } from "@tanstack/react-query";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Briefcase, Github, Rss } from "lucide-react";

export default function Component() {
  const pathname = usePathname();
  const path = pathname.split("/");

  const { data } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  const categories = data ?? [{ name: "Home", path: "/" }];

  return (
    <header className="border-b ">
      <div className="flex h-16 items-center justify-between gap-4">
        <div className="flex flex-1 items-center gap-2">
          {/* Main nav */}
          <div className="flex flex-1 items-center gap-6 max-md:justify-between">
            {categories.map((link, index) => (
              <Button
                variant={"link"}
                className={cn(
                  "text-muted-foreground hover:text-primary py-1.5 px-0 font-medium",
                  path[1] === link.path.slice(1) ? "text-primary" : ""
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

          {/* Portfolio Icon */}
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
              <Briefcase className="h-5 w-5" />
            </Link>
          </Button>

          {/* Blog Icon */}
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
              <Rss className="h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
