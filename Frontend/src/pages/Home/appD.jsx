import Home from './Primary/Home'
import {HeroH} from './Main/Main';
import { Service } from './Service/Service';
import { Aliance } from './Alliance/AlianceCard';
import { ToolsB } from './ToolsB/ToolsB';
import { WorkUs } from './WorkUs/WorkUs';


const appD = () => {
  return (
    <>
        <Home/>
        <HeroH/>
        <Service/>
        <ToolsB/>
        <WorkUs/>
        <Aliance/>
    </>


  )
}

export default appD;
