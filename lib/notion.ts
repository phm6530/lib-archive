import { NOTION_TOKEN } from "@/app/constant/var";

// Define a custom error class for better error handling
export class NotionAPIError extends Error {
  constructor(message: string, public status: number) {
    super(message);
    this.name = "NotionAPIError";
  }
}

interface FetchOptions {
  method?: "GET" | "POST";
  body?: object;
  cache?: RequestCache;
  revalidate?: number;
  headers?: HeadersInit;
}

export async function notionFetch(url: string, options: FetchOptions = {}) {
  const {
    method = "POST",
    body,
    cache = "no-store",
    revalidate,
    headers = {},
  } = options;

  const defaultHeaders = {
    "Notion-Version": "2022-06-28",
    Authorization: `Bearer ${NOTION_TOKEN}`,
    "Content-Type": "application/json",
  };

  const fetchOptions: RequestInit = {
    method,
    headers: { ...defaultHeaders, ...headers },
    cache,
  };

  if (revalidate !== undefined) {
    fetchOptions.next = { revalidate };
  }

  if (method !== "GET" && body) {
    fetchOptions.body = JSON.stringify(body);
  }

  const response = await fetch(url, fetchOptions);

  if (!response.ok) {
    const errorBody = await response.text();
    console.error("Notion API Error:", errorBody);
    throw new NotionAPIError(
      `Notion API request failed: ${response.status} ${response.statusText}`,
      response.status
    );
  }

  return response.json();
}
