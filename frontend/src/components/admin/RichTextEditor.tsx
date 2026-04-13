'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import ImageExtension from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import TextAlign from '@tiptap/extension-text-align';
import LinkExtension from '@tiptap/extension-link';
import { useRef, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import { uploadApi, getImageUrl } from '@/lib/api';
import {
  Bold, Italic, Strikethrough, Heading1, Heading2, Heading3,
  List, ListOrdered, AlignLeft, AlignCenter, AlignRight,
  Image as ImageIcon, Link as LinkIcon, Undo, Redo, Quote,
} from 'lucide-react';

interface Props {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function RichTextEditor({ value, onChange, placeholder = 'Nhập nội dung...' }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isInternalChange = useRef(false);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      ImageExtension.configure({ inline: false, allowBase64: false }),
      Placeholder.configure({ placeholder }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      LinkExtension.configure({ openOnClick: false, HTMLAttributes: { rel: 'noopener noreferrer' } }),
    ],
    content: value || '',
    onUpdate({ editor }) {
      isInternalChange.current = true;
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: { class: 'tiptap-editor' },
    },
  });

  // Sync external value changes (e.g. when switching tabs)
  useEffect(() => {
    if (!editor || isInternalChange.current) {
      isInternalChange.current = false;
      return;
    }
    const current = editor.getHTML();
    if (current !== value && value !== undefined) {
      editor.commands.setContent(value || '');
    }
  }, [value, editor]);

  const handleImageUpload = useCallback(async (file: File) => {
    if (!file) return;
    try {
      const res = await uploadApi.image(file);
      const url = getImageUrl(res.data.url);
      editor?.chain().focus().setImage({ src: url, alt: file.name }).run();
    } catch {
      toast.error('Upload ảnh thất bại');
    }
  }, [editor]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleImageUpload(file);
    e.target.value = '';
  };

  const setLink = useCallback(() => {
    const prev = editor?.getAttributes('link').href ?? '';
    const url = window.prompt('Nhập URL:', prev);
    if (url === null) return;
    if (url === '') { editor?.chain().focus().extendMarkRange('link').unsetLink().run(); return; }
    editor?.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  }, [editor]);

  if (!editor) return null;

  const btn = (active: boolean, title: string, onClick: () => void, children: React.ReactNode) => (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={`p-1.5 rounded-lg transition-colors ${active ? 'bg-blue-100 text-blue-700' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-800'}`}
    >
      {children}
    </button>
  );

  const divider = () => <div className="w-px h-5 bg-gray-200 mx-0.5" />;

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 px-3 py-2 border-b border-gray-200 bg-gray-50">
        {/* History */}
        {btn(false, 'Hoàn tác', () => editor.chain().focus().undo().run(), <Undo size={15} />)}
        {btn(false, 'Làm lại', () => editor.chain().focus().redo().run(), <Redo size={15} />)}
        {divider()}

        {/* Headings */}
        {btn(editor.isActive('heading', { level: 1 }), 'Tiêu đề 1', () => editor.chain().focus().toggleHeading({ level: 1 }).run(), <Heading1 size={15} />)}
        {btn(editor.isActive('heading', { level: 2 }), 'Tiêu đề 2', () => editor.chain().focus().toggleHeading({ level: 2 }).run(), <Heading2 size={15} />)}
        {btn(editor.isActive('heading', { level: 3 }), 'Tiêu đề 3', () => editor.chain().focus().toggleHeading({ level: 3 }).run(), <Heading3 size={15} />)}
        {divider()}

        {/* Marks */}
        {btn(editor.isActive('bold'), 'In đậm', () => editor.chain().focus().toggleBold().run(), <Bold size={15} />)}
        {btn(editor.isActive('italic'), 'In nghiêng', () => editor.chain().focus().toggleItalic().run(), <Italic size={15} />)}
        {btn(editor.isActive('strike'), 'Gạch ngang', () => editor.chain().focus().toggleStrike().run(), <Strikethrough size={15} />)}
        {divider()}

        {/* Lists */}
        {btn(editor.isActive('bulletList'), 'Danh sách', () => editor.chain().focus().toggleBulletList().run(), <List size={15} />)}
        {btn(editor.isActive('orderedList'), 'Danh sách số', () => editor.chain().focus().toggleOrderedList().run(), <ListOrdered size={15} />)}
        {btn(editor.isActive('blockquote'), 'Trích dẫn', () => editor.chain().focus().toggleBlockquote().run(), <Quote size={15} />)}
        {divider()}

        {/* Align */}
        {btn(editor.isActive({ textAlign: 'left' }), 'Căn trái', () => editor.chain().focus().setTextAlign('left').run(), <AlignLeft size={15} />)}
        {btn(editor.isActive({ textAlign: 'center' }), 'Căn giữa', () => editor.chain().focus().setTextAlign('center').run(), <AlignCenter size={15} />)}
        {btn(editor.isActive({ textAlign: 'right' }), 'Căn phải', () => editor.chain().focus().setTextAlign('right').run(), <AlignRight size={15} />)}
        {divider()}

        {/* Link & Image */}
        {btn(editor.isActive('link'), 'Chèn liên kết', setLink, <LinkIcon size={15} />)}
        <button
          type="button"
          title="Chèn hình ảnh từ máy tính"
          onClick={() => fileInputRef.current?.click()}
          className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-800 transition-colors"
        >
          <ImageIcon size={15} />
        </button>
      </div>

      {/* Editor content */}
      <div className="tiptap-editor bg-white">
        <EditorContent editor={editor} />
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}
