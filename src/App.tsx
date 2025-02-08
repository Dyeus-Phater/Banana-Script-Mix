import React, { useState, useCallback } from 'react';
import { FileUploader } from './components/FileUploader';
import { FileList } from './components/FileList';
import { LanguageSelector } from './components/LanguageSelector';
import { DonationPopup } from './components/DonationPopup';
import { Download, Upload, Combine, Split, ArrowDownAZ, HelpCircle } from 'lucide-react';
import type { ScriptFile } from './types';
import { readFileAsText, downloadFile, downloadFilesAsZip, separateScripts } from './utils/fileHandlers';
import { useLanguage } from './contexts/LanguageContext';

function App() {
  const { t } = useLanguage();
  const [files, setFiles] = useState<ScriptFile[]>([]);
  const [mode, setMode] = useState<'combine' | 'separate'>('combine');
  const [error, setError] = useState<string | null>(null);
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  const handleFilesSelected = useCallback(async (newFiles: File[]) => {
    setError(null);
    
    if (mode === 'combine') {
      try {
        const scriptFiles: ScriptFile[] = await Promise.all(
          newFiles.map(async (file, index) => ({
            id: crypto.randomUUID(),
            name: file.name,
            content: await readFileAsText(file),
            order: files.length + index,
            timestamp: new Date().toISOString(),
          }))
        );
        setFiles((prev) => [...prev, ...scriptFiles]);
      } catch (error) {
        setError(t.upload.error);
      }
    } else {
      try {
        if (newFiles.length !== 1) {
          throw new Error(t.separation.singleFile);
        }

        const combinedFile = newFiles[0];
        const separatedFiles = await separateScripts(combinedFile);
        setFiles(separatedFiles);
        await downloadFilesAsZip(separatedFiles);
      } catch (error) {
        const message = error instanceof Error ? error.message : t.separation.error;
        setError(message);
        console.error('Error separating files:', error);
      }
    }
  }, [files.length, mode, t]);

  const handleReorder = useCallback((dragIndex: number, hoverIndex: number) => {
    setFiles((prev) => {
      const newFiles = [...prev];
      const [removed] = newFiles.splice(dragIndex, 1);
      newFiles.splice(hoverIndex, 0, removed);
      return newFiles.map((file, index) => ({ ...file, order: index }));
    });
  }, []);

  const handleSortAlphabetically = useCallback(() => {
    setFiles((prev) => {
      const sorted = [...prev].sort((a, b) => a.name.localeCompare(b.name));
      return sorted.map((file, index) => ({ ...file, order: index }));
    });
  }, []);

  const handleRemove = useCallback((id: string) => {
    setFiles((prev) => prev.filter((file) => file.id !== id));
  }, []);

  const handleCombine = useCallback(() => {
    if (files.length === 0) return;

    const combined = files
      .sort((a, b) => a.order - b.order)
      .map((file) => {
        return [
          `--- START ${file.name} ---`,
          file.content,
          `--- END ${file.name} ---`,
          '',
        ].join('\n');
      })
      .join('\n');

    downloadFile(combined, 'combined_scripts.txt');
  }, [files]);

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-yellow-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <button 
            onClick={handleRefresh}
            className="text-3xl font-bold text-yellow-800 hover:text-yellow-900 transition-colors flex items-center gap-2"
          >
            🍌 {t.title}
          </button>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsHelpOpen(true)}
              className="p-2 hover:bg-yellow-100 rounded-lg transition-colors"
              title="Help & Donations"
            >
              <HelpCircle className="w-5 h-5 text-yellow-600" />
            </button>
            <LanguageSelector />
          </div>
        </div>

        <div className="space-y-8">
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => {
                setMode('combine');
                setError(null);
                setFiles([]);
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                mode === 'combine'
                  ? 'bg-yellow-500 text-white'
                  : 'bg-white text-gray-700 hover:bg-yellow-50'
              }`}
            >
              <Combine className="w-5 h-5" />
              {t.actions.combine}
            </button>
            <button
              onClick={() => {
                setMode('separate');
                setError(null);
                setFiles([]);
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                mode === 'separate'
                  ? 'bg-yellow-500 text-white'
                  : 'bg-white text-gray-700 hover:bg-yellow-50'
              }`}
            >
              <Split className="w-5 h-5" />
              {t.actions.separate}
            </button>
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          <FileUploader
            onFilesSelected={handleFilesSelected}
            variant={mode === 'separate' ? 'separation' : 'default'}
            multiple={mode === 'combine'}
          />

          {mode === 'combine' && files.length > 0 && (
            <>
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-yellow-800">{t.files.title}</h2>
                  <button
                    onClick={handleSortAlphabetically}
                    className="flex items-center gap-2 px-3 py-1.5 text-sm bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 transition-colors"
                    title={t.files.sortAlphabetically}
                  >
                    <ArrowDownAZ className="w-4 h-4" />
                    {t.files.sortAlphabetically}
                  </button>
                </div>
                <FileList
                  files={files}
                  onReorder={handleReorder}
                  onRemove={handleRemove}
                />
              </div>

              <div className="flex justify-center">
                <button
                  onClick={handleCombine}
                  className="flex items-center gap-2 px-6 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors shadow-sm hover:shadow-md"
                >
                  <Combine className="w-5 h-5" />
                  {t.actions.combine}
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <DonationPopup isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
    </div>
  );
}

export default App;