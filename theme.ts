import type { ThemeConfig } from 'antd';

// Mirrors the `brand` color scale in tailwind.config.js so antd and Tailwind
// share one green instead of the app's previous brand/agri-green/emerald mix.
export const BRAND_PRIMARY = '#3B6D11';

export const antdTheme: ThemeConfig = {
  token: {
    colorPrimary: BRAND_PRIMARY,
    colorInfo: BRAND_PRIMARY,
    borderRadius: 12,
    borderRadiusLG: 16,
    borderRadiusSM: 8,
    fontFamily: "'Plus Jakarta Sans', 'Inter', 'Noto Sans Devanagari', sans-serif",
  },
  components: {
    Button: {
      controlHeight: 44,
      fontWeight: 600,
    },
    Input: {
      controlHeight: 44,
    },
    Select: {
      controlHeight: 44,
    },
    Modal: {
      borderRadiusLG: 24,
    },
    Card: {
      borderRadiusLG: 16,
    },
  },
};
