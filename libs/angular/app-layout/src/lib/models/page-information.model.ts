export interface PageInfo {
  title: string;
  heading?: {
    title: string;
    previous?: string;
    actions?: Array<{ icon: string; title?: string; click?: () => void }>;
  };
  contentSize?: 'xs' | 's' | 'm' | 'l' | 'xl' | 'xxl' | 'full';
}
