import { RefObject } from 'react';

export interface Editor extends HTMLTextAreaElement {
  selectionStart: number;
  selectionEnd: number;
  focus: () => void;
}

export type EditorRef = RefObject<Editor>;
