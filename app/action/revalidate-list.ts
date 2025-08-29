'use server';

import { revalidateTag } from 'next/cache';

export async function revalidateList() {
  revalidateTag('list');
}
