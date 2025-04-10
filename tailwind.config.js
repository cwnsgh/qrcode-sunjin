// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}", // 혹시 pages 라우터도 쓴다면
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}", // 컴포넌트 폴더
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}", // App Router 구조 핵심!
  ],
  theme: {
    extend: {
      // 여기에 커스텀 테마 설정 추가 가능 (예: 색상, 폰트 등)
    },
  },
  plugins: [],
};
