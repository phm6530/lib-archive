import { NOTION_ID, NOTION_SEGMENT } from "../constant/var";
import HeroBanner from "../_components/hero";
import { queryNotionDatabase } from "@/lib/notion-service";
import Libitem from "../_components/lib-item";

export interface NotionPage {
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

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedSearchParams = await searchParams;
  const keyword = resolvedSearchParams?.keyword as string | undefined;
  const result = await queryNotionDatabase<ReponseType>(
    `${NOTION_SEGMENT.LIST}/${NOTION_ID}/query`,
    {},
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

  // Filter in code for precision
  const filteredPosts = keyword
    ? posts.filter(
        (post) =>
          post.제목.toLowerCase().includes(keyword.toLowerCase()) ||
          post.내용.toLowerCase().includes(keyword.toLowerCase())
      )
    : posts;

  return (
    <div className="pt-14">
      <HeroBanner
        title={`Personal\nLibrary`}
        description="React,Next에서 주요 사용될 개인라이브러리 모음입니다."
      />
      <div className="grid md:grid-cols-2  gap-4 ">
        {filteredPosts.map((post, idx) => {
          return <Libitem key={`post-${idx}`} {...post} />;
        })}
      </div>
    </div>
  );
}
