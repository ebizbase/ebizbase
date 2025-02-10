export interface PageInfo {
  heading?: {
    title: string;
    previous?: string;
    actions?: Array<{ icon: string; title?: string; click?: () => void }>;
  };
  contentSize?: 'xs' | 's' | 'm' | 'l' | 'xl' | 'xxl' | 'full';
}
