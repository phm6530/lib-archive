"use server";

import { REVADILTE_PRE } from "@/app/constant/var";
import { revalidateTag } from "next/cache";

export async function revaildateGitAction({ postId }: { postId: string }) {
  revalidateTag(`${REVADILTE_PRE.GIT}:${postId}`);

  return { success: true, message: "Revalidate complete" };
}
