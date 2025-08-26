"use client";
import { HomeIcon } from "lucide-react";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
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
            <HomeIcon size={16} aria-hidden="true" />
            <span className="sr-only">Home</span>
          </Link>
        </BreadcrumbItem>
        {parmas.category && (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <Link href={`/${parmas.category}`}>{parmas.category}</Link>
            </BreadcrumbItem>
          </>
        )}

        {parmas.id && (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{title}</BreadcrumbPage>
            </BreadcrumbItem>
          </>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
