import React from "react";
import { PropertyCarousel } from "../../components/property/card/PropertyCard";
import { PropertyHero } from "../../components/property/Hero/PropertyHero";
import { Aliance } from '../Home/Alliance/AlianceCard';

export function PropertyPage() {
  return (
    <>
      <PropertyHero/>
      <PropertyCarousel/>
      <Aliance/>
    </>
  );
}
