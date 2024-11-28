import React from 'react';
import heroVideo from '/images/hero-video.mp4';

const Hero = () => {
    return (
        <section className="relative w-full min-h-screen p-10 flex justify-center items-center bg-gray-500">
          <video
            controls=""
            muted
            autoPlay={'autoplay'}
            loop
            className="absolute top-0 left-0 w-full h-full object-cover opacity-80 z-30 "
          >
            <source src={heroVideo} type="video/mp4" />
            Trình duyệt của bạn không hỗ trợ thẻ video. Tôi khuyên bạn nên nâng cấp
            trình duyệt.
          </video>
    
          <div className="text-5xl z-40 text-center text-white mt-40">
            <h2 className="text-white text-3xl sm:text-5xl md:text-7xl font-expletus font-extrabold uppercase">

            </h2>
            <h3 className="text-2xl sm:text-3xl md:text-5xl my-2 sm:my-5">
            Biến việc nấu ăn hàng ngày trở nên thú vị hơn!
            </h3>
            <p className="text-gray-100 max-w-2xl mx-auto my-2 sm:my-5 text-base sm:text-xl lg:text-2xl">
            Tìm và chia sẻ các công thức tuyệt vời cho việc nấu ăn hàng ngày của bạn
            </p>
            <a
              href="#featured"
              className={`text-xs bg-white text-gray-800 py-2.5 px-7 mt-2.5 uppercase tracking-wider hover:tracking-widest transition duration-200 ease-in-out`}
            >
              KHÁM PHÁ NGAY
            </a>
          </div>
        </section>
      );
};

export default Hero;
