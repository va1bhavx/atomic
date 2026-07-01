export interface MonacoEditorInstance {
  setValue: (value: string) => void;
  getValue: () => string;
  layout: () => void;
  getModel: () => {
    getValueInRange: (range: {
      startLineNumber: number;
      startColumn: number;
      endLineNumber: number;
      endColumn: number;
    }) => string;
  } | null;
  getSelection: () => {
    startLineNumber: number;
    startColumn: number;
    endLineNumber: number;
    endColumn: number;
  } | null;
}
