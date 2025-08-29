import HeroBanner from "@/app/_components/hero";
import { ReponseType } from "../page";
import { NOTION_ID, NOTION_SEGMENT, REVADILTE_PRE } from "@/app/constant/var";
import SubNav from "@/app/_components/sub-nav";
import { queryNotionDatabase } from "@/lib/notion-service";
import SearchableList from "./searchable-list";

import CategoryRevaildateController from "./_components/category-revaildate-controller";

export default async function LibsPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;

  const categoryFilter = {
    property: "카테고리",
    select: {
      equals: category,
    },
  };

  // 페이지가 요청될 때마다 항상 새로운 데이터를 가져옵니다. (Data-Cache)
  const result = await queryNotionDatabase<ReponseType>(
    `${NOTION_SEGMENT.LIST}/${NOTION_ID}/query`,
    {
      method: "POST",
      cache: "force-cache",
      body: { filter: categoryFilter },
      next: { tags: [`${REVADILTE_PRE.CATEGORY}`, category] },
    }
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

  return (
    <>
      <SubNav />
      <HeroBanner
        title={category.charAt(0).toUpperCase() + category.slice(1)}
        description="React, Next에서 주요 사용될 개인 라이브러리 모음입니다."
      />
      <div className="mb-5">
        <CategoryRevaildateController category={category} />
      </div>

      <SearchableList initialPosts={posts} />
    </>
  );
}
