import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectFade, Autoplay } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-fade';

import bannerC2 from "../../../assets/carb5.jpeg";
import bannerC1 from "../../../assets/carb3.jpg";
import bannerC3 from "../../../assets/carb2.jpg";
import { Link } from 'react-router-dom';

export const CarHero = () => {
  const images = [bannerC1,bannerC2,bannerC3 ];

  return (
    <section className='relative pb-8 top-4'>
      <div className="relative max-w-full h-screen">
        <Swiper
          modules={[EffectFade, Autoplay]}
          spaceBetween={0}
          slidesPerView={1}
          effect="fade"
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          loop={true}
          className="w-full h-full"
        >
          {images.map((image, index) => (
            <SwiperSlide key={index}>
              <div className="relative w-full h-full">
                <img
                  src={image}
                  alt={`Background ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
        <div className="absolute inset-0 bg-black bg-opacity-50 z-10"></div>
        <div className="absolute inset-0 flex flex-col justify-center items-start text-white p-16 z-20">
          <p className="text-xl text-slate-400 mb-2">Encuentra con MS De Valor</p>
          <h2 className="text-4xl font-bold mb-8">El vehículo de tus Sueños</h2>
          <Link to="/cars-list"> 
            <button className="bg-white text-blue-900 px-6 py-2 rounded-md font-semibold hover:bg-opacity-90 transition">
              VER MÁS
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};
