import Link from "next/link";

import { notFound } from "next/navigation";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  NOTION_BASE_URL,
  NOTION_ID,
  NOTION_SEGMENT,
  NOTION_TOKEN,
} from "../constant/var";
import HeroBanner from "../_components/hero";

interface NotionPage {
  id: string;
  url: string;
  properties: {
    제목: {
      title: {
        plain_text: string;
      }[];
    };
    내용: {
      rich_text: {
        plain_text: string;
      }[];
    };
    카테고리: {
      select: {
        name: string;
      } | null;
    };
    작성일: {
      date: {
        start: string;
      } | null;
    };
    stack: {
      id: string;
      type: "multi_select";
      multi_select: Array<{ id: string; name: string; color: string }>;
    };
  };
}

export type ReponseType = {
  results: NotionPage[];
};

export default async function Home() {
  const response = await fetch(
    `${NOTION_BASE_URL}/${NOTION_SEGMENT.LIST}/${NOTION_ID}/query`,
    {
      method: "POST",
      headers: {
        "Notion-Version": "2022-06-28",
        authorization: `Bearer ${NOTION_TOKEN}`,
      },
      cache: "no-cache",
    }
  );

  if (!response.ok) {
    notFound();
  }

  const result = (await response.json()) as ReponseType;
  const posts = result.results.map((page) => {
    return {
      id: page.id,
      url: page.url,
      제목: page.properties?.제목?.title?.[0]?.plain_text ?? "",
      내용: page.properties?.내용?.rich_text?.[0]?.plain_text ?? "",
      카테고리: page.properties?.카테고리?.select?.name ?? "",
      작성일: page.properties?.작성일?.date?.start ?? "",
      stack: page.properties.stack.multi_select,
    };
  });

  return (
    <>
      <HeroBanner
        title="Personal Library"
        description="React,Next에서 주요 사용될 개인라이브러리 모음입니다."
      />
      <div className="grid grid-cols-2  gap-4 ">
        {posts.map((post, idx) => {
          return (
            <Link
              href={`/${post.카테고리.toLocaleLowerCase()}/${post.id}`}
              key={`${post.id}-${idx}`}
            >
              <Card className="cursor-pointer transition-colors border-indigo-200/20 hover:border-indigo-300 h-full flex flex-col">
                <CardHeader className="flex-grow">
                  <div className="flex justify-between items-start text-xs text-muted-foreground mb-2">
                    <span>{post.카테고리}</span>
                    <span>
                      {post.작성일 !== "Invalid Date"
                        ? new Date(post.작성일).toLocaleDateString("ko-KR")
                        : "-"}
                    </span>
                  </div>
                  <CardTitle className="text-lg font-semibold">
                    {post.제목}
                  </CardTitle>
                  <CardDescription className="text-xs leading-relaxed line-clamp-2 mt-1 md:w-[60%] break-keep">
                    {post.내용}
                  </CardDescription>
                  {post.stack.length > 0 && (
                    <div className="flex gap-2 mt-2 text-xs text-indigo-300">
                      {post.stack.map((e, idx) => (
                        <span key={`stack-${idx}`}>{e.name}</span>
                      ))}
                    </div>
                  )}
                </CardHeader>
              </Card>
            </Link>
          );
        })}
      </div>
    </>
  );
}
