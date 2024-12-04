export interface Chapter {
  id: string;
  title: string;
  content: string;
}

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error';
}

export interface TableOfContentsItem {
  id: string;
  level: number;
  text: string;
  isExpanded?: boolean;
}
