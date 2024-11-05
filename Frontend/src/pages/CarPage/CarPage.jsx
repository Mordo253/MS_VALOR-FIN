
import {CarCarousel} from "../../components/car/Card/CarCard";
import { CarCompanies } from "../../components/car/companies/CarCompanies";
import {CarHero} from "../../components/car/HeroC/CarHero";

export const CarPage = () => {
  return (
      <>
        <CarHero/>
        <CarCarousel/>
        <CarCompanies/>
      </>
  )
}
