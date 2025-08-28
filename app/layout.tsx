import type { Metadata } from "next";
import "./globals.css";
import Grid from "@/components/layout/grid";

import Footer from "@/components/layout/footer";
import Nav, { NotionDatabase } from "@/components/layout/nav";
import Providers from "./providers";
import { fetcher } from "@/lib/api";
import {
  NOTION_BASE_URL,
  NOTION_ID,
  NOTION_SEGMENT,
  NOTION_TOKEN,
} from "./constant/var";

export const metadata: Metadata = {
  title: "개인라이브러리 아카이브",
  description: "프론트엔드 개발자 & 퍼블리셔 ",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  //Nav 캐싱 해버리기
  const response = await fetcher(
    `${NOTION_BASE_URL}/${NOTION_SEGMENT.LIST}/${NOTION_ID}`,
    {
      method: "GET",
      headers: {
        "Notion-Version": "2022-06-28",
        authorization: `Bearer ${NOTION_TOKEN}`,
      },
      tags: ["categories"],
      cache: "force-cache",
    }
  );

  return (
    <html lang="ko" className="dark">
      <body className="bg-gradient-to-l to-zinc-950 from-zinc-900 ">
        <Providers>
          <Grid>
            {/* nav */}
            <Nav response={response as NotionDatabase} />
            {children}
            <Footer />
          </Grid>
        </Providers>
      </body>
    </html>
  );
}
