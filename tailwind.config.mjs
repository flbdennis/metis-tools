// tailwind.config.mjs
/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class', // 启用基于 class 的暗色模式
    content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
    theme: {
        extend: {},
    },
    plugins: [require('@tailwindcss/typography')],
}