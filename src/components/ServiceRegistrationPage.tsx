import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";

interface ServiceRegistrationPageProps {
  serviceType: string;
  onBack: () => void;
  onSuccess: () => void;
}

const serviceNames: Record<string, string> = {
  'complete-inspection': 'Revisão Completa',
  'oil-change': 'Troca de Óleo',
  'alignment-balancing': 'Alinhamento e Balanceamento',
  'brake-repair': 'Reparo de Freios',
  'suspension': 'Suspensão',
  'electrical': 'Elétrica',
};

export default function ServiceRegistrationPage({ 
  serviceType, 
  onBack, 
  onSuccess 
}: ServiceRegistrationPageProps) {
  const cars = useQuery(api.cars.getUserCars) || [];
  const scheduleService = useMutation(api.services.scheduleService);
  
  const [selectedCarId, setSelectedCarId] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [loading, setLoading] = useState(false);

  // Data mínima é amanhã
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedCarId || !deliveryDate) {
      toast.error('Todos os campos são obrigatórios');
      return;
    }

    setLoading(true);
    try {
      await scheduleService({
        carId: selectedCarId as any,
        serviceType,
        deliveryDate,
      });
      toast.success('Serviço agendado com sucesso!');
      onSuccess();
    } catch (error) {
      toast.error('Erro ao agendar serviço');
    } finally {
      setLoading(false);
    }
  };

  if (cars.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-4xl mb-4">🚗</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Nenhum veículo cadastrado
        </h2>
        <p className="text-gray-600 mb-6">
          Você precisa cadastrar pelo menos um veículo antes de agendar serviços.
        </p>
        <button
          onClick={onBack}
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          Voltar aos Serviços
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center mb-6">
          <button
            onClick={onBack}
            className="text-gray-600 hover:text-gray-800 mr-4"
          >
            ← Voltar
          </button>
          <h1 className="text-2xl font-bold text-gray-900">
            Agendar {serviceNames[serviceType]}
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Selecione o Veículo
            </label>
            <select
              value={selectedCarId}
              onChange={(e) => setSelectedCarId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Escolha um veículo...</option>
              {cars.map((car) => (
                <option key={car._id} value={car._id}>
                  {car.manufacturer} {car.model} - {car.licensePlate}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Data de Entrega na Oficina
            </label>
            <input
              type="date"
              value={deliveryDate}
              onChange={(e) => setDeliveryDate(e.target.value)}
              min={minDate}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Selecione uma data a partir de amanhã
            </p>
          </div>

          <div className="bg-blue-50 p-4 rounded-md">
            <h3 className="font-medium text-blue-900 mb-2">Resumo do Agendamento:</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li><strong>Serviço:</strong> {serviceNames[serviceType]}</li>
              {selectedCarId && (
                <li>
                  <strong>Veículo:</strong> {
                    cars.find(car => car._id === selectedCarId)?.manufacturer
                  } {
                    cars.find(car => car._id === selectedCarId)?.model
                  } - {
                    cars.find(car => car._id === selectedCarId)?.licensePlate
                  }
                </li>
              )}
              {deliveryDate && (
                <li>
                  <strong>Data:</strong> {new Date(deliveryDate).toLocaleDateString('pt-BR')}
                </li>
              )}
            </ul>
          </div>

          <div className="flex space-x-3">
            <button
              type="button"
              onClick={onBack}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Agendando...' : 'Confirmar Agendamento'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
