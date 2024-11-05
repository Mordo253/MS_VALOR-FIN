import React, { useState } from "react";
import { User, Mail, Lock, Edit2 } from 'lucide-react';
// components

 
export const Settings=()=> {

  const [user, setUser] = useState({
    name: 'Ricky Park',
    email: 'ricky@example.com',
    location: 'NEW YORK',
    role: 'User interface designer and front-end developer',
    skills: ['UI/UX', 'Front End Development', 'HTML', 'CSS', 'JavaScript', 'React', 'Node']
  });

  return (
    <div className="flex min-h-screen bg-gray-100">
      <main className="flex-1 ml-32 p-8 relative top-[-2rem] bg-white">
        <div className="bg-gray-900 text-white p-6 rounded-lg max-w-2xl mx-auto">
          <div className="flex items-center space-x-4 mb-6">
            <img src="/path-to-profile-image.jpg" alt="Profile" className="w-24 h-24 rounded-full border-4 border-teal-400" />
            <div>
              <h2 className="text-2xl font-bold">{user.name}</h2>
              <p className="text-gray-400">{user.location}</p>
              <p className="text-sm mt-2">{user.role}</p>
            </div>
            <span className="bg-yellow-500 text-black text-xs font-bold px-2 py-1 rounded">PRO</span>
          </div>

          <div className="space-y-4 mb-6">
            <button className="bg-teal-500 text-white px-4 py-2 rounded-md hover:bg-teal-600 transition">Message</button>
            <button className="bg-gray-700 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition ml-2">Following</button>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <User className="text-gray-400" />
              <input 
                type="text" 
                value={user.name} 
                onChange={(e) => setUser({...user, name: e.target.value})}
                className="bg-gray-800 text-white px-3 py-2 rounded-md flex-grow"
              />
              <Edit2 className="text-gray-400 cursor-pointer" />
            </div>
            <div className="flex items-center space-x-4">
              <Mail className="text-gray-400" />
              <input 
                type="email" 
                value={user.email} 
                onChange={(e) => setUser({...user, email: e.target.value})}
                className="bg-gray-800 text-white px-3 py-2 rounded-md flex-grow"
              />
              <Edit2 className="text-gray-400 cursor-pointer" />
            </div>
            <div className="flex items-center space-x-4">
              <Lock className="text-gray-400" />
              <input 
                type="password" 
                placeholder="Change password" 
                className="bg-gray-800 text-white px-3 py-2 rounded-md flex-grow"
              />
              <Edit2 className="text-gray-400 cursor-pointer" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
