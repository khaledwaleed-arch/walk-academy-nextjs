'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function PostsTagsRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/admin/tags');
  }, [router]);
  return (
    <div className="p-8 text-center text-gray-500">
      Redirecting to Tags...
    </div>
  );
}
