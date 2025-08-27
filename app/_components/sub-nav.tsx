"use client";
import { HomeIcon } from "lucide-react";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useParams } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function SubNav({ title }: { title?: string }) {
  const parmas = useParams<{ category: string; id: string }>();

  return (
    <div className="mb-4 mt-5 text-sm text-zinc-500 py-5  rounded-lg">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <Link href="/">
              <HomeIcon size={13} aria-hidden="true" />
            </Link>
          </BreadcrumbItem>
          {parmas.category && (
            <>
              <BreadcrumbSeparator />
              <BreadcrumbItem
                className={cn(
                  "text-xs",
                  !parmas.id && "text-zinc-50 underline"
                )}
              >
                <Link href={`/${parmas.category}`}>{parmas.category}</Link>
              </BreadcrumbItem>
            </>
          )}

          {parmas.id && title && (
            <>
              <BreadcrumbSeparator />
              <BreadcrumbItem className="text-xs ">
                <BreadcrumbPage className="text-xs underline">
                  {title}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </>
          )}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
}
