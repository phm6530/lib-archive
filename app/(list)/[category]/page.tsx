import HeroBanner from "@/app/_components/hero";

import { ReponseType } from "../page";
import { NOTION_ID, NOTION_SEGMENT } from "@/app/constant/var"; // NOTION_BASE_URL is now used in notion-service

import SubNav from "@/app/_components/sub-nav";
import { queryNotionDatabase } from "@/lib/notion-service"; // New import
import Libitem from "@/app/_components/lib-item";

export default async function LibsPage({
  params,
  searchParams,
}: {
  params: Promise<{ category: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { category } = await params;
  const resolvedSearchParams = await searchParams;
  const keyword = resolvedSearchParams?.keyword as string | undefined;

  const categoryFilter = {
    property: "카테고리",
    select: {
      equals: category,
    },
  };

  const result = await queryNotionDatabase<ReponseType>(
    `${NOTION_SEGMENT.LIST}/${NOTION_ID}/query`,
    { filter: categoryFilter },
    { cache: "force-cache", revalidate: 3600 }
  );

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

  const filteredPosts = keyword
    ? posts.filter(
        (post) =>
          post.제목.toLowerCase().includes(keyword.toLowerCase()) ||
          post.내용.toLowerCase().includes(keyword.toLowerCase())
      )
    : posts;

  return (
    <>
      <SubNav />
      <HeroBanner
        title={category.charAt(0).toUpperCase() + category.slice(1)}
        description="React, Next에서 주요 사용될 개인 라이브러리 모음입니다."
      />
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 ">
        {filteredPosts.map((post, idx) => (
          <Libitem key={`${post.id}-${idx}`} {...post} />
        ))}
      </div>
    </>
  );
}
