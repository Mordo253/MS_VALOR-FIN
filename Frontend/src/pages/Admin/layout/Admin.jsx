import { Route, Routes } from "react-router-dom";
import { Sidebar } from "../components/Sidebar/Sidebar";
import { Dashboard } from "../views/Dashboard/Dashboard";
import Settings  from "../views/Settings/Settings";
import { CarAU } from '../views/carAU/CarAU';
import { PropertyAU } from '../views/propertyAU/PropertyAU';
import { Adminnav } from '../components/Navbars/Adminnav';
import PropertyForm  from '../views/propertyAU/PropertyForm';
import { PropertyEditList } from '../views/propertyAU/PropertyEditList';
import PropertyUP from '../views/propertyAU/Property/PropertyUP';
import CarSent from "../views/carAU/CarSent";
import { CarEditList } from "../views/carAU/CarEditList";
import CarUP from "../views/carAU/CarUP";
import { PostAU } from "../views/Posts/PostAU";
import PostsSent from "../views/Posts/PostsSent";
import PostsUP from "../views/Posts/PostsUP";
import PostsEdistList  from "../views/Posts/PostsEdistList";

export const Admin = () => {
  return (
    <div className="flex min-h-screen bg-white"> {/* Cambiado a bg-white */}
      <Sidebar />
      <main className="flex-1 ml-64 p-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <Adminnav/>
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/car" element={<CarAU />} />
            <Route path="/car/car-new" element={<CarSent />} />
            <Route path="/car/car-update/:id" element={<CarUP/>} />
            <Route path="/car/car-list" element={<CarEditList />} />
            <Route path="/property" element={<PropertyAU />} />
            <Route path="/property/property-new" element={<PropertyForm />} />
            <Route path="/property/property-update/:id" element={<PropertyUP/>} />
            <Route path="/property/property-list" element={<PropertyEditList />} />
            <Route path="/post" element={<PostAU />} />
            <Route path="/post/post-new" element={<PostsSent/>} />
            <Route path="/post/post-update/:slug" element={<PostsUP/>} />
            <Route path="/post/post-list" element={<PostsEdistList />} />
          </Routes>
        </div> 
      </main>
    </div>
  );
}