import { Github } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import SubNav from "@/app/_components/sub-nav";
import {
  GITHUB_TOKEN,
  NOTION_BASE_URL,
  NOTION_ID,
  NOTION_SEGMENT,
  NOTION_TOKEN,
  REVADILTE_PRE,
} from "@/app/constant/var";
import { ScrollProgress } from "@/components/animate-ui/components/scroll-progress";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import CodeViewer from "./_components/code-viewer";
import DemoIframe from "./_components/demo-iframe";
import { Metadata } from "next";
import { queryNotionDatabase } from "@/lib/notion-service";
import { ReponseType } from "../../page";
import RevaildateController from "./_components/revaildate-controller";

// --- 1. 타입 정의: Notion API 원본 타입과 우리가 사용할 파싱된 타입 분리 ---

// Notion API의 Rich Text 객체 타입
type NotionRichText = {
  type: "text";
  text: { content: string; link: string | null };
  plain_text: string;
  href: string | null;
  annotations: {
    bold: boolean;
    italic: boolean;
    strikethrough: boolean;
    underline: boolean;
    code: boolean;
    color: string;
  };
};

// Notion API의 Block 객체 타입 (처리할 타입들 명시)
type NotionBlock = {
  object: "block";
  id: string;
  type: string;
  paragraph?: { rich_text: NotionRichText[] };
  heading_1?: { rich_text: NotionRichText[] };
  heading_2?: { rich_text: NotionRichText[] };
  heading_3?: { rich_text: NotionRichText[] };
  code?: { rich_text: NotionRichText[]; language: string };
  image?: {
    type: "file" | "external";
    file?: { url: string };
    external?: { url: string };
    caption: NotionRichText[];
  };
  embed?: { url: string };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
};

// 페이지 메타 데이터 타입
type NotionPageMeta = {
  id: string;
  url: string;
  created_time: Date;
  last_edited_time: Date;
  properties: {
    제목: { type: "title"; title: { plain_text: string }[] };
    내용: { type: "rich_text"; rich_text: { plain_text: string }[] };
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
    repoName: {
      type: "text";
      rich_text: { type: "text"; plain_text: string }[];
    };
    stack: {
      id: string;
      type: "multi_select";
      multi_select: Array<{ id: string; name: string; color: string }>;
    };
  };
};

// full Route Cache 설정
export async function generateStaticParams() {
  const resulta = await queryNotionDatabase<ReponseType>(
    `${NOTION_SEGMENT.LIST}/${NOTION_ID}/query`,
    {},
    { cache: "force-cache" }
  );

  return resulta.results.map((item) => ({
    id: item.id + "",
  }));
}

//Meta Data 설정
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id: postId } = await params;

  const header: RequestInit = {
    method: "GET",
    headers: {
      "Notion-Version": "2022-06-28",
      authorization: `Bearer ${NOTION_TOKEN}`,
    },
    cache: "force-cache",
    next: { tags: [`${REVADILTE_PRE.POST_METADATA}:${postId}`] },
  };

  const response = await fetch(
    `${NOTION_BASE_URL}/${NOTION_SEGMENT.DETAIL_META}/${postId}`,
    {
      ...header,
    }
  );

  const result = (await response.json()) as NotionPageMeta;
  return {
    title: result.properties.제목.title[0].plain_text,
    description: result.properties.내용.rich_text[0].plain_text,
    keywords: result.properties.stack.multi_select.map((e) => e.name),
    openGraph: {
      title: result.properties.제목.title[0].plain_text,
      description: result.properties.내용.rich_text[0].plain_text,
    },
  };
}

