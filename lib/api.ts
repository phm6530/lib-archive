export class APIError extends Error {
  constructor(message: string, public status: number) {
    super(message);
    this.name = "APIError";
  }
}

interface BaseFetchOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  body?: object | FormData | URLSearchParams | string;
  headers?: HeadersInit;
  token?: string;
  tags?: string[];
}

export type FetchOptions =
  | (BaseFetchOptions & {
      cache?: Exclude<RequestCache, "no-store">;
      revalidate?: number;
    })
  | (BaseFetchOptions & {
      cache: "no-store";
      revalidate?: never;
    });

export async function fetcher<T>(
  url: string,
  options: FetchOptions = {}
): Promise<T> {
  const {
    method = "GET",
    body,
    cache,
    revalidate,
    headers = {},
    token,
    tags,
  } = options;

  //소문자로 정규화
  const fetchHeaders: Record<string, string> = {};
  if (headers) {
    if (Array.isArray(headers)) {
      for (const [key, value] of headers) {
        fetchHeaders[key.toLowerCase()] = value;
      }
    } else {
      for (const [key, value] of Object.entries(
        headers as Record<string, string>
      )) {
        fetchHeaders[key.toLowerCase()] = value;
      }
    }
  }

  //token
  if (token) {
    fetchHeaders.authorization = `Bearer ${token}`;
  }

  let requestBody: BodyInit | undefined;
  let inferredContentType: string | undefined;

  const userProvidedContentType = fetchHeaders["content-type"];

  //자료 설저
  if (body instanceof FormData) {
    requestBody = body;
    inferredContentType = undefined;
  } else if (body instanceof URLSearchParams) {
    requestBody = body;
    inferredContentType = "application/x-www-form-urlencoded";
  } else if (typeof body === "string") {
    requestBody = body;
    inferredContentType = "text/plain";
  } else if (body !== undefined && body !== null) {
    requestBody = JSON.stringify(body);
    inferredContentType = "application/json";
  }

  if (!userProvidedContentType && inferredContentType) {
    fetchHeaders["content-type"] = inferredContentType;
  }

  const fetchOptions: RequestInit = {
    method,
    headers: fetchHeaders,
    cache,
    body: requestBody,
  };

  if (tags && tags.length > 0) {
    fetchOptions.next = { ...fetchOptions.next, tags };
  }

  if (revalidate !== undefined) {
    fetchOptions.next = { ...fetchOptions.next, revalidate };
  }

  const response = await fetch(url, fetchOptions);

  if (!response.ok) {
    const errorBody = await response.text();
    console.error("API Error:", errorBody);
    throw new APIError(
      `API request failed: ${response.status} ${response.statusText}`,
      response.status
    );
  }

  // if (tags && tags.length > 0) {
  //   for (const tag of tags) {
  //     revalidateTag(tag);
  //   }
  // }

  return response.json() as Promise<T>;
}
