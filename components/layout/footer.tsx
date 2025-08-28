import Link from "next/link";

export default function Footer() {
  return (
    <footer className="py-5 mt-10 border-t">
      <div className="flex justify-between items-center">
        <div className="text-sm text-muted-foreground">
          <p className="text-xs">개인라이브러리 아카이브</p>{" "}
          <div className="py-3 flex flex-col gap-2">
            <Link
              target="_blank"
              href={"https://www.h-creations.com"}
              className="text-indigo-400 text-xs underline"
            >
              https://www.h-creations.com
            </Link>
            <Link
              target="_blank"
              href={"https://www.blog.h-creations.com/"}
              className="text-indigo-400 text-xs underline"
            >
              https://www.blog.h-creations.com/
            </Link>
          </div>
          <p className="pt-5 text-xs">
            &copy; {new Date().getFullYear()} H-Creations. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
