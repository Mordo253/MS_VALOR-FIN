import React from 'react';
import { Home, Folder, Car } from 'lucide-react';
import { Link} from 'react-router-dom';
export const Sidebar = () => (
  <aside className="fixed left-0 top-0 h-full w-64 bg-[#2c3e50] text-white p-5">
    <div className="mb-8">
      <Link to="/">
        <svg viewBox="0 0 24 24" className="h-8 w-8 text-white" fill="currentColor">
          <path d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
      </Link>
    </div>
    <nav className="space-y-4">
      {[
        { icon: Home, label: 'Dashboard', path: 'dashboard' },
        { icon: Folder, label: 'Inmuebles', path: 'property' },
        { icon: Car, label: 'Vehículos', path: 'car' },
      ].map(({ icon: Icon, label, path }) => (
        <Link
          key={label}
          to={path}
          className={`flex items-center space-x-3 p-2 rounded-lg transition-colors ${
            location.pathname === path ? 'bg-[#9747FF] text-white' : 'text-gray-300 hover:bg-gray-700'
          }`}
        >
          <Icon size={20} />
          <span>{label}</span>
        </Link>
      ))}
    </nav>
  </aside>
);