"use client";
import { Input } from "@/components/ui/input";
import { SearchIcon } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

export default function HeroBanner({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const [value, setValue] = useState<string | null>(
    searchParams.get("keyword")
  );

  useEffect(() => {
    setValue(searchParams.get("keyword"));
  }, [searchParams]);

  const searchHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (value) {
      router.push(`${pathname}?keyword=${value}`);
    } else {
      router.push(pathname);
    }
  };

  return (
    <>
      <div className="flex flex-col gap-6 pt-10 pb-5">
        <h1 className="text-5xl md:text-6xl font-bold tracking-wide leading-tight whitespace-pre-line">
          {title}
        </h1>
        <div className="flex flex-col pb-5">
          <p className="text-muted-foreground text-sm ">{description}</p>
          <form onSubmit={searchHandler}>
            {/* Search form */}
            <div className="relative mt-10">
              <Input
                value={value ?? ""}
                className="peer h-8 ps-12 pe-2 py-7 rounded-full"
                placeholder="Find a library..."
                type="search"
                onChange={(e) => setValue(e.target.value)}
              />
              <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-4 peer-disabled:opacity-50">
                <SearchIcon size={16} />
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
