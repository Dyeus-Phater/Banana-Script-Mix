export interface ScriptFile {
  id: string;
  name: string;
  content: string;
  order: number;
  timestamp: string;
}

export interface ConfigFile {
  files: {
    id: string;
    originalName: string;
    order: number;
    format: string;
    markers: {
      start: string;
      end: string;
    };
  }[];
  timestamp: string;
  version: string;
}