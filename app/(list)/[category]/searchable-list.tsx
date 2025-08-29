"use client";

import Libitem from "@/app/_components/lib-item";
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

// page.tsx에서 전달받을 props 타입 정의
interface Post {
  id: string;
  url: string;
  제목: string;
  내용: string;
  카테고리: string;
  작성일: string;
  stack: { id: string; name: string; color: string }[];
}

interface SearchableListProps {
  initialPosts: Post[];
}

export default function SearchableList({ initialPosts }: SearchableListProps) {
  const searchParams = useSearchParams();
  const keyword = searchParams.get("keyword");

  const [filteredPosts, setFilteredPosts] = useState(initialPosts);

  useEffect(() => {
    if (keyword) {
      const lowercasedKeyword = keyword.toLowerCase();
      const newFilteredPosts = initialPosts.filter(
        (post) =>
          post.제목.toLowerCase().includes(lowercasedKeyword) ||
          post.내용.toLowerCase().includes(lowercasedKeyword)
      );
      setFilteredPosts(newFilteredPosts);
    } else {
      setFilteredPosts(initialPosts);
    }
  }, [keyword, initialPosts]);

  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 ">
      {filteredPosts.map((post, idx) => (
        <Libitem key={`${post.id}-${idx}`} {...post} />
      ))}
    </div>
  );
}
