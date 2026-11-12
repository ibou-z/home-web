import React from 'react';

interface AppLogoProps {
  icon: string;
  className?: string;
  accentColor?: string;
}

export const AppLogo: React.FC<AppLogoProps> = ({ icon, className = 'w-10 h-10', accentColor }) => {
  switch (icon) {
    case 'youtube':
      return (
        <svg viewBox="0 0 24 24" className={className} aria-label="YouTube">
          <rect x="2" y="4" width="20" height="16" rx="5" fill="#FF0000" />
          <polygon points="10,8.5 16,12 10,15.5" fill="#FFFFFF" />
        </svg>
      );

    case 'google':
      return (
        <svg viewBox="0 0 24 24" className={className} aria-label="Google">
          <path
            fill="#4285F4"
            d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
          />
          <path
            fill="#34A853"
            d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.27 21.42 7.33 24 12 24z"
          />
          <path
            fill="#FBBC05"
            d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
          />
          <path
            fill="#EA4335"
            d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.27 2.58 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
          />
        </svg>
      );

    case 'chatgpt':
      return (
        <svg viewBox="0 0 24 24" className={className} aria-label="ChatGPT">
          <rect width="24" height="24" rx="6" fill="#10A37F" />
          <path
            fill="#FFFFFF"
            d="M18.72 10.2c-.14-.99-.68-1.87-1.51-2.41a4.26 4.26 0 0 0-2.31-.66c-.23 0-.47.03-.7.08A4.27 4.27 0 0 0 9.77 5.5a4.25 4.25 0 0 0-3.66 2.08 4.26 4.26 0 0 0-1.85 2.18 4.26 4.26 0 0 0 .37 4.04c-.14.99.14 2 .78 2.78a4.26 4.26 0 0 0 2.37 1.49c.24.06.49.08.74.08a4.27 4.27 0 0 0 4.1-2.73 4.26 4.26 0 0 0 4.03-2.07 4.24 4.24 0 0 0 .07-3.15zm-6.72 8.35a3.14 3.14 0 0 1-2.12-.81l.1-.06 3.51-2.02a.57.57 0 0 0 .28-.5V10.2l1.49.86v3.98a3.14 3.14 0 0 1-3.26 3.51zm-5.75-3.32a3.14 3.14 0 0 1-.39-2.24l.1.06 3.51 2.03c.18.1.39.1.57 0l4.31-2.49v1.72l-3.45 1.99a3.14 3.14 0 0 1-4.65-1.07zm-1.12-6.17a3.14 3.14 0 0 1 1.73-1.43V11.7l4.31 2.49c.18.1.28.3.28.5v1.72l-3.45-1.99a3.14 3.14 0 0 1-2.87-4.42zm9.14 1.43-4.31-2.49V6.27a3.14 3.14 0 0 1 4.65 1.07 3.14 3.14 0 0 1 .39 2.24l-.1-.06-3.51-2.03a.57.57 0 0 0-.57 0l-.55.32 4.05 2.34v.34zm2.54 1.43-4.31 2.49v-1.72l3.45-1.99a3.14 3.14 0 0 1 2.87 4.42 3.14 3.14 0 0 1-1.73 1.43v-4.07l-.28-.56zm-1.48-1.72-3.51-2.03a.57.57 0 0 0-.57 0L8.43 10.66v-1.72l3.45-1.99a3.14 3.14 0 0 1 4.65 1.07 3.14 3.14 0 0 1 .39 2.24l-.1-.06z"
          />
        </svg>
      );

    case 'claude':
      return (
        <svg viewBox="0 0 24 24" className={className} aria-label="Claude">
          <rect width="24" height="24" rx="6" fill="#D97706" />
          <path
            fill="#FFFFFF"
            d="m14.37 6.13-.3 1.15c-.21.84-.42 1.68-.62 2.52-.39 1.58-.78 3.16-1.17 4.74-.29 1.19-.58 2.38-.87 3.57l-.37 1.52c-.08.31-.22.45-.48.45-.27 0-.42-.14-.5-.45l-.37-1.52c-.29-1.19-.58-2.38-.87-3.57-.39-1.58-.78-3.16-1.17-4.74-.2-.84-.41-1.68-.62-2.52l-.3-1.15c-.08-.31.02-.5.35-.5h5.97c.33 0 .43.19.35.5zm4.81 4.88-1.14.3c-.84.21-1.68.42-2.52.62-1.58.39-3.16.78-4.74 1.17-1.19.29-2.38.58-3.57.87l-1.52.37c-.31.08-.45.22-.45.48 0 .27.14.42.45.5l1.52.37c1.19.29 2.38.58 3.57.87 1.58.39 3.16.78 4.74 1.17.84.2 1.68.41 2.52.62l1.14.3c.31.08.5-.02.5-.35v-5.97c0-.33-.19-.43-.5-.35z"
          />
        </svg>
      );

    case 'teams':
      return (
        <svg viewBox="0 0 24 24" className={className} aria-label="Microsoft Teams">
          {/* Background square with person */}
          <rect x="7" y="3" width="14" height="14" rx="4" fill="#5059C9" />
          <circle cx="15.5" cy="8" r="2.2" fill="#7B83EB" />
          <path d="M12.5 14.5c0-2 2-3 4-3s4 1 4 3v1.5h-8v-1.5z" fill="#7B83EB" />
          {/* Foreground card with T */}
          <rect x="3" y="7" width="12" height="14" rx="3.5" fill="#464EB8" />
          <path d="M3 10.5C3 8.57 4.57 7 6.5 7H11.5C13.43 7 15 8.57 15 10.5V17.5C15 19.43 13.43 21 11.5 21H6.5C4.57 21 3 19.43 3 17.5V10.5Z" fill="#5A62D2" />
          <path d="M6 10.5h6v1.8H9.9v6.2H8.1v-6.2H6v-1.8z" fill="#FFFFFF" />
        </svg>
      );

    case 'copilot':
      return (
        <svg viewBox="0 0 24 24" className={className} aria-label="Microsoft Copilot">
          <defs>
            <linearGradient id="copilotG1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00C7FF" />
              <stop offset="100%" stopColor="#005BFF" />
            </linearGradient>
            <linearGradient id="copilotG2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FF3366" />
              <stop offset="100%" stopColor="#FF9900" />
            </linearGradient>
          </defs>
          <path
            d="M17.5 12c1.93 0 3.5-1.57 3.5-3.5S19.43 5 17.5 5c-1.38 0-2.58.8-3.15 1.96C13.44 6.36 12.48 6 11.5 6 9.01 6 7 8.01 7 10.5c0 .35.04.7.12 1.03C5.35 12.2 4 13.93 4 16c0 2.76 2.24 5 5 5 1.63 0 3.06-.78 3.97-1.99.7.63 1.62 1 2.63 1 2.15 0 3.9-1.75 3.9-3.9 0-.96-.35-1.84-.93-2.52.56-.7 1.93-1.59 1.93-3.59z"
            fill="none"
          />
          <path
            d="M8.5 7C6.01 7 4 9.01 4 11.5c0 1.98 1.28 3.65 3.08 4.25A4.5 4.5 0 0 0 8.5 17c2.49 0 4.5-2.01 4.5-4.5S10.99 7 8.5 7z"
            fill="url(#copilotG1)"
          />
          <path
            d="M15.5 17c2.49 0 4.5-2.01 4.5-4.5 0-1.98-1.28-3.65-3.08-4.25A4.5 4.5 0 0 0 15.5 7c-2.49 0-4.5 2.01-4.5 4.5s2.01 4.5 4.5 4.5z"
            fill="url(#copilotG2)"
            opacity="0.9"
          />
        </svg>
      );

    case 'classroom':
      return (
        <svg viewBox="0 0 24 24" className={className} aria-label="Google Classroom">
          {/* Yellow frame */}
          <rect x="2" y="3" width="20" height="18" rx="3.5" fill="#F4B400" />
          {/* Green chalkboard inside */}
          <rect x="3.5" y="4.5" width="17" height="15" rx="2.5" fill="#0F9D58" />
          {/* White teacher and pupil silhouettes */}
          <circle cx="12" cy="9.5" r="2.2" fill="#FFFFFF" />
          <path d="M8 15.5c0-2.2 2-3.5 4-3.5s4 1.3 4 3.5H8z" fill="#FFFFFF" />
          <circle cx="7.2" cy="11.2" r="1.6" fill="#A1D8BD" />
          <path d="M4.5 15.8c0-1.6 1.4-2.5 2.7-2.5.5 0 1.2.1 1.7.5-.5.6-.8 1.3-.8 2h-3.6z" fill="#A1D8BD" />
          <circle cx="16.8" cy="11.2" r="1.6" fill="#A1D8BD" />
          <path d="M19.5 15.8c0-1.6-1.4-2.5-2.7-2.5-.5 0-1.2.1-1.7.5.5.6.8 1.3.8 2h3.6z" fill="#A1D8BD" />
        </svg>
      );

    case '7reels':
      return (
        <svg viewBox="0 0 24 24" className={className} aria-label="7reels">
          <defs>
            <linearGradient id="gold7G" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FDE047" />
              <stop offset="50%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#B45309" />
            </linearGradient>
            <linearGradient id="darkBg7" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#371B58" />
              <stop offset="100%" stopColor="#1A0B2E" />
            </linearGradient>
          </defs>
          <rect width="24" height="24" rx="6" fill="url(#darkBg7)" />
          {/* Crown and 7s */}
          <path d="M6 7l3 2 3-3 3 3 3-2v3H6V7z" fill="url(#gold7G)" />
          {/* Stylized Triple 7 */}
          <path
            d="M7 11h4l-2.5 8h-2.5l2-5H7v-3zm5.5 0h4l-2.5 8h-2.5l2-5h-1v-3z"
            fill="#FFFFFF"
          />
          <circle cx="12" cy="19.5" r="1.2" fill="url(#gold7G)" />
        </svg>
      );

    case 'glow-rrmumify':
      return (
        <svg viewBox="0 0 24 24" className={className} aria-label="Glow RRMumify">
          <defs>
            <linearGradient id="glowMumifyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#C084FC" />
              <stop offset="50%" stopColor="#8B5CF6" />
              <stop offset="100%" stopColor="#4C1D95" />
            </linearGradient>
            <filter id="neonFilter" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="1.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <rect width="24" height="24" rx="6" fill="url(#glowMumifyGrad)" />
          {/* Glowing futuristic mask / pyramid glyph */}
          <path
            d="M12 4L4 18h16L12 4z"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <circle cx="12" cy="12" r="2.5" fill="#E9D5FF" filter="url(#neonFilter)" />
          <path d="M8 15h8M9.5 12h5M11 9h2" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
      );

    case 'humanize-ai':
      return (
        <svg viewBox="0 0 24 24" className={className} aria-label="Humanize AI">
          <defs>
            <linearGradient id="humanizeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F472B6" />
              <stop offset="50%" stopColor="#EC4899" />
              <stop offset="100%" stopColor="#9D174D" />
            </linearGradient>
          </defs>
          <rect width="24" height="24" rx="6" fill="url(#humanizeGrad)" />
          {/* Biometric fingerprint / neural curve */}
          <path
            d="M12 5a7 7 0 0 0-7 7c0 2.2.8 4.2 2.2 5.7M12 8a4 4 0 0 0-4 4c0 1.4.6 2.6 1.5 3.5M12 11a1 1 0 0 0-1 1c0 .7.3 1.3.8 1.7M19 12a7 7 0 0 0-3.5-6.1M16 12a4 4 0 0 0-2-3.5M12 14v4M15 15v3M9 16v2"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      );

    default:
      // Generic elegant glass app icon
      return (
        <div
          className={`${className} rounded-xl flex items-center justify-center font-bold text-white shadow-inner`}
          style={{ background: accentColor || '#6366F1' }}
        >
          <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="18" height="18" rx="4" />
            <path d="M9 9h6M9 13h6M9 17h4" />
          </svg>
        </div>
      );
  }
};
