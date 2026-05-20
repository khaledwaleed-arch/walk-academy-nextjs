"use client";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import { useCallback, useEffect } from "react";

interface Props {
  value: string;
  onChange: (html: string) => void;
  onImageInsert?: () => void;
  placeholder?: string;
}

function Toolbar({ editor, onImageInsert }: { editor: ReturnType<typeof useEditor>; onImageInsert?: () => void }) {
  if (!editor) return null;

  const btn = (active: boolean, action: () => void, icon: React.ReactNode, title: string) => (
    <button type="button" title={title} onClick={action}
      className={`p-1.5 rounded text-sm ${active ? "bg-[#2271b1] text-white" : "text-gray-600 hover:bg-gray-100"}`}>
      {icon}
    </button>
  );

  return (
    <div className="border-b border-gray-200 bg-gray-50 px-2 py-1.5 flex flex-wrap gap-0.5 items-center">
      {/* Heading */}
      <select
        value={editor.isActive("heading", { level: 1 }) ? "h1" : editor.isActive("heading", { level: 2 }) ? "h2" : editor.isActive("heading", { level: 3 }) ? "h3" : "p"}
        onChange={(e) => {
          const v = e.target.value;
          if (v === "p") editor.chain().focus().setParagraph().run();
          else editor.chain().focus().toggleHeading({ level: parseInt(v[1]) as 1 | 2 | 3 }).run();
        }}
        className="text-xs border border-gray-200 rounded px-1 py-1 bg-white text-gray-700 mr-1"
      >
        <option value="p">فقرة</option>
        <option value="h1">عنوان 1</option>
        <option value="h2">عنوان 2</option>
        <option value="h3">عنوان 3</option>
      </select>

      <div className="w-px h-5 bg-gray-200 mx-1" />

      {btn(editor.isActive("bold"), () => editor.chain().focus().toggleBold().run(), <strong>B</strong>, "عريض")}
      {btn(editor.isActive("italic"), () => editor.chain().focus().toggleItalic().run(), <em>I</em>, "مائل")}
      {btn(editor.isActive("underline"), () => editor.chain().focus().toggleUnderline().run(), <u>U</u>, "تحته خط")}
      {btn(editor.isActive("strike"), () => editor.chain().focus().toggleStrike().run(), <s>S</s>, "يتوسطه خط")}

      <div className="w-px h-5 bg-gray-200 mx-1" />

      {btn(editor.isActive({ textAlign: "right" }), () => editor.chain().focus().setTextAlign("right").run(),
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3 5h14a1 1 0 010 2H3a1 1 0 010-2zm4 4h10a1 1 0 010 2H7a1 1 0 010-2zm-4 4h14a1 1 0 010 2H3a1 1 0 010-2z" clipRule="evenodd" /></svg>, "يمين")}
      {btn(editor.isActive({ textAlign: "center" }), () => editor.chain().focus().setTextAlign("center").run(),
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3 5h14a1 1 0 010 2H3a1 1 0 010-2zm2 4h10a1 1 0 010 2H5a1 1 0 010-2zm-2 4h14a1 1 0 010 2H3a1 1 0 010-2z" clipRule="evenodd" /></svg>, "وسط")}
      {btn(editor.isActive({ textAlign: "left" }), () => editor.chain().focus().setTextAlign("left").run(),
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3 5h14a1 1 0 010 2H3a1 1 0 010-2zm0 4h10a1 1 0 010 2H3a1 1 0 010-2zm0 4h14a1 1 0 010 2H3a1 1 0 010-2z" clipRule="evenodd" /></svg>, "يسار")}

      <div className="w-px h-5 bg-gray-200 mx-1" />

      {btn(editor.isActive("bulletList"), () => editor.chain().focus().toggleBulletList().run(),
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3 4a1 1 0 100 2 1 1 0 000-2zm0 6a1 1 0 100 2 1 1 0 000-2zm0 6a1 1 0 100 2 1 1 0 000-2zM7 5a1 1 0 011-1h9a1 1 0 110 2H8a1 1 0 01-1-1zm0 6a1 1 0 011-1h9a1 1 0 110 2H8a1 1 0 01-1-1zm0 6a1 1 0 011-1h9a1 1 0 110 2H8a1 1 0 01-1-1z" clipRule="evenodd" /></svg>, "قائمة")}
      {btn(editor.isActive("orderedList"), () => editor.chain().focus().toggleOrderedList().run(),
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3 4a1 1 0 100 2 1 1 0 000-2zM7 5a1 1 0 011-1h9a1 1 0 110 2H8a1 1 0 01-1-1zm-4 6a1 1 0 100 2 1 1 0 000-2zm4 1a1 1 0 011-1h9a1 1 0 110 2H8a1 1 0 01-1-1zm-4 6a1 1 0 100 2 1 1 0 000-2zm4 1a1 1 0 011-1h9a1 1 0 110 2H8a1 1 0 01-1-1z" clipRule="evenodd" /></svg>, "قائمة مرقمة")}
      {btn(editor.isActive("blockquote"), () => editor.chain().focus().toggleBlockquote().run(),
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3 5a1 1 0 011-1h4a1 1 0 010 2H4a1 1 0 01-1-1zm0 6a1 1 0 011-1h4a1 1 0 010 2H4a1 1 0 01-1-1zM8 4a1 1 0 011 1v6a1 1 0 01-2 0V5a1 1 0 011-1zm5-1a1 1 0 011 1v8a1 1 0 01-2 0V4a1 1 0 011-1z" clipRule="evenodd" /></svg>, "اقتباس")}

      <div className="w-px h-5 bg-gray-200 mx-1" />

      {/* Link */}
      <button type="button" title="رابط" onClick={() => {
        const url = window.prompt("أدخل الرابط:", "https://");
        if (url) editor.chain().focus().setLink({ href: url }).run();
      }}
        className={`p-1.5 rounded text-sm ${editor.isActive("link") ? "bg-[#2271b1] text-white" : "text-gray-600 hover:bg-gray-100"}`}>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
      </button>

      {/* Image */}
      {onImageInsert && (
        <button type="button" title="صورة" onClick={onImageInsert}
          className="p-1.5 rounded text-sm text-gray-600 hover:bg-gray-100">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
        </button>
      )}

      <div className="w-px h-5 bg-gray-200 mx-1" />

      {/* Code */}
      {btn(editor.isActive("code"), () => editor.chain().focus().toggleCode().run(),
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>, "كود")}

      {/* Undo/Redo */}
      <div className="w-px h-5 bg-gray-200 mx-1" />
      <button type="button" title="تراجع" onClick={() => editor.chain().focus().undo().run()} className="p-1.5 rounded text-gray-600 hover:bg-gray-100">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" /></svg>
      </button>
      <button type="button" title="إعادة" onClick={() => editor.chain().focus().redo().run()} className="p-1.5 rounded text-gray-600 hover:bg-gray-100">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10H11a8 8 0 00-8 8v2m18-10l-6 6m6-6l-6-6" /></svg>
      </button>
    </div>
  );
}

export default function RichEditor({ value, onChange, onImageInsert, placeholder }: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Image.configure({ inline: false, allowBase64: true }),
      Link.configure({ openOnClick: false }),
      Placeholder.configure({ placeholder: placeholder || "ابدأ الكتابة هنا..." }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    content: value,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: { class: "min-h-[400px] px-4 py-3 focus:outline-none prose prose-sm max-w-none" },
    },
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [value]);

  const insertImage = useCallback((url: string) => {
    editor?.chain().focus().setImage({ src: url }).run();
  }, [editor]);

  // expose insertImage globally for media picker
  useEffect(() => {
    (window as any).__tiptapInsertImage = insertImage;
  }, [insertImage]);

  return (
    <div className="border border-gray-200 rounded-md overflow-hidden bg-white">
      <Toolbar editor={editor} onImageInsert={onImageInsert} />
      <EditorContent editor={editor} dir="auto" />
    </div>
  );
}
