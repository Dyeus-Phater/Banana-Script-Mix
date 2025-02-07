import JSZip from 'jszip';
import type { ScriptFile } from '../types';

export async function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target?.result as string);
    reader.onerror = (e) => reject(e);
    reader.readAsText(file);
  });
}

export function downloadFile(content: string, filename: string) {
  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export async function downloadFilesAsZip(files: ScriptFile[]) {
  const zip = new JSZip();
  
  files.forEach(file => {
    zip.file(file.name, file.content);
  });
  
  const blob = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'scripts.zip';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export async function separateScripts(combinedFile: File): Promise<ScriptFile[]> {
  try {
    const content = await readFileAsText(combinedFile);
    const scriptRegex = /--- START (.*?) ---\n([\s\S]*?)\n--- END \1 ---/g;
    const separatedFiles: ScriptFile[] = [];
    let match;
    let order = 0;

    while ((match = scriptRegex.exec(content)) !== null) {
      const [, filename, scriptContent] = match;
      separatedFiles.push({
        id: crypto.randomUUID(),
        name: filename,
        content: scriptContent.trim(),
        order: order++,
        timestamp: new Date().toISOString(),
      });
    }

    if (separatedFiles.length === 0) {
      throw new Error('No valid scripts found in the combined file');
    }

    return separatedFiles;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to separate scripts: ${error.message}`);
    }
    throw new Error('An unexpected error occurred while separating scripts.');
  }
}