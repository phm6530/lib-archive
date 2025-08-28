"use client";

import { Button } from "@/components/ui/button";
import {
  Database,
  Github,
  CheckCircle,
  Loader2,
  ShieldUser,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { revaildateNotionAction } from "../action/revaildate-notion";
import { revaildateGitAction } from "../action/revaildate-github";
import { useSession } from "next-auth/react";

type ActionType = "notion" | "git";

export default function RevaildateController({
  postId,
  repoName,
}: {
  postId: string;
  repoName?: string;
}) {
  const { data: sessionData } = useSession();
  const [loading, setLoading] = useState<ActionType | null>(null);
  const [success, setSuccess] = useState<ActionType | null>(null);
  const router = useRouter();

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (success) {
      timer = setTimeout(() => {
        setSuccess(null);
      }, 2000);
    }
    return () => clearTimeout(timer);
  }, [success]);

  const handleRevalidate = async (actionType: ActionType) => {
    if (loading) return; // Prevent multiple actions at once

    setLoading(actionType);
    setSuccess(null);

    try {
      const action =
        actionType === "notion" ? revaildateNotionAction : revaildateGitAction;
      const res = await action({ postId });

      if (res?.success) {
        setSuccess(actionType);
        router.refresh();
      } else {
        // Optional: Handle failure case
        console.error(`Revalidation failed for ${actionType}`);
      }
    } catch (error) {
      console.error(`Failed to revalidate ${actionType}:`, error);
    } finally {
      setLoading(null);
    }
  };

  if (!sessionData?.user) {
    return null;
  }

  return (
    <div className="p-5 border border-border rounded-lg mb-5 flex items-center gap-4 bg-zinc-950">
      <ShieldUser className="text-teal-300" size={20} />
      {!!repoName && (
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="bg-transparent text-xs cursor-pointer"
            onClick={() => handleRevalidate("git")}
            disabled={loading !== null}
          >
            {loading === "git" ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Github className="mr-2 h-4 w-4" />
            )}
            Read Me
          </Button>
          {success === "git" && (
            <span className="text-xs text-green-500 flex items-center">
              <CheckCircle className="mr-1 h-4 w-4" />
              Updated!
            </span>
          )}
        </div>
      )}
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          className="bg-transparent text-xs cursor-pointer"
          onClick={() => handleRevalidate("notion")}
          disabled={loading !== null}
        >
          {loading === "notion" ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Database className="mr-2 h-4 w-4" />
          )}
          Notion Db
        </Button>
        {success === "notion" && (
          <span className="text-xs text-green-500 flex items-center">
            <CheckCircle className="mr-1 h-4 w-4" />
            Updated!
          </span>
        )}
      </div>
    </div>
  );
}
