export interface SidebarShortcut {
  id: string;
  name: string;
  url: string;
  category: 'Social' | 'Productivity' | 'Dev' | 'Media' | 'General';
  iconColor: string;
}

export const DEFAULT_SIDEBAR_SHORTCUTS: SidebarShortcut[] = [
  {
    id: 'github',
    name: 'GitHub',
    url: 'https://github.com',
    category: 'Dev',
    iconColor: '#FFFFFF',
  },
  {
    id: 'gmail',
    name: 'Gmail',
    url: 'https://mail.google.com',
    category: 'Productivity',
    iconColor: '#EA4335',
  },
  {
    id: 'notion',
    name: 'Notion',
    url: 'https://notion.so',
    category: 'Productivity',
    iconColor: '#FFFFFF',
  },
  {
    id: 'reddit',
    name: 'Reddit',
    url: 'https://reddit.com',
    category: 'Social',
    iconColor: '#FF4500',
  },
  {
    id: 'x-twitter',
    name: 'X (Twitter)',
    url: 'https://x.com',
    category: 'Social',
    iconColor: '#1DA1F2',
  },
  {
    id: 'spotify',
    name: 'Spotify',
    url: 'https://open.spotify.com',
    category: 'Media',
    iconColor: '#1DB954',
  },
  {
    id: 'figma',
    name: 'Figma',
    url: 'https://figma.com',
    category: 'Productivity',
    iconColor: '#F24E1E',
  },
  {
    id: 'wikipedia',
    name: 'Wikipedia',
    url: 'https://wikipedia.org',
    category: 'General',
    iconColor: '#E2E8F0',
  },
];
