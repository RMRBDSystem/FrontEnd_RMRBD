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
        {
            image: B01,
            title: "Delicious Homemade Burger",
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras tristique nisl vitae luctus sollicitudin. Fusce consectetur sem eget dui tristique, ac posuere arcu varius.",
        },
        {
            image: B02,
            title: "Cheesy Delight Burger",
            description: "Experience the creamy goodness of our cheesy delight burger, crafted to perfection.",
        },
        {
            image: B03,
            title: "Spicy Chicken Burger",
            description: "Ignite your taste buds with our spicy chicken burger, a true flavor explosion.",
        },
        {
            image: B04,
            title: "Classic Beef Burger",
            description: "Savor the taste of our classic beef burger, a timeless favorite.",
        },
        {
            image: B05,
            title: "Vegan Burger",
            description: "Enjoy a healthy and delicious vegan burger, packed with flavor.",
        },
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
                    <SwiperSlide key={index} className="flex items-center relative"
                        onMouseEnter={() => setHoverIndex(index)}
                        onMouseLeave={() => setHoverIndex(null)}
                    >
                        <img src={slide.image} alt={`burger-${index}`} className="w-1/2 h-full object-cover" />
                        {hoverIndex === index && (
                            <div className="w-full p-6 absolute bottom-0 left-0 bg-white bg-opacity-90 flex flex-col justify-center items-center shadow-lg">
                                <h2 className="text-3xl font-bold mb-3">{slide.title}</h2>
                                <p className="mb-5 text-gray-700">{slide.description}</p>
                                <a href="#" className="btn delicious-btn bg-orange-500 text-white py-2 px-5 rounded-lg hover:bg-orange-600 transition-all duration-300">See Recipe</a>
                            </div>
                        )}
                    </SwiperSlide>
                ))}
                <div className='slider-controler'>
                    <div className='swiper-button-prev'>
                        <ArrowLeft size={30} />
                    </div>
                    <div className='swiper-button-next'>
                        <ArrowRight size={30} />
                    </div>
                </div>
            </Swiper>
        </div>
    );
}

export default Slide;