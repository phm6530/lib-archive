import Link from "next/link";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";
import { ChartBarStacked, Library, LibrarySquare } from "lucide-react";
export default function Libitem(post: {
  id: string;
  url: string;
  제목: string;
  내용: string;
  카테고리: string;
  작성일: string;
  stack: {
    id: string;
    name: string;
    color: string;
  }[];
}) {
  return (
    <>
      <Link href={`/${post.카테고리.toLocaleLowerCase()}/${post.id}`}>
        <Card className="cursor-pointer transition-colors border-2 border-indigo-200/20 hover:border-indigo-300 h-full flex flex-col">
          <CardHeader className="flex-grow ">
            <div className="flex justify-between items-start text-xs text-muted-foreground mb-2">
              <Badge variant="secondary">{post.카테고리}</Badge>
              <span>
                {post.작성일 !== "Invalid Date"
                  ? new Date(post.작성일).toLocaleDateString("ko-KR")
                  : "-"}
              </span>
            </div>
            <CardTitle className="text-lg flex items-center gap-2 mb-5">
              <ChartBarStacked size={15} className="text-teal-300 " />
              {post.제목}
            </CardTitle>
            <CardDescription className="text-xs leading-relaxed line-clamp-2 mt-1 md:w-[60%] break-keep">
              {post.내용}
            </CardDescription>{" "}
          </CardHeader>
        </Card>
      </Link>
    </>
  );
}
