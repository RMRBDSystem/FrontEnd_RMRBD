import withMT from "@material-tailwind/react/utils/withMT";

/** @type {import('tailwindcss').Config} */
export default withMT({
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      translate: {
        'full': '100%',
        'half': '50%',
        'custom-negative': '-100%', // thêm giá trị tùy chỉnh nếu cần
      },
      colors: {
        'custom-orange': '#FCA311', // Thêm màu tùy chỉnh
        'custom-gradient-start': '#FF5733', // Bắt đầu gradient
        'custom-gradient-end': '#FFC300', // Kết thúc gradient
        'gradient-start': '#1E3A8A', // Màu bắt đầu (xanh dương)
        'gradient-end': '#6B21A8', // Màu kết thúc (tím)
      },
      fontFamily: {
        roboto: ['Roboto', 'sans-serif'],
      },
      keyframes: {
        blink: {
          '0%, 100%': { opacity: '1' },   // Hiển thị hoàn toàn
          '50%': { opacity: '0' },        // Biến mất một nửa thời gian
        },
        tada: {
          '0%, 100%': { transform: 'scale(1)' },
          '10%': { transform: 'scale(1.1) rotate(-3deg)' },
          '20%': { transform: 'scale(1.1) rotate(3deg)' },
          '30%': { transform: 'scale(1.1) rotate(-3deg)' },
          '40%': { transform: 'scale(1.1) rotate(3deg)' },
          '50%': { transform: 'scale(1.1)' },
          '70%': { transform: 'scale(1.1) rotate(-3deg)' },
          '80%': { transform: 'scale(1.1) rotate(3deg)' },
          '90%': { transform: 'scale(1.1) rotate(-3deg)' },
        },
      },
      animation: {
        blink: 'blink 0.5s infinite',
        tada: 'tada 1s infinite',       // Animation lặp vô hạn mỗi 1 giây
      },
    },
    variants: {
      extend: {
        translate: ['responsive', 'hover', 'focus'],
      },
    },
  },
  plugins: [],
});
