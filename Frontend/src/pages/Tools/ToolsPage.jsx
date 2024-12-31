import React, { useState } from 'react';
import { ExternalLink, Calculator, RefreshCw, X, Camera, FileText, Clock } from 'lucide-react';
import { Tools } from '../../components/HomeC/tools/Tools';
import { ToolsI } from '../../components/HomeC/tools/ToolsI';
import {NotarialCalculator} from './Notarialtool';


const LinkCard = ({ href, text, icon, subtitle }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="flex flex-col items-center justify-between p-4 bg-white text-gray-800 rounded-lg hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border border-gray-200 h-40"
  >
    <div className="flex flex-col items-center">
      <div className="text-4xl mb-2">{icon}</div>
      <span className="text-sm font-semibold text-center">{text}</span>
    </div>
    {subtitle && <span className="text-xs text-center mt-2 text-gray-500">{subtitle}</span>}
    <ExternalLink size={16} className="mt-2 text-gray-500" />
  </a>
);


export const ToolsPage = () => {
  
    const links = [
      { href: "https://www.fasecolda.com/guia-de-valores/", text: "Fasecolda", icon: "🏛️", subtitle: "" },
      { href: "https://www.minvivienda.gov.co/viceministerio-de-vivienda/mi-casa-ya", text: "Mi Casa Ya", icon: "🏠", subtitle: "" },
      { 
        href: "https://certificados.supernotariado.gov.co/certificado", 
        text: "Certificados", 
        icon: "📄",
        subtitle: "Expide tu Certificado de Tradición y libertad"
      },
      { 
        href: "https://tuactividaddecredito.transunion.co/CreditView/enrollShort.page?enterprise=TUCO&offer=1FDCR0P&_ga=2.171296675.2000143438.1727871964-359011308.1727871964&_gac=1.261493119.1727871964.Cj0KCQjw3vO3BhCqARIsAEWblcBYjhrak_W4bEOGggNY_5f-xeSupeYx66T4AG8BglUvfG46w-WYi-kaAj_sEALw_wcB&_gl=1*17nx6a0*_gcl_aw*R0NMLjE3Mjc4NzE5NjQuQ2owS0NRanczdk8zQmhDcUFSSXNBRVdibGNCWWpocmFrX1c0YkVPR2dnTllfNWYteGVTdXBlWXg2NlQ0QUc4QmdsVXZmRzQ2dy1XWWkta2FBal9zRUFMd193Y0I.*_gcl_au*MjA0OTc0MTkyNS4xNzI3ODcxOTY0*_ga*MzU5MDExMzA4LjE3Mjc4NzE5NjQ.*_ga_N5HWT0LXZ9*MTcyNzg3MTk2NC4xLjAuMTcyNzg3MTk2NC4wLjAuMA..", 
        text: "TransUnion", 
        icon: "💳",
        subtitle: "Consulta tu Score de crédito"
      },
      { 
        href: "https://www.midatacredito.com/?gad_source=1", 
        text: "Mi DataCrédito", 
        icon: "📊",
        subtitle: "Consulta tu Score de crédito"
      }
    ];

    
  return (
      <section className="py-12 bg-gradient-to-r from-black to-[#737373] relative top-4">
          <div className="max-w-6xl mx-auto px-4">
              {/* Banner de Enlaces */}
              <div className="bg-gradient-to-r from-[#4A4A4A] to-[#2E2E2E] p-8 rounded-xl shadow-2xl mb-12 relative top-10">
                  <h2 className="text-3xl font-bold text-center mb-8 text-[#D4AF37]">Enlaces de Interés</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                      {links.map((link, index) => (
                          <LinkCard key={index} {...link} />
                      ))}
                  </div>
              </div>

              {/* Cards para Herramientas Financieras */}
              <h1 className="text-3xl font-extrabold text-white text-center mb-10">
                Herramientas Financieras
               </h1>
              <ToolsI/>
          </div>
          <Tools/>
          <NotarialCalculator/>
      </section>
  );
};
