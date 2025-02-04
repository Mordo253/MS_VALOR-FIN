import React from 'react';

const AgentProfile = ({ agent }) => {
  if (!agent) return null;

  return (
    <div className="max-w-xs bg-white rounded-lg overflow-hidden shadow-sm">
      {/* Profile Image Section */}
        <div className="w-56 h-[27rem] mx-auto rounded-lg overflow-hidden">
          <img
            src={agent.image}
            alt={agent.name}
            className="w-full h-full object-cover"
          />
        </div>

      {/* Info Section */}
      <div className="p-6 text-justify">
        <h2 className="text-2xl font-bold text-gray-900 mb-1">{agent.name}</h2>
        <p className="text-lg text-gray-600 mb-4">{agent.role}</p>
        
        {/* Contact Details */}
        <div className="space-y-1 mb-4">
          <p className="text-gray-700">
            <span className="font-normal">C. </span>
            <a href={`tel:${agent.phone}`} className="hover:text-blue-600">
              {agent.phone}
            </a>
          </p>
        </div>

        {/* Location */}
        <div className="space-y-1 text-gray-600">
          <p>MS De Valor</p>
          <p>Envigado</p>
          <p>Antioquia</p>
          <p>Colombia</p>
        </div>
      </div>
    </div>
  );
};

export default AgentProfile;