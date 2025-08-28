"use server";

import { REVADILTE_PRE } from "@/app/constant/var";
import { revalidateTag } from "next/cache";

export async function revaildateNotionAction({ postId }: { postId: string }) {
  revalidateTag(`${REVADILTE_PRE.POST}:${postId}`);
  revalidateTag(`${REVADILTE_PRE.POST_METADATA}:${postId}`);

  return { success: true, message: "Revalidate complete" };
}
