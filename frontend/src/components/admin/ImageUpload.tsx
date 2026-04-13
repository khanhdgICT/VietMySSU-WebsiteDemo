'use client';

import { useRef, useState } from 'react';
import { Upload, X, ImageIcon } from 'lucide-react';
import { uploadApi, getImageUrl } from '@/lib/api';
import { toast } from 'react-toastify';

interface Props {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}

export default function ImageUpload({ value, onChange, label = 'Ảnh đại diện' }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Vui lòng chọn file ảnh');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Ảnh không được vượt quá 5MB');
      return;
    }
    setUploading(true);
    try {
      const res = await uploadApi.image(file);
      onChange(getImageUrl(res.data.url));
      toast.success('Upload ảnh thành công');
    } catch {
      toast.error('Upload ảnh thất bại');
    } finally {
      setUploading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = '';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const previewUrl = getImageUrl(value);

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
      {previewUrl ? (
        <div className="relative rounded-xl overflow-hidden border border-gray-200 bg-gray-50 group">
          <img src={previewUrl} alt="Preview" className="w-full h-48 object-cover" />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="flex items-center gap-1.5 bg-white text-gray-800 px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors"
            >
              <Upload size={14} /> Thay ảnh
            </button>
            <button
              type="button"
              onClick={() => onChange('')}
              className="flex items-center gap-1.5 bg-red-500 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-red-600 transition-colors"
            >
              <X size={14} /> Xóa
            </button>
          </div>
        </div>
      ) : (
        <div
          onClick={() => inputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-gray-300 rounded-xl h-40 cursor-pointer hover:border-blue-400 hover:bg-blue-50/50 transition-colors"
        >
          {uploading ? (
            <div className="flex items-center gap-2 text-blue-600 text-sm font-medium">
              <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
              Đang upload...
            </div>
          ) : (
            <>
              <ImageIcon size={28} className="text-gray-400" />
              <p className="text-sm text-gray-500 font-medium">Nhấn để chọn ảnh</p>
              <p className="text-xs text-gray-400">hoặc kéo thả vào đây · JPG, PNG, GIF, WebP · Tối đa 5MB</p>
            </>
          )}
        </div>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
        onChange={handleChange}
        className="hidden"
      />
    </div>
  );
}
