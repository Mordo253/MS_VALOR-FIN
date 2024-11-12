import { Swiper, SwiperSlide } from "swiper/react";
import 'swiper/css';
import 'swiper/css/autoplay';
import { Autoplay } from 'swiper/modules';
import { Link } from "react-router-dom";
import video2 from "../../../assets/videoC.mp4";
import video1 from "../../../assets/video1.mp4";
import banner2 from "../../../assets/bannerFH.png";
import banner1 from "../../../assets/bannerIn.jpg";
import { Phone, Search, FileText, ShieldAlert, TrendingUp, PiggyBank } from 'lucide-react';
import "./Service.css";

export const Service = () => {
  const services = [
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Crédito Hipotecario y Leasing",
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Crédito de vehículo",
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Crédito por Libranza",
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Crédito de consumo",
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Seguros de autos, hogar y vida",
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Servicios de logística y tramites en general",
    },
  ];
  return (
    <section className="w-full h-screen">
      <div className="h-full w-full max-w-screen-2xl mx-auto">
        <Swiper
          spaceBetween={0}
          slidesPerView={1}
          autoplay={{ delay: 10000 }} 
          modules={[Autoplay]}
          className="w-full h-full"
        >
          {/* Banner 1 */}
          <SwiperSlide>
            <div className="relative w-full h-full bg-gradient-to-r from-black to-gray-500 p-4 sm:p-8 rounded-lg shadow-lg overflow-hidden">
              <video
                  src={video1}
                  muted
                  autoPlay
                  loop
                  type="video/mp4"
                  className="absolute top-0 left-0 w-full h-full object-cover z-0"
                ></video>
              <div className="absolute top-0 left-0 w-full h-full bg-black opacity-30 z-10"></div>
              <div className="absolute top-4 left-0 w-full flex justify-center z-20">
                <h2 className="text-4xl md:text-5xl font-bold text-white text-center px-4 py-2 rounded-md">
                  DESCUBRE UNA AMPLIA VARIEDAD DE SERVICIOS
                </h2>
              </div>
              <div className="relative z-20 h-full flex flex-col justify-center items-center space-y-2 sm:space-y-6 px-4">
                <h2 className="text-2xl sm:text-4xl font-bold text-[#C5A572] text-center">
                  ASESORIAS EN:
                </h2>
                <div className="space-y-4">
                  {services.map((service, index) => (
                    <div key={index} className="flex items-center gap-3 justify-start gap-x-4">
                      <div className="text-amber-200 w-6 h-6">
                        {service.icon}
                      </div>
                      <p className="text-gray-300 text-xl">{service.title}</p>
                    </div>
                  ))}
                </div>
                <div className="flex justify-center">
                  <a href="https://wa.me/573160420188?text=Hola MS DE VALOR. 👋" target='_blank'>
                    <button className="bg-gray-900 text-white px-3 py-1 sm:px-6 sm:py-2 rounded-full text-xs sm:text-base">
                      VER MÁS
                    </button>
                  </a>
                </div>
              </div>
            </div>
          </SwiperSlide>

          {/* Banner 2 */}
          <SwiperSlide>
            <div className="relative w-full h-full bg-gradient-to-r from-black to-gray-500 p-4 sm:p-8 rounded-lg shadow-lg overflow-hidden">
              <img
                src={banner2}
                alt="casa"
                className="absolute top-0 left-0 w-full h-full object-cover z-0"
              ></img>
              <div className="absolute top-0 left-0 w-full h-full bg-black opacity-30 z-10"></div>
              <div className="absolute top-4 left-0 w-full flex justify-center z-20">
                <h2 className="text-4xl md:text-5xl font-bold text-white text-center px-4 py-2 rounded-md">
                  DESCUBRE UNA AMPLIA VARIEDAD DE INMUEBLES
                </h2>
              </div>
              <div className="relative z-20 h-full flex flex-col justify-center items-center space-y-2 sm:space-y-6 px-4">
                <h2 className="text-3xl sm:text-4xl font-bold text-[#C5A572] text-center">
                  ASESORIA INMOBILIARIA
                </h2>
                <h2 className="text-3xl sm:text-4xl font-bold text-[#C5A572] text-center">
                  EN MS DE VALOR
                </h2>
                <p className="text-white text-sm sm:text-lg text-center">
                PONEMOS UNA AMPLIA OFERTA DE PROPIEDADES EN TUS MANOS
                </p>
                <div className="flex justify-center">
                  <Link to="/properties-list">
                    <button className="bg-gray-900 text-white px-3 py-1 sm:px-6 sm:py-2 rounded-full text-xs sm:text-base">
                      VER MÁS
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </SwiperSlide>

          {/* Banner 3 */}
          <SwiperSlide>
            <div className="relative w-full h-full bg-gradient-to-r from-black to-gray-500 p-4 sm:p-8 rounded-lg shadow-lg overflow-hidden">
              <video
                src={video2}
                muted
                autoPlay
                loop
                type="video/mp4"
                className="absolute top-0 left-0 w-full h-full object-cover z-0"
              ></video>
              <div className="absolute top-0 left-0 w-full h-full bg-black opacity-30 z-10"></div>
              <div className="absolute top-4 left-0 w-full flex justify-center z-20">
                <h2 className="text-4xl md:text-5xl font-bold text-white text-center px-4 py-2 rounded-md">
                  DESCUBRE UNA AMPLIA VARIEDAD DE VEHÍCULOS
                </h2>
              </div>
              <div className="relative z-20 h-full flex flex-col justify-center items-center space-y-2 sm:space-y-6 px-4 top-[-2rem]">
                <h2 className="text-2xl sm:text-4xl font-bold text-[#C5A572] text-center">
                  Encuentra con MS De Valor
                </h2>
                <p className="text-white text-xl sm:text-2xl text-center">
                  El vehículo de tus Sueños
                </p>
                <div className="flex justify-center">
                  <Link to="/cars-list">
                    <button className="bg-gray-900 text-white px-3 py-1 sm:px-6 sm:py-2 rounded-full text-xs sm:text-base">
                      VER MÁS
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </SwiperSlide>
        </Swiper>
      </div>
    </section>
  );
};