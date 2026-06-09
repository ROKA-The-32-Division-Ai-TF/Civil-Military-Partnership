/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        publicGreen: '#1F7A5C',
        civicNavy: '#0B2B4C',
        mist: '#F4F8F6',
        signalAmber: '#B98535',
        porcelain: '#FBFCFA',
      },
      boxShadow: {
        panel: '0 18px 50px rgba(11, 43, 76, 0.08)',
        float: '0 10px 30px rgba(31, 122, 92, 0.12)',
      },
      fontFamily: {
        sans: [
          'Pretendard',
          'Apple SD Gothic Neo',
          'Noto Sans KR',
          'system-ui',
          'sans-serif',
        ],
      },
    },
  },
  plugins: [],
};
