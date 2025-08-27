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

export default function SubNav({ title }: { title: string }) {
  const parmas = useParams<{ category: string; id: string }>();
  console.log(parmas.category, parmas.id);

  return (
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
            <BreadcrumbItem className="text-xs">
              <Link href={`/${parmas.category}`}>{parmas.category}</Link>
            </BreadcrumbItem>
          </>
        )}

        {parmas.id && (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbItem className="text-xs ">
              <BreadcrumbPage className="text-xs">{title}</BreadcrumbPage>
            </BreadcrumbItem>
          </>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
