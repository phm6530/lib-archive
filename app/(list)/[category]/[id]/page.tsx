import SubNav from "@/app/_components/sub-nav";
import {
  GITHUB_TOKEN,
  NOTION_BASE_URL,
  NOTION_SEGMENT,
  NOTION_TOKEN,
} from "@/app/constant/var";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import "github-markdown-css/github-markdown.css";

// 공통
// 공통 텍스트
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

// 블록 타입
type NotionBlock =
  | {
      object: "block";
      id: string;
      type: "paragraph";
      paragraph: {
        rich_text: NotionRichText[];
        color: string;
      };
    }
  | {
      object: "block";
      id: string;
      type: "code";
      code: {
        rich_text: NotionRichText[];
        language: string;
        caption: NotionRichText[];
      };
    }
  | {
      object: "block";
      id: string;
      type: "image";
      image: {
        caption: NotionRichText[];
        type: "file" | "external";
        file?: {
          url: string;
          expiry_time: string;
        };
        external?: {
          url: string;
        };
      };
    };

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
    repoName: {
      type: "text";
      rich_text: { type: "text"; plain_text: string }[];
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

  const [contentsRes, metaRes] = await Promise.all([
    fetch(
      `${NOTION_BASE_URL}/${NOTION_SEGMENT.DETAIL_CONTENTS}/${postId}/children`,
      { ...header, next: { tags: [`contents:${postId}`] } }
    ),
    fetch(`${NOTION_BASE_URL}/${NOTION_SEGMENT.DETAIL_META}/${postId}`, {
      ...header,
      next: { tags: [`meta:${postId}`] },
    }),
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
  const repoName =
    metaData.properties.repoName.rich_text[0]?.plain_text ?? null;

  let markdown = null;
  if (!!repoName) {
    const res = await fetch(
      `https://api.github.com/repos/phm6530/${repoName}/readme`,
      {
        headers: {
          Authorization: `Bearer ${GITHUB_TOKEN}`,
          Accept: "application/vnd.github.v3+json", // 명시 권장
        },
        cache: "no-cache",
        next: {
          tags: [`git:${repoName}`],
        },
      }
    );

    const data = await res.json(); // 여기 반드시 await
    markdown = Buffer.from(data.content, "base64").toString("utf-8");
  }

  const contentsResponse = contents.results as Array<NotionBlock>;

  const parsed = contentsResponse.map((block) => {
    switch (block.type) {
      case "paragraph":
        return {
          id: block.id,
          type: "paragraph",
          text: block.paragraph.rich_text.map((rt) => rt.plain_text).join(""),
        };

      case "code":
        return {
          id: block.id,
          type: "code",
          language: block.code.language,
          code: block.code.rich_text.map((rt) => rt.plain_text).join(""),
        };

      case "image":
        return {
          id: block.id,
          type: "image",
          url:
            block.image.type === "file"
              ? block.image.file?.url
              : block.image.external?.url,
          caption: block.image.caption.map((rt) => rt.plain_text).join(""),
        };
    }
  });

  return (
    <>
      <div className="py-5 flex flex-col gap-5">
        <div className="">
          <SubNav title={metaData.properties.제목.title[0].plain_text} />
        </div>

        <div className="border-b pb-5">
          <h1 className="text-5xl my-3 mt-10 mb-4">
            {metaData.properties.제목.title[0].plain_text}
          </h1>
          <p className="text-base leading-relaxed text-zinc-300 my-5">
            {metaData.properties.내용.rich_text[0].plain_text}
          </p>
          <span className="text-xs opacity-50">
            {metaData.properties.작성일.date?.start}
          </span>
        </div>
      </div>

      {parsed.map((e: (typeof parsed)[0]) => {
        switch (e.type) {
          case "paragraph":
            return <p key={e.id}>{e.text}</p>;

          case "code":
            return (
              <pre
                key={e.id}
                className="bg-gray-900 text-gray-100 p-4 rounded-md"
              >
                <code className={`language-${e.language}`}>{e.code}</code>
              </pre>
            );

          case "image":
            return (
              <figure key={e.id}>
                <img src={e.url} alt={e.caption} />
                {e.caption && <figcaption>{e.caption}</figcaption>}
              </figure>
            );

          default:
            return <div key={e.id}>Unsupported block: {e.type}</div>;
        }
      })}

      {markdown && (
        <article className="markdown-body bg-transparent!">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              code(props) {
                const { node, ...rest } = props;
                return <i {...rest} />;
              },
            }}
          >
            {markdown}
          </ReactMarkdown>
        </article>
      )}
    </>
  );
}
