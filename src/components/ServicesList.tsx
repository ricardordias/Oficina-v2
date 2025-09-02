import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";

interface ServicesListProps {
  services: any[];
}

const serviceNames: Record<string, string> = {
  'complete-inspection': 'Revisão Completa',
  'oil-change': 'Troca de Óleo',
  'alignment-balancing': 'Alinhamento e Balanceamento',
  'brake-repair': 'Reparo de Freios',
  'suspension': 'Suspensão',
  'electrical': 'Elétrica',
};

const statusNames: Record<string, string> = {
  'agendado': 'Agendado',
  'em_andamento': 'Em Andamento',
  'concluido': 'Concluído',
};

const statusColors: Record<string, string> = {
  'agendado': 'bg-yellow-100 text-yellow-800',
  'em_andamento': 'bg-blue-100 text-blue-800',
  'concluido': 'bg-green-100 text-green-800',
};

export default function ServicesList({ services }: ServicesListProps) {
  const deleteService = useMutation(api.services.deleteService);

  const handleDelete = async (serviceId: any) => {
    if (confirm('Tem certeza que deseja cancelar este serviço?')) {
      try {
        await deleteService({ serviceId });
        toast.success('Serviço cancelado com sucesso');
      } catch (error) {
        toast.error('Erro ao cancelar serviço');
      }
    }
  };

  if (services.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <div className="text-4xl mb-2">🔧</div>
        <p>Nenhum serviço agendado ainda.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {services.map((service) => (
        <div key={service._id} className="border border-gray-200 rounded-lg p-4">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h3 className="font-semibold text-lg text-gray-900">
                  {serviceNames[service.serviceType] || service.serviceType}
                </h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[service.status]}`}>
                  {statusNames[service.status] || service.status}
                </span>
              </div>
              
              <div className="text-sm text-gray-600 space-y-1">
                <p>
                  <strong>Veículo:</strong> {service.car?.manufacturer} {service.car?.model} ({service.car?.licensePlate})
                </p>
                <p>
                  <strong>Data de Entrega:</strong> {new Date(service.deliveryDate).toLocaleDateString('pt-BR')}
                </p>
              </div>
            </div>
            
            {service.status === 'agendado' && (
              <button
                onClick={() => handleDelete(service._id)}
                className="text-red-600 hover:text-red-800 text-sm ml-4"
              >
                Cancelar
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
