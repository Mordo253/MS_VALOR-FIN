import { Sidebar } from "../../components/Sidebar/Sidebar";
export const Dashboard = () => {
  return (
    <div className="flex min-h-screen bg-white"> {/* Cambiado a bg-white */}
      <main className="flex-1 ml-64 p-8 bg-white">
        <div className="max-w-7xl mx-auto ">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">DASHBOARD</h1>
          <p className="text-xl text-gray-600">VIEWS</p>
          {/* Aquí puedes añadir más contenido del dashboard */}
        </div>
      </main>
    </div>
  );
};
