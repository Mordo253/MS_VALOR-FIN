import { Search, Bell, ChevronDown, LogOut } from 'lucide-react';
import imgLO from '../../../../assets/MS5.png';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../../context/AuthContext'; // Añadimos esta importación

export const Adminnav = () => {
  const { logout } = useAuth(); // Obtenemos la función logout del contexto

  const handleLogout = (e) => {
    e.preventDefault();
    logout();
    // No necesitamos hacer la navegación manualmente ya que
    // probablemente tienes un router guard que redirigirá al usuario
    // cuando isAuthenticated cambie a false
  };

  return (
    <header className="bg-white shadow-sm h-16 flex items-center justify-between px-6 rounded-xl">
      <div className="flex-1 max-w-xl relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <input 
          type="text" 
          placeholder="Search..." 
          className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>
      <div className="flex items-center space-x-4">
        <button className="relative p-2 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 rounded-full">
          <Bell size={20} />
          <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-white"></span>
        </button>
        <div className="flex items-center space-x-2">
          <Link to="/">
            <div className="flex items-center space-x-2">
              <img src={imgLO} alt="User avatar" className="h-8 w-8 rounded-full" />
              <span className="font-medium text-gray-700">MS DE VALOR</span>
              <span className="text-sm text-gray-500">ADMIN</span>
              <ChevronDown size={20} className="text-gray-400" />
            </div>
          </Link>
        </div>
        <button 
          onClick={handleLogout}
          className="p-2 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 rounded-full transition-colors duration-200"
        >
          <LogOut size={20} />
        </button>
      </div>
    </header>
  );
};