import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useState } from "react";

function CodeBlock({
  inline,
  className,
  children,
  ...props
}: {
  inline?: boolean;
  className?: string;
  children?: React.ReactNode;
}) {
  const [copied, setCopied] = useState(false);

  const match = /language-(\w+)/.exec(className || "");

  if (!inline) {
    const codeText = String(children).replace(/\n$/, "");

    return (
      <div className="relative my-4">
        <pre className="bg-gray-900 text-gray-100 p-4 rounded-md overflow-x-auto">
          <code className={match ? `language-${match[1]}` : ""} {...props}>
            {codeText}
          </code>
        </pre>
        <button
          onClick={() => {
            navigator.clipboard.writeText(codeText);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
          }}
          className="absolute top-2 right-2 text-xs bg-gray-700 px-2 py-1 rounded"
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
    );
  }

  return (
    <code className="bg-gray-200 text-red-500 px-1 rounded" {...props}>
      {children}
    </code>
  );
}

export default function MarkdownWithCopy({ markdown }: { markdown: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        code: CodeBlock, // ✅ 컴포넌트로 전달
      }}
    >
      {markdown}
    </ReactMarkdown>
  );
}
