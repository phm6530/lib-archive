"use server";

import {
  NOTION_BASE_URL,
  NOTION_ID,
  NOTION_SEGMENT,
  NOTION_TOKEN,
} from "@/app/constant/var";
import { unstable_cache } from "next/cache";

interface NotionDatabase {
  properties: {
    카테고리: {
      select: {
        options: Array<{
          name: string;
        }>;
      };
    };
  };
}

export const getCategories = unstable_cache(
  async () => {
    try {
      const response = await fetch(
        `${NOTION_BASE_URL}/${NOTION_SEGMENT.LIST}/${NOTION_ID}`,
        {
          method: "GET",
          headers: {
            "Notion-Version": "2022-06-28",
            authorization: `Bearer ${NOTION_TOKEN}`,
          },
          next: {
            tags: ["categories"],
          },
          cache: "force-cache",
        }
      );

      if (!response.ok) {
        console.error(
          "--- [Server Action] Failed to fetch categories:",
          response.statusText
        );
        return [];
      }

      const result = (await response.json()) as NotionDatabase;
      console.log("--- [Server Action] Fetched categories result:", result);

      const notionCategories =
        result.properties.카테고리.select.options.map((e) => {
          return {
            name: e.name,
            path: `/${e.name.toLowerCase()}`,
          };
        }) ?? [];

      const categories = [{ name: "Home", path: "/" }, ...notionCategories];
      console.log("--- [Server Action] Processed categories:", categories);
      return categories;
    } catch (error) {
      console.error("--- [Server Action] Error fetching categories:", error);
      return [];
    }
  },
  ["categories"],
  {
    tags: ["categories"],
  }
);
