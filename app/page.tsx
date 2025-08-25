import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

const libraries = [
  {
    name: "React",
    description: "React & Next 사용 기반 라이브러리",
    href: "/libs/react",
  },
  {
    name: "Utils",
    description: "Utility functions.",
    href: "/libs/utils",
  },
  {
    name: "Hooks",
    description: "Custom React hooks.",
    href: "/libs/hooks",
  },
  {
    name: "animation",
    description: "Custom React hooks.",
    href: "/libs/hooks",
  },
];

const stack = ["JavaScript", "TypeScript", "Vite"];

export default function Home() {
  return (
    <div className="flex flex-col gap-6 pt-10 ">
      <h1 className="text-3xl font-bold">Personal Library</h1>
      <div className="flex flex-col">
        <p className="text-muted-foreground text-xs">
          React,Next에서 주요 사용될 개인라이브러리 모음입니다.
        </p>
        <p className="text-muted-foreground text-xs flex gap-1 items-center mt-2">
          {stack.map((sn, idx) => (
            <span key={idx}>{sn} / </span>
          ))}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 mt-7">
        {libraries.map((lib, idx) => (
          <Link href={lib.href} key={`${lib.name}-${idx}`}>
            <Card className="cursor-pointer transition-colors border-indigo-200/20 hover:border-indigo-300">
              <CardHeader>
                <CardTitle className="text-xl">{lib.name}</CardTitle>
                <CardDescription>{lib.description}</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
