// import "../style.css";
// import "./hero.css";
import { Link } from 'react-router-dom';
import imgh from '../../../assets/heroproperty.jpg'
// import React from 'react'
// import { HiLocationMarker } from "react-icons/hi";
// import CountUp from "react-countup";

// export const PropertyHero = () => {
//   return (
//     <section className="hero-wrapper">
//       <div className="paddings innerWidth flexCenter h-screen hero-container">

//         <div className="flexColStart hero-left">
//           <div className="hero-title">
//             <div className="orenge-circle"></div>
//             <h1>
//               Encuentra 
//               <br/>
//               La vivienda <br/> De tus sueños
//             </h1>
//           </div>

//           <div className="flexColStart hero-des">
//             <span>Disfruta de una gran variedad de propiedades a tu medida</span>
//             <span>Lorem ipsum dolor sit amet consectetur adipisicing</span>
//           </div>

//           <div className="flexCenter search-bar">
//             <HiLocationMarker color="var(--blue)" size={25}/>
//             <input type="text" />
//             <button className="btn">Search</button>
//           </div>

//           <div className="flexCenter stats">
//             <div className="flexColCenter stat">
//               <span>
//                 <CountUp start={8800} end={9000} duration={4}/>
//               <span>+</span>
//               </span>
//               <span>Clientes Satisfechos</span>
              
//             </div>
//           </div>
//         </div>
        
        
//         <div className="flexCenter hero-right">
//           <div className="image-container">
//             <img src={imgh} alt="" />
//           </div>
//         </div>
//       </div>
//     </section>
//   )
// }
import React from 'react';

export const PropertyHero = () => {
  return (
    <div className="relative h-screen w-full overflow-hidden items-center pt-36">
      {/* Background Image Container */}
      <div className="absolute inset-0">
        <img 
          src={imgh}
          alt="Luxury home exterior" 
          className="w-full h-full object-cover"
        />
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
      </div>
      
      {/* Content Container */}
      <div className="relative h-full flex items-center">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl">
            {/* Main Text */}
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 pt-8">
              ENCUENTRA EL LUGAR DE TUS SUEÑOS
            </h1>
            
            {/* Description */}
            <p className="text-lg text-gray-200 mb-8">
              Transforma tus sueños en realidad. MS DE VALOR te ofrece una experiencia sin igual en la busqueda de tu vivienda.
            </p>
            
            {/* CTA Button */}
            <div>
              <Link to="/properties-list">
                <button className="bg-[#b4a160] text-black px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition duration-300">
                  VER VIVIENDAS
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};