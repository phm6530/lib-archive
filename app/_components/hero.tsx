import { Input } from "@/components/ui/input";
import { SearchIcon } from "lucide-react";

export default function HeroBanner({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <>
      <div className="flex flex-col gap-6 pt-10 pb-5">
        <h1 className="text-5xl font-bold tracking-wide">{title}</h1>
        <div className="flex flex-col pb-5">
          <p className="text-muted-foreground text-sm">{description}</p>

          {/* Search form */}
          <div className="relative mt-10">
            <Input
              className="peer h-8 ps-12 pe-2 py-7 rounded-lg"
              placeholder="Search libraries by name or description"
              type="search"
            />
            <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-4 peer-disabled:opacity-50">
              <SearchIcon size={16} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
