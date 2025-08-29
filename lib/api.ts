interface CustomRequestInit<TBody = unknown> extends Omit<RequestInit, "body"> {
  token?: string;
  body?: TBody;
}

export class FetchError extends Error {
  public status: number;
  public body?: string;

  constructor(response: Response, message?: string) {
    super(message || `HTTP error status: ${response.status}`);
    this.name = "FetchError";
    this.status = response.status;
    // body만 저장
    this.body = message;
  }
}

export async function fetcher<TResponse, TBody = unknown>(
  url: string,
  options: CustomRequestInit<TBody> = {}
): Promise<TResponse> {
  const { token, body, ...fetchOptions } = options;
  const headers = new Headers(fetchOptions.headers);

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  // JSON 데이터인 경우 Content-Type 자동 설정 (FormData는 브라우저가 자동 설정)
  if (
    body &&
    typeof body === "object" &&
    !(body instanceof FormData) &&
    !(body instanceof File) &&
    !(body instanceof Blob) &&
    !headers.has("Content-Type")
  ) {
    headers.set("Content-Type", "application/json");
  }

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      headers,
      ...(body && {
        body:
          body instanceof FormData ||
          body instanceof File ||
          body instanceof Blob ||
          typeof body === "string"
            ? body
            : typeof body === "object"
            ? JSON.stringify(body)
            : undefined,
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text().catch(() => "Unknown error");
      const error = new FetchError(response, errorBody);
      throw new Error(error.message);
    }

    if (response.status === 204) {
      return {} as TResponse;
    }

    return response.json() as TResponse;
  } catch (error) {
    throw error;
  }
}

// 간단한 편의 메서드들
export const api = {
  get: <TResponse>(url: string, options?: Omit<CustomRequestInit, "method">) =>
    fetcher<TResponse>(url, { ...options, method: "GET" }),

  post: <TResponse, TBody = unknown>(
    url: string,
    data?: TBody,
    options?: Omit<CustomRequestInit<TBody>, "method" | "body">
  ) =>
    fetcher<TResponse, TBody>(url, { ...options, method: "POST", body: data }),

  put: <TResponse, TBody = unknown>(
    url: string,
    data?: TBody,
    options?: Omit<CustomRequestInit<TBody>, "method" | "body">
  ) =>
    fetcher<TResponse, TBody>(url, { ...options, method: "PUT", body: data }),

  delete: <TResponse>(
    url: string,
    options?: Omit<CustomRequestInit, "method">
  ) => fetcher<TResponse>(url, { ...options, method: "DELETE" }),
};

// 사용 예시
/*
interface CreateUserRequest {
  name: string;
  email: string;
}

interface User {
  id: number;
  name: string;
  email: string;
}

// GET 요청
const user = await fetcher<User>('/api/users/1', { token: 'your-token' });
const users = await api.get<User[]>('/api/users', { token: 'your-token' });

// POST 요청 (JSON)
const newUser = await api.post<User, CreateUserRequest>('/api/users', {
  name: 'John Doe',
  email: 'john@example.com'
}, { token: 'your-token' });

// 파일 업로드
const file = new File(['content'], 'test.txt', { type: 'text/plain' });
const uploadResult = await api.post<{ fileId: string }>('/api/upload', file, {
  token: 'your-token'
});

// FormData 사용
const formData = new FormData();
formData.append('file', file);
formData.append('description', 'Test file');
const formResult = await api.post<{ success: boolean }>('/api/form-upload', formData, {
  token: 'your-token'
});

// 에러 처리
try {
  const data = await api.get<User[]>('/api/data');
} catch (error) {
  if (error instanceof FetchError) {
    console.log(`HTTP ${error.status}`);
  }
}
*/
