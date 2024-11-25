import React from 'react';
import "./Aliance.css";
import aliado1 from '../../../assets/bancoAV.png';
import aliado2 from '../../../assets/BancoB.png';
import aliado3 from '../../../assets/BancoBB.png';
import aliado4 from '../../../assets/BancoCS.png';
import aliado5 from '../../../assets/bancoCO.png';
import aliado6 from '../../../assets/bancoF.png';
import aliado7 from '../../../assets/bancoI.png';
import aliado8 from '../../../assets/bancoOC.png';
import aliado9 from '../../../assets/Bay.png';
import aliado10 from '../../../assets/colpatria.png';
import aliado11 from '../../../assets/davivienda.png';
import aliado12 from '../../../assets/ExcelC.png';
import aliado13 from '../../../assets/Finanzauto.png';
import aliado14 from '../../../assets/Finesa.png';
import aliado15 from '../../../assets/GMAC.png';
import aliado16 from '../../../assets/OcciAuto.png';
import aliado17 from '../../../assets/PICHIN.png';
import aliado18 from '../../../assets/RCI.png';
import aliado19 from '../../../assets/Sufi.png';
import aliado20 from '../../../assets/vehiG.png';
import aliado21 from '../../../assets/apoyosf.png';

export const Aliance = () => {
  const images = [aliado1, aliado2, aliado3, aliado4, aliado5, aliado6, aliado7, aliado8, aliado9, aliado10, aliado11, aliado12, aliado13, aliado14, aliado15, aliado16, aliado17, aliado18, aliado19, aliado20, aliado21];

  return (
    <section className='c-wrapper'>
      <div className="c-container">
        <h2 className='text-2xl text-black font-semibold text-center'>CONOCE A NUESTROS ALIADOS</h2>
        <div className="c-slider">
          {/* Renderizamos las imágenes dos veces para crear el efecto continuo */}
          {images.concat(images).map((img, index) => (
            <img key={index} src={img} alt={`Aliado ${(index % images.length) + 1}`} />
          ))}
        </div>
      </div>
    </section>
  );
};
