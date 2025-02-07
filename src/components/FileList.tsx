import React from 'react';
import { GripVertical, Trash2 } from 'lucide-react';
import type { ScriptFile } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface FileListProps {
  files: ScriptFile[];
  onReorder: (dragIndex: number, hoverIndex: number) => void;
  onRemove: (id: string) => void;
}

export function FileList({ files, onReorder, onRemove }: FileListProps) {
  const { t } = useLanguage();

  const handleDragStart = (e: React.DragEvent, index: number) => {
    e.dataTransfer.setData('text/plain', index.toString());
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    const dragIndex = parseInt(e.dataTransfer.getData('text/plain'), 10);
    if (dragIndex !== dropIndex) {
      onReorder(dragIndex, dropIndex);
    }
  };

  return (
    <div className="space-y-2">
      {files.map((file, index) => (
        <div
          key={file.id}
          draggable
          onDragStart={(e) => handleDragStart(e, index)}
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, index)}
          className="flex items-center gap-4 p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
        >
          <button
            className="cursor-move p-2 hover:bg-yellow-50 rounded-lg"
            title={t.files.dragToReorder}
          >
            <GripVertical className="text-yellow-400" />
          </button>
          <span className="flex-1 truncate font-medium text-gray-700">{file.name}</span>
          <button
            onClick={() => onRemove(file.id)}
            className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-colors"
            title={t.actions.remove}
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      ))}
      {files.length === 0 && (
        <p className="text-gray-500 text-center py-4">{t.files.empty}</p>
      )}
    </div>
  );
}