import SubNav from "@/app/_components/sub-nav";
import {
  GITHUB_TOKEN,
  NOTION_BASE_URL,
  NOTION_SEGMENT,
  NOTION_TOKEN,
} from "@/app/constant/var";
import ReactMarkdown from "react-markdown";

type NotionPageMeta = {
  id: string;
  url: string;
  properties: {
    제목: {
      type: "title";
      title: { plain_text: string }[];
    };
    내용: {
      type: "rich_text";
      rich_text: { plain_text: string }[];
    };
    카테고리: {
      type: "select";
      select: { id: string; name: string; color: string } | null;
    };
    작성일: {
      type: "date";
      date: {
        start: string;
        end: string | null;
        time_zone: string | null;
      } | null;
    };
    작성자: {
      type: "formula";
      formula: { type: string; string: string | null };
    };
  };
};

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: postId } = await params;

  const header: RequestInit = {
    method: "GET",
    headers: {
      "Notion-Version": "2022-06-28",
      authorization: `Bearer ${NOTION_TOKEN}`,
    },
    cache: "no-cache",
  };

  const res = await fetch(
    "https://api.github.com/repos/phm6530/fullpage-react/readme",
    {
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        Accept: "application/vnd.github.v3+json", // 명시 권장
      },
      cache: "force-cache",
    }
  );

  const data = await res.json(); // 여기 반드시 await
  const markdown = Buffer.from(data.content, "base64").toString("utf-8");

  const [contentsRes, metaRes] = await Promise.all([
    fetch(
      `${NOTION_BASE_URL}/${NOTION_SEGMENT.DETAIL_CONTENTS}/${postId}/children`,
      header
    ),
    fetch(`${NOTION_BASE_URL}/${NOTION_SEGMENT.DETAIL_META}/${postId}`, header),
  ]);

  if (!contentsRes.ok) {
    console.warn("Notion contents API Error", contentsRes.status);
  }

  if (!metaRes.ok) {
    console.warn("Notion meta API Error", metaRes.status);
  }

  const [contents, meta] = await Promise.all([
    contentsRes.json(),
    metaRes.json(),
  ]);

  const metaData = meta as NotionPageMeta;

  return (
    <div className="py-5 flex flex-col gap-5">
      {" "}
      <div className="">
        <SubNav title={metaData.properties.제목.title[0].plain_text} />
      </div>
      <h1 className="text-5xl my-3 mt-10">
        {metaData.properties.제목.title[0].plain_text}
      </h1>
      <div>
        <p className="text-base leading-relaxed text-zinc-300">
          {metaData.properties.내용.rich_text[0].plain_text}
        </p>
        <span className="text-xs opacity-50">
          {metaData.properties.작성일.date?.start}
        </span>
      </div>
      <ReactMarkdown>{markdown}</ReactMarkdown>
    </div>
  );
}
