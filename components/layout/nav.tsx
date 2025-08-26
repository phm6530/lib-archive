"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { getCategories } from "./action/nav-action";
import { useQuery } from "@tanstack/react-query";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navigationLinks = [
  { href: "/", label: "Home", active: true },
  { href: "#", label: "Features" },
  { href: "#", label: "Pricing" },
  { href: "#", label: "About" },
];

type Category = {
  name: string;
  path: string;
};

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

        <div className="flex items-center gap-2 max-md:hidden">
          <Button asChild size="sm" className="text-sm">
            <a href="#">
              <span className="flex items-baseline gap-2">
                Cart
                <span className="text-primary-foreground/60 text-xs">2</span>
              </span>
            </a>
          </Button>
        </div>
      </div>
    </header>
  );
}
