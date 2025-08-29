"use server";

import { REVADILTE_PRE } from "@/app/constant/var";
import { revalidateTag } from "next/cache";

export async function revalidateListAction() {
  // 카테고리 목록 전체 캐시를 무효화
  revalidateTag(REVADILTE_PRE.ALL_LIST);

  return { success: true, message: "Revalidate complete" };
}
