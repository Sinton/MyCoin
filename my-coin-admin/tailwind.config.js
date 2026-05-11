/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // 与 Ant Design 主题 token 对齐的颜色系统
      colors: {
        // 主色 (colorPrimary)
        primary: {
          DEFAULT: '#1677ff',
          light: '#e6f4ff',
          dark: '#0958d9',
        },
        // 功能色
        success: { DEFAULT: '#52c41a', light: '#f6ffed' },
        warning: { DEFAULT: '#faad14', light: '#fffbe6' },
        danger:  { DEFAULT: '#ff4d4f', light: '#fff2f0' },
        purple:  { DEFAULT: '#722ed1', light: '#f9f0ff' },
        // 中性色 (与 AntD token 对齐)
        text: {
          primary:   '#1f1f1f',
          secondary: '#595959',
          tertiary:  '#8c8c8c',
          disabled:  '#bfbfbf',
        },
        fill: {
          DEFAULT: '#f0f0f0',
          secondary: '#f5f5f5',
          tertiary:  '#fafafa',
        },
        border: {
          DEFAULT: '#d9d9d9',
          secondary: '#f0f0f0',
        },
        // 背景
        bg: {
          container: '#ffffff',
          layout:    '#f5f5f5',
        },
      },
      // 字体
      fontFamily: {
        sans: ['Inter', 'system-ui', 'Helvetica', 'Arial', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Cascadia Code', 'monospace'],
      },
      // 圆角
      borderRadius: {
        card: '8px',
        lg: '12px',
        xl: '16px',
      },
      // 阴影
      boxShadow: {
        card: '0 1px 2px 0 rgba(0,0,0,0.03), 0 1px 6px -1px rgba(0,0,0,0.02), 0 2px 4px 0 rgba(0,0,0,0.02)',
        'card-hover': '0 4px 16px 0 rgba(0,0,0,0.08)',
        popup: '0 6px 16px 0 rgba(0,0,0,0.08), 0 3px 6px -4px rgba(0,0,0,0.12)',
      },
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false, // 禁用 Tailwind 默认 CSS 重置，避免与 AntD 样式冲突
  }
}
