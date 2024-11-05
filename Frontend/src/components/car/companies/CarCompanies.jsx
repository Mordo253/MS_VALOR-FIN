import React from 'react';
import "./CarCompanies.css";
import aliado1 from '../../../assets/bancoAV.png';
import aliado2 from '../../../assets/BancoB.png';
import aliado3 from '../../../assets/BancoBB.png';
import aliado4 from '../../../assets/BancoCS.png';

export const CarCompanies = () => {
    const images = [aliado1, aliado2, aliado3, aliado4,];

    return (
      <section className='c-wrapperC'>
        <div className="c-containerC">
          <div className="c-sliderC">
            {images.concat(images).map((img, index) => (
              <img key={index} src={img} alt={`Aliado ${(index % images.length) + 1}`} />
            ))}
          </div>
        </div>
      </section>
    );
}