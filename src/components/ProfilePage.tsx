import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState } from "react";
import { toast } from "sonner";
import CarForm from "./CarForm";
import CarList from "./CarList";
import ServicesList from "./ServicesList";

interface ProfilePageProps {
  onNavigateToServices: () => void;
}

export default function ProfilePage({ onNavigateToServices }: ProfilePageProps) {
  const user = useQuery(api.auth.loggedInUser);
  const cars = useQuery(api.cars.getUserCars) || [];
  const services = useQuery(api.services.getUserServices) || [];
  
  const [showCarForm, setShowCarForm] = useState(false);
  const [editingCar, setEditingCar] = useState<any>(null);

  const handleEditCar = (car: any) => {
    setEditingCar(car);
    setShowCarForm(true);
  };

  const handleCarFormClose = () => {
    setShowCarForm(false);
    setEditingCar(null);
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Dados do Usuário */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Meu Perfil</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nome</label>
            <p className="mt-1 text-lg text-gray-900">{user.name || 'Não informado'}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <p className="mt-1 text-lg text-gray-900">{user.email || 'Não informado'}</p>
          </div>
        </div>
      </div>

      {/* Carros Cadastrados */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Meus Veículos</h2>
          <button
            onClick={() => setShowCarForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            + Adicionar Veículo
          </button>
        </div>

        {showCarForm && (
          <CarForm
            car={editingCar}
            onClose={handleCarFormClose}
            onSuccess={() => {
              handleCarFormClose();
              toast.success(editingCar ? 'Veículo atualizado!' : 'Veículo cadastrado!');
            }}
          />
        )}

        <CarList cars={cars} onEdit={handleEditCar} />
      </div>

      {/* Botão de Serviços */}
      {cars.length > 0 && (
        <div className="text-center">
          <button
            onClick={onNavigateToServices}
            className="bg-green-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-green-700 transition-colors shadow-md"
          >
            Agendar Serviços
          </button>
        </div>
      )}

      {/* Serviços Agendados */}
      {services.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Serviços Agendados</h2>
          <ServicesList services={services} />
        </div>
      )}
    </div>
  );
}
