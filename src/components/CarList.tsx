import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";

interface CarListProps {
  cars: any[];
  onEdit: (car: any) => void;
}

export default function CarList({ cars, onEdit }: CarListProps) {
  const deleteCar = useMutation(api.cars.deleteCar);

  const handleDelete = async (carId: any) => {
    if (confirm('Tem certeza que deseja excluir este veículo? Todos os serviços relacionados também serão excluídos.')) {
      try {
        await deleteCar({ carId });
        toast.success('Veículo excluído com sucesso');
      } catch (error) {
        toast.error('Erro ao excluir veículo');
      }
    }
  };

  if (cars.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <div className="text-4xl mb-2">🚗</div>
        <p>Nenhum veículo cadastrado ainda.</p>
        <p className="text-sm">Adicione seu primeiro veículo para começar!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {cars.map((car) => (
        <div key={car._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="font-semibold text-lg text-gray-900">
                {car.manufacturer} {car.model}
              </h3>
              <p className="text-gray-600 font-mono">{car.licensePlate}</p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => onEdit(car)}
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                Editar
              </button>
              <button
                onClick={() => handleDelete(car._id)}
                className="text-red-600 hover:text-red-800 text-sm"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