// --- 2. 렌더링 헬퍼 함수: Notion 데이터를 UI 렌더링에 적합한 형태로 변환 ---
const renderBlock = (block: NotionBlock) => {
  const { type, id } = block;
  const value = block[type];

  switch (type) {
    case "paragraph":
      return (
        <p key={id} className="leading-loose md:text-base text-sm break-keep">
          {value.rich_text.length === 0
            ? "\u00A0"
            : value.rich_text.map((t: NotionRichText) => t.plain_text).join("")}
        </p>
      );

    case "heading_1":
      return (
        <h1 key={id} className="text-3xl font-bold my-4">
          {value.rich_text.map((t: NotionRichText) => t.plain_text).join("")}
        </h1>
      );

    case "heading_2":
      return (
        <h2 key={id} className="text-2xl font-bold my-3">
          {value.rich_text.map((t: NotionRichText) => t.plain_text).join("")}
        </h2>
      );

    case "heading_3":
      return (
        <h3 key={id} className="text-xl font-bold my-2">
          {value.rich_text.map((t: NotionRichText) => t.plain_text).join("")}
        </h3>
      );

    case "code":
      return (
        <CodeViewer
          key={id}
          code={value.rich_text
            .map((t: NotionRichText) => t.plain_text)
            .join("\n")}
        />
      );

    case "image":
      const src =
        value.type === "external" ? value.external.url : value.file.url;
      const caption = value.caption
        .map((t: NotionRichText) => t.plain_text)
        .join("");
      return (
        <div key={id} className="relative w-full h-96 my-4">
          <Image
            src={src}
            alt={caption ?? "image"}
            layout="fill"
            objectFit="contain"
            className="rounded-lg"
          />
          {caption && (
            <p className="text-center text-sm text-gray-500 mt-2">{caption}</p>
          )}
        </div>
      );

    case "embed":
      return <DemoIframe key={id} src={value.url} />;

    default:
      return (
        <pre
          key={id}
          className="bg-zinc-900 text-white p-4 rounded-md text-xs my-4 overflow-x-auto"
        >
          <strong>Unsupported Block Type: {type}</strong>
          <br />
          {JSON.stringify(block, null, 2)}
        </pre>
      );
  }
};

