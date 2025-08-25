import { ReactNode } from "react";
import SubNav from "../_components/sub-nav";

export default async function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <div className="flex flex-col gap-6 py-10">
        <h1 className="text-3xl font-bold">Personal Library</h1>
        <div className="flex flex-col">
          <p className="text-muted-foreground text-xs">
            React,Next에서 주요 사용될 개인라이브러리 모음입니다.
          </p>
        </div>
        <SubNav />
      </div>

      <div className="py-4">{children}</div>
    </>
  );
}
