'use server';

import { REVADILTE_PRE } from "@/app/constant/var";
import { revalidateTag } from "next/cache";

export async function revalidateCategoryAction({ category }: { category: string }) {
  // 특정 카테고리 페이지 캐시를 무효화
  revalidateTag(`${REVADILTE_PRE.CATEGORY}:${category}`);
  
  // 카테고리 목록 전체 캐시도 함께 무효화 (generateStaticParams 결과 갱신)
  revalidateTag(REVADILTE_PRE.CATEGORY);

  return { success: true, message: "Revalidate complete" };
}
