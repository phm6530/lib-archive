"use client";

import { Button } from "@/components/ui/button";
import { CheckCircle, Loader2, ShieldUser, Layers } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { revalidateCategoryAction } from "../action/revalidate-category";

export default function CategoryRevaildateController({
  category,
}: {
  category: string;
}) {
  const { data: sessionData } = useSession();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (success) {
      timer = setTimeout(() => setSuccess(false), 2000);
    }
    return () => clearTimeout(timer);
  }, [success]);

  const handleRevalidate = async () => {
    if (loading) return;

    setLoading(true);
    setSuccess(false);

    try {
      const res = await revalidateCategoryAction({ category });
      if (res?.success) {
        setSuccess(true);
        router.refresh();
      } else {
        console.error(`Revalidation failed for ${category}`);
      }
    } catch (error) {
      console.error(`Failed to revalidate ${category}:`, error);
    } finally {
      setLoading(false);
    }
  };

  if (!sessionData?.user) {
    return null;
  }

  return (
    <div className="p-5 rounded-lg flex items-center gap-4 bg-zinc-900">
      <ShieldUser className="text-teal-300" size={20} />
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          className="bg-transparent text-xs cursor-pointer"
          onClick={handleRevalidate}
          disabled={loading}
        >
          {loading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Layers className="mr-2 h-4 w-4" />
          )}
          Revalidate Category: {category}
        </Button>
        {success && (
          <span className="text-xs text-green-500 flex items-center">
            <CheckCircle className="mr-1 h-4 w-4" />
            Updated!
          </span>
        )}
      </div>
    </div>
  );
}
