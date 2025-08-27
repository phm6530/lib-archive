import HeroBanner from "@/app/_components/hero";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { notFound } from "next/navigation";
import { ReponseType } from "../page";
import {
  NOTION_BASE_URL,
  NOTION_ID,
  NOTION_SEGMENT,
  NOTION_TOKEN,
} from "@/app/constant/var";
import Link from "next/link";

export default async function LibsPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;

  const response = await fetch(
    `${NOTION_BASE_URL}/${NOTION_SEGMENT.LIST}/${NOTION_ID}/query`,
    {
      method: "POST",
      headers: {
        "Notion-Version": "2022-06-28",
        authorization: `Bearer ${NOTION_TOKEN}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
      body: JSON.stringify({
        filter: {
          property: "카테고리",
          select: {
            equals: category,
          },
        },
      }),
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
    };
  });

  return (
    <>
      <HeroBanner
        title={category.charAt(0).toUpperCase() + category.slice(1)}
        description="React, Next에서 주요 사용될 개인 라이브러리 모음입니다."
      />

      <div className="flex w-full flex-col gap-4 ">
        {posts.map((post, idx) => (
          <Link
            href={`/${post.카테고리.toLocaleLowerCase()}/${post.id}`}
            key={`${post.id}-${idx}`}
          >
            <Card className="cursor-pointer transition-colors border-indigo-200/20 hover:border-indigo-300 h-full flex flex-col">
              <CardHeader className="flex-grow">
                <div className="flex justify-between items-start text-xs text-muted-foreground mb-2">
                  <span>{post.카테고리}</span>
                  <span>
                    {new Date(post.작성일).toLocaleDateString("ko-KR")}
                  </span>
                </div>
                <CardTitle className="text-lg font-semibold">
                  {post.제목}
                </CardTitle>
                <CardDescription className="text-xs leading-relaxed line-clamp-2 mt-1 md:w-[60%] break-keep">
                  {post.내용}
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </>
  );
}
