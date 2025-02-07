import React, { useCallback } from 'react';
import { Upload } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface FileUploaderProps {
  onFilesSelected: (files: File[]) => void;
  multiple?: boolean;
  accept?: string;
  variant?: 'default' | 'separation';
}

export function FileUploader({
  onFilesSelected,
  multiple = true,
  accept = '.txt',
  variant = 'default'
}: FileUploaderProps) {
  const { t } = useLanguage();

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    onFilesSelected(files);
  }, [onFilesSelected]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    onFilesSelected(files);
  }, [onFilesSelected]);

  return (
    <div
      className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-yellow-500 transition-colors bg-white shadow-sm"
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
    >
      <input
        type="file"
        multiple={multiple}
        accept={accept}
        onChange={handleFileInput}
        className="hidden"
        id="file-upload"
      />
      <label
        htmlFor="file-upload"
        className="cursor-pointer flex flex-col items-center gap-4"
      >
        <Upload className="w-12 h-12 text-yellow-500" />
        <div>
          <p className="text-lg font-medium text-gray-700">
            {variant === 'default' ? t.upload.dropzone : t.separation.dropzone}
          </p>
          <p className="text-sm text-gray-500">
            {t.upload.onlyTxt}
          </p>
        </div>
      </label>
    </div>
  );
}