// --- 3. 페이지 컴포넌트 ---

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
    cache: "force-cache",
  };

  const [contentsRes, metaRes] = await Promise.all([
    fetch(
      `${NOTION_BASE_URL}/${NOTION_SEGMENT.DETAIL_CONTENTS}/${postId}/children`,
      { ...header, next: { tags: [`${REVADILTE_PRE.POST}:${postId}`] } }
    ),
    fetch(`${NOTION_BASE_URL}/${NOTION_SEGMENT.DETAIL_META}/${postId}`, {
      ...header,
      next: { tags: [`${REVADILTE_PRE.POST_METADATA}:${postId}`] },
    }),
  ]);

  if (!contentsRes.ok || !metaRes.ok) {
    console.warn("API Error", {
      contentsStatus: contentsRes.status,
      metaStatus: metaRes.status,
    });
    return <div>Error fetching data.</div>; // 에러 발생 시 UI
  }

  const [contents, meta] = await Promise.all([
    contentsRes.json(),
    metaRes.json(),
  ]);
  const metaData = meta as NotionPageMeta;
  const repoName =
    metaData.properties.repoName.rich_text[0]?.plain_text ?? null;

  let markdown = null;
  if (repoName) {
    try {
      const res = await fetch(
        `https://api.github.com/repos/phm6530/${repoName}/readme`,
        {
          headers: {
            Authorization: `Bearer ${GITHUB_TOKEN}`,
            Accept: "application/vnd.github.v3+json",
          },
          cache: "force-cache",
          next: { tags: [`${REVADILTE_PRE.GIT}:${postId}`] },
        }
      );
      if (res.ok) {
        const data = await res.json();
        markdown = Buffer.from(data.content, "base64").toString("utf-8");
      }
    } catch (error) {
      console.error("GitHub API Error:", error);
    }
  }

  const blocks = contents.results as NotionBlock[];

  return (
    <>
      <ScrollProgress />
      {/* Hero Section */}
      <div className="w-full border-b border-zinc-200 dark:border-zinc-800">
        <div className="container  ">
          <div className="max-w-4xl ">
            <div className="mb-4 text-sm text-zinc-500">
              <SubNav
                title={
                  metaData.properties.제목.title[0].plain_text ??
                  "Uncategorized"
                }
              />
            </div>
            <h1 className="text-4xl md:text-5xl pt-10 font-bold tracking-tighter text-zinc-900 dark:text-zinc-100 break-keep leading-relaxed">
              {metaData.properties.제목.title[0].plain_text}
            </h1>
            <p className="max-w-2xl text-sm  leading-loose border-l pl-4  border-zinc-200 mt-10 mb-20 text-zinc-600 dark:text-zinc-400 ">
              {metaData.properties.내용.rich_text[0]?.plain_text}
            </p>
          </div>
        </div>
      </div>
      <RevaildateController postId={postId} repoName={repoName} />

      {/* Meta Info Section */}
      <div className="container mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 py-5 border-b border-zinc-200 dark:border-zinc-800">
        {!!repoName && (
          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium text-zinc-500">Repository</p>

            <Link
              href={`https://github.com/phm6530/${repoName}`}
              target="_blank"
              className=" text-indigo-300 hover:text-indigo-400 text-left gap-3 text-sm flex items-center underline mt-1"
            >
              <Github size={15} /> View on GitHub
            </Link>
          </div>
        )}
        {metaData.properties.stack.multi_select.length > 0 && (
          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium text-zinc-500">Stack</p>
            <div className="flex flex-wrap gap-2">
              {metaData.properties.stack.multi_select.map((stack) => (
                <span
                  key={stack.id}
                  className="bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 px-2 py-1 rounded-md text-xs"
                >
                  {stack.name}
                </span>
              ))}
            </div>
          </div>
        )}
        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium text-zinc-500">Published</p>
          <p className="text-sm mt-1">
            {new Date(
              metaData.created_time.toLocaleString() as string
            ).toLocaleDateString("ko", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
      </div>
      <div className="text-xs text-zinc-500 ml-auto mt-2 ">
        최신 갱신일{" "}
        {new Date(
          metaData.last_edited_time.toLocaleString() as string
        ).toLocaleDateString("ko", {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })}
      </div>

      {/* Main Content Section */}
      <div className="container mx-auto py-10 prose dark:prose-invert max-w-none">
        {blocks.map(renderBlock)}
      </div>

      {/* GitHub README Section */}
      {markdown && (
        <div className="container mx-auto pt-10">
          <Accordion
            type="single"
            collapsible
            className="w-full border rounded-lg"
          >
            <AccordionItem value="item-1" className="border-b-0">
              <AccordionTrigger className="text-lg font-semibold p-4">
                <div className="flex items-center gap-2">
                  <Github className="h-5 w-5" /> README.md
                </div>
              </AccordionTrigger>
              <AccordionContent className="p-4 pt-0">
                <article className="markdown-body mt-4 border-t pt-4 bg-transparent! font-Poppins!">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      h2({ children }) {
                        return (
                          <h2 className="leading-relaxed pt-5">{children}</h2>
                        );
                      },
                      h3({ children }) {
                        return (
                          <h2 className="leading-relaxed pt-3">{children}</h2>
                        );
                      },
                      p({ children }) {
                        return (
                          <p className="text-sm leading-relaxed">{children}</p>
                        );
                      },
                      ul({ children }) {
                        return (
                          <ul className="text-sm leading-relaxed pl-0!">
                            {children}
                          </ul>
                        );
                      },
                      ol({ children }) {
                        return (
                          <ol className="text-sm leading-relaxed pl-0!">
                            {children}
                          </ol>
                        );
                      },
                      li({ children }) {
                        return (
                          <li className="text-sm leading-relaxed">
                            - {children}
                          </li>
                        );
                      },
                      td({ children }) {
                        return (
                          <td className="text-sm leading-relaxed">
                            {children}
                          </td>
                        );
                      },
                      code({ className, children, ...props }) {
                        const match = /language-(\w+)/.exec(className || "");
                        return match ? (
                          <CodeViewer
                            code={String(children).replace(/\n$/, "")}
                          />
                        ) : (
                          <code className="text-sm" {...props}>
                            {children}
                          </code>
                        );
                      },
                    }}
                  >
                    {markdown}
                  </ReactMarkdown>
                </article>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      )}
    </>
  );
}
