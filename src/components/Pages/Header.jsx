import React, { useEffect, useState } from "react";

const Header = () => {
  // Mảng chứa các URL hình ảnh
  const images = [
    "https://www.allrecipes.com/thmb/ix0rqcdnZcF7GQl8Xu4yBxmtHyE=/1900x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/seafood-header-Passano_ALR0720_Grill_4084-2400x600-1-2000-4ea8d91381094cb9ad62de7cdf9877ba.jpg",
    "https://www.allrecipes.com/thmb/xt7KJDCVi7SSOtAdJoEaR8Sxerk=/1900x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/1042381_RosemaryRoastedTurkey3x1byMelissaGoff-0aaede6a0c2a4da89adf76df8992c2b9.jpg",
    "https://www.allrecipes.com/thmb/p5ypo2B9PnG34Zm-fOvYaPJfvTo=/1900x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/2400-AR-14452-GreenSalad-0028-2x1-1-2000-c0687125d0ff4990b7c4922daf147aea.jpg"
  ];

  // State để lưu trữ URL của hình nền ngẫu nhiên
  const [backgroundImage, setBackgroundImage] = useState("");

  // Hàm chọn ngẫu nhiên hình ảnh từ mảng
  useEffect(() => {
    const randomImage = images[Math.floor(Math.random() * images.length)];
    setBackgroundImage(randomImage);
  }, []);

  return (
    <header
      className="flex justify-center items-center h-32 bg-cover bg-center"
      style={{ backgroundImage: `url('${backgroundImage}')` }}
    >
      <div className="w-full lg:w-1/4 p-4 bg-white bg-opacity-80 rounded text-center">
        <h1 className="text-lg font-bold text-gray-800">Random Header</h1>
      </div>
    </header>
  );
};

export default Header;