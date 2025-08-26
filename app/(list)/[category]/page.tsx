import HeroBanner from "@/app/_components/hero";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { notFound } from "next/navigation";

const libraries = {
  react: [
    {
      name: "@FullPage-lib/React",
      description: "full page 개인라이브러리",
    },
    {
      name: "@Modal-lib/React",
      description: "modal 개인라이브러리",
    },
  ],
  utils: [
    {
      name: "cn",
      description: "utility function for tailwind-merge",
    },
  ],
  hooks: [
    {
      name: "use-local-storage",
      description: "custom hook for local storage",
    },
  ],
  animation: [
    {
      name: "use-local-storage",
      description: "custom hook for local storage",
    },
  ],
};

type Category = keyof typeof libraries;

export default async function LibsPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;

  if (!Object.keys(libraries).includes(category)) {
    notFound();
  }

  const libs = libraries[category as Category] || [];

  return (
    <>
      <HeroBanner />
      <div className="flex w-full flex-col gap-6 ">
        {libs.map((lib) => (
          <Card key={lib.name} className="">
            <CardHeader>
              <CardTitle>{lib.name}</CardTitle>
              <CardDescription className="text-xs mt-3">
                {lib.description}
              </CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </>
  );
}
