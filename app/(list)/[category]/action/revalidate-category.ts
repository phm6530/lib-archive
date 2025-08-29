"use server";

import { REVADILTE_PRE } from "@/app/constant/var";
import { revalidateTag } from "next/cache";

export async function revalidateCategoryAction({
  category,
}: {
  category: string;
}) {
  revalidateTag(category);
  revalidateTag(REVADILTE_PRE.ALL_LIST);

  return { success: true, message: "Revalidate complete" };
}
