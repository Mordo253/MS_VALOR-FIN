import { Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemButton,
  AccordionItemPanel,
  AccordionItemState } from "react-accessible-accordion";
import "react-accessible-accordion/dist/fancy-example.css";
import valueimg from "../../../assets/house2.jpg";
import { MdOutlineArrowDropDown } from "react-icons/md";
import "./Value.css";
import data from "./accordion";
import { useState, useEffect } from "react";
import Aos from'aos';
import  "aos/dist/aos.css";

export const Value = () => {
  return (
    <section className="v-wapper">
      <div className="paddins innerWidth flexCenter v-container">
        <div className="v-left">
          <div className="image-container2">
            <img src={valueimg} alt="house" /> 
          </div>
        </div>

        <div className="flexColStart v-right">
          <span className="orangeText">NUESTRO VALOR</span>
          <span className="primaryText">En MS de valor</span>
          <span className="secondaryText">
            Estamos siempre dispuestos para ayudarte y brindarte el mejor servicio. 
            <br/>
            Creemos que un buen lugar para vivir puede mejorar tu vida.
          </span>

          <Accordion
            className="accordion"
            allowMultipleExpanded={false}
            preExpanded={[0]}
          >
            {data.map((item, i) => {
              return (
                <AccordionItem
                  className={`accordionItem`}
                  key={i}
                  uuid={i}
                >
                  <AccordionItemHeading>
                    <AccordionItemButton className="flexCenter accordionButton">
                      <AccordionItemState>
                        {({ expanded }) => (
                          <>
                            <div className={`flexCenter icon4 ${expanded ? "expanded" : "collapsed"}`}>
                              {item.icon}
                            </div>
                            <span className="primaryText">
                              {item.heading}
                            </span>
                            <div className="flexCenter icon4">
                              <MdOutlineArrowDropDown size={20} />
                            </div>
                          </>
                        )}
                      </AccordionItemState>
                    </AccordionItemButton>
                  </AccordionItemHeading>

                  <AccordionItemPanel>
                    <p className="secondaryText">
                      {item.detail}
                    </p>
                  </AccordionItemPanel>

                </AccordionItem>
              );
            })}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
