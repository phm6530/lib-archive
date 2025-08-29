import { NOTION_BASE_URL, NOTION_TOKEN } from "@/app/constant/var";
import { fetcher } from "./api";

export async function queryNotionDatabase<T>(
  endpoint: string,
  options?: Omit<RequestInit, "body"> & {
    body?: unknown;
  }
): Promise<T> {
  const url = `${NOTION_BASE_URL}/${endpoint}`;

  return fetcher<T>(url, {
    ...options,
    headers: {
      "Notion-Version": "2022-06-28",
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    token: NOTION_TOKEN,
  });
}
