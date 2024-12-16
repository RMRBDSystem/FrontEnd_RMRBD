import withMT from "@material-tailwind/react/utils/withMT";
import tailwindScrollbar from 'tailwind-scrollbar';
/** @type {import('tailwindcss').Config} */
export default withMT({
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'custom-gradient': 'linear-gradient(90deg, rgba(2,0,36,.39), rgba(0,0,0,.5) 1.83%, hsla(0,0%,100%,.36) 3.21%, rgba(0,0,0,.33) 4.72%, rgba(247,254,255,.28) 9.84%, hsla(0,0%,100%,0) 47.85%)'
      },
      fontFamily: {
        sans: ['Inter Tight', 'sans-serif'],  // Cập nhật font chữ mặc định
      },
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
      keyframes: {
        'fade-in-down': {
          '0%': {
            opacity: '0',
            transform: 'translateY(-10px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
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
        'fade-in-down': 'fade-in-down 0.7s ease-in',
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
  plugins: [
    tailwindScrollbar,
  ],
});
