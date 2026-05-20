"use client";
import PostEditor from "../_editor";
import { useParams } from "next/navigation";

export default function EditPostPage() {
  const { id } = useParams<{ id: string }>();
  return <PostEditor postId={id} />;
}
