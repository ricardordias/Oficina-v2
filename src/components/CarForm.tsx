import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";

interface CarFormProps {
  car?: any;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CarForm({ car, onClose, onSuccess }: CarFormProps) {
  const [manufacturer, setManufacturer] = useState(car?.manufacturer || '');
  const [model, setModel] = useState(car?.model || '');
  const [licensePlate, setLicensePlate] = useState(car?.licensePlate || '');
  const [loading, setLoading] = useState(false);

  const addCar = useMutation(api.cars.addCar);
  const updateCar = useMutation(api.cars.updateCar);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!manufacturer.trim() || !model.trim() || !licensePlate.trim()) {
      toast.error('Todos os campos são obrigatórios');
      return;
    }

    setLoading(true);
    try {
      if (car) {
        await updateCar({
          carId: car._id,
          manufacturer: manufacturer.trim(),
          model: model.trim(),
          licensePlate: licensePlate.trim().toUpperCase(),
        });
      } else {
        await addCar({
          manufacturer: manufacturer.trim(),
          model: model.trim(),
          licensePlate: licensePlate.trim().toUpperCase(),
        });
      }
      onSuccess();
    } catch (error) {
      toast.error('Erro ao salvar veículo');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 className="text-xl font-bold text-gray-900 mb-4">
          {car ? 'Editar Veículo' : 'Adicionar Veículo'}
        </h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fabricante
            </label>
            <input
              type="text"
              value={manufacturer}
              onChange={(e) => setManufacturer(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ex: Toyota, Honda, Ford..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Modelo
            </label>
            <input
              type="text"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ex: Corolla, Civic, Focus..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Placa
            </label>
            <input
              type="text"
              value={licensePlate}
              onChange={(e) => setLicensePlate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ex: ABC-1234"
              required
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Salvando...' : (car ? 'Atualizar' : 'Adicionar')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
