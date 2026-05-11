/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1890FF',
      }
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false, // 禁用 Tailwind 默认的 CSS 重置，避免与 Antd 样式冲突
  }
}
