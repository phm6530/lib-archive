import { NOTION_BASE_URL, NOTION_TOKEN } from "@/app/constant/var";
import { fetcher, FetchOptions } from "./api";

interface NotionQueryBody {
  filter?: object;
  sorts?: object[];
  start_cursor?: string;
  page_size?: number;
}

export async function queryNotionDatabase<T>(
  endpoint: string,
  body: NotionQueryBody,
  options?: { cache?: RequestCache; revalidate?: number }
): Promise<T> {
  const url = `${NOTION_BASE_URL}/${endpoint}`;

  const headers = {
    "Notion-Version": "2022-06-28",
    Accept: "application/json",
  };

  let fetcherOptions: FetchOptions;

  if (options?.cache === "no-store") {
    fetcherOptions = {
      method: "POST",
      body,
      headers,
      token: NOTION_TOKEN,
      cache: "no-store",
    };
  } else {
    fetcherOptions = {
      method: "POST",
      body,
      headers,
      token: NOTION_TOKEN,
      cache: options?.cache,
      revalidate: options?.revalidate,
    };
  }

  return fetcher<T>(url, fetcherOptions);
}
