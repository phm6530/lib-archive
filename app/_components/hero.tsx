import { Input } from "@/components/ui/input";
import { SearchIcon } from "lucide-react";

export default function HeroBanner() {
  return (
    <>
      <div className="flex flex-col gap-6 pt-20 ">
        <h1 className="text-5xl font-bold">Personal Library</h1>
        <div className="flex flex-col pb-5">
          <p className="text-muted-foreground text-xs">
            React,Next에서 주요 사용될 개인라이브러리 모음입니다.
          </p>

          {/* Search form */}
          <div className="relative mt-10">
            <Input
              className="peer h-8 ps-8 pe-2 py-5 rounded-full"
              placeholder="Search..."
              type="search"
            />
            <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-2 peer-disabled:opacity-50">
              <SearchIcon size={16} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
