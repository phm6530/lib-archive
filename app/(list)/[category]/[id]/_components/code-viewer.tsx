import { CodeEditor } from "@/components/animate-ui/components/code-editor";

export default function CodeViewer({ code }: { code: string }) {
  return (
    <CodeEditor
      className="w-full h-auto"
      lang="javascript"
      copyButton
      writing={false}
      forceTheme="dark"
    >
      {code}
    </CodeEditor>
  );
}
