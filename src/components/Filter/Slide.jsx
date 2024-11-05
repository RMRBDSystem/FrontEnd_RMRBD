import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Navigation, Autoplay } from 'swiper/modules';
import { ArrowLeft, ArrowRight } from 'phosphor-react';
import B01 from '../../assets/recipe/hamburger-01.png';
import B02 from '../../assets/recipe/hamburger-02.png';
import B03 from '../../assets/recipe/hamburger-03.png';
import B04 from '../../assets/recipe/hamburger-04.png';
import B05 from '../../assets/recipe/hamburger-05.png';

import 'swiper/css';
import 'swiper/css/effect-coverflow';

const Slide = () => {
    const [hoverIndex, setHoverIndex] = useState(null);

    const slidesData = [
        { image: B01 },
        { image: B02 },
        { image: B03 },
        { image: B04 },
        { image: B05 },
    ];

    return (
        <div className='slider-container'>
            <Swiper
                effect={'coverflow'}
                grabCursor={true}
                centeredSlides={true}
                loop={true}
                slidesPerView={3}
                coverflowEffect={{
                    rotate: 0,
                    stretch: -75,
                    depth: 250,
                    modifier: 3.5,
                    slideShadows: false,
                }}
                navigation={{
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev',
                    clickable: true,
                }}
                autoplay={{
                    delay: 5000,
                    disableOnInteraction: false,
                }}
                modules={[EffectCoverflow, Navigation, Autoplay]}
            >
                {slidesData.map((slide, index) => (
                    <SwiperSlide
                        key={index}
                        className="flex items-center justify-center relative"
                        onMouseEnter={() => setHoverIndex(index)}
                        onMouseLeave={() => setHoverIndex(null)}
                    >
                        <img src={slide.image} alt={`burger-${index}`} className="w-1/2 h-full object-cover" />
                        {hoverIndex === index && (
                            <a
                                href="#"
                                className="absolute flex items-center justify-center text-white bg-orange-500 hover:bg-orange-600 rounded-full w-16 h-16 text-center text-sm font-semibold transition-transform duration-300"
                                style={{ transform: 'translate(-50%, -50%)', left: '50%', top: '50%' }}
                            >
                                Recipe
                            </a>
                        )}
                    </SwiperSlide>
                ))}
                <div className='slider-controler'>
                    <div className='swiper-button-prev absolute left-0 top-1/2 transform -translate-y-1/2 z-10 cursor-pointer'>
                        <ArrowLeft size={30} />
                    </div>
                    <div className='swiper-button-next absolute right-0 top-1/2 transform -translate-y-1/2 z-10 cursor-pointer'>
                        <ArrowRight size={30} />
                    </div>
                </div>
            </Swiper>
        </div>
    );
}

export default Slide;
