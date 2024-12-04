export interface Chapter {
  id: string;
  title: string;
  content: string;
  isExpanded?: boolean;
}

export interface TableOfContentsItem {
  id: string;
  level: number;
  text: string;
  isExpanded?: boolean;
}
