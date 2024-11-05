import React from "react";
import { PropertyCarousel } from "../../components/property/card/PropertyCard";
import { PropertyHero } from "../../components/property/Hero/PropertyHero";
import { PropertyCompanies } from "../../components/property/companies/PropertyCompanies";
import { Value } from "../../components/property/Value/Value";

export function PropertyPage() {
  return (
    <>
      <PropertyHero/>
      <PropertyCarousel/>
      <PropertyCompanies/>
    </>
  );
}
