interface ServicesPageProps {
  onSelectService: (serviceType: string) => void;
}

const services = [
  {
    id: 'complete-inspection',
    name: 'Revisão Completa',
    description: 'Verificação completa de todos os sistemas do veículo',
    icon: '🔍',
    color: 'bg-blue-500',
  },
  {
    id: 'oil-change',
    name: 'Troca de Óleo',
    description: 'Troca de óleo do motor e filtro',
    icon: '🛢️',
    color: 'bg-amber-500',
  },
  {
    id: 'alignment-balancing',
    name: 'Alinhamento e Balanceamento',
    description: 'Alinhamento das rodas e balanceamento dos pneus',
    icon: '⚖️',
    color: 'bg-purple-500',
  },
  {
    id: 'brake-repair',
    name: 'Reparo de Freios',
    description: 'Manutenção e reparo do sistema de freios',
    icon: '🛑',
    color: 'bg-red-500',
  },
  {
    id: 'suspension',
    name: 'Suspensão',
    description: 'Reparo e manutenção da suspensão',
    icon: '🔧',
    color: 'bg-green-500',
  },
  {
    id: 'electrical',
    name: 'Elétrica',
    description: 'Diagnóstico e reparo do sistema elétrico',
    icon: '⚡',
    color: 'bg-yellow-500',
  },
];

export default function ServicesPage({ onSelectService }: ServicesPageProps) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Nossos Serviços</h1>
        <p className="text-gray-600">Selecione o serviço que deseja agendar</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => (
          <div
            key={service.id}
            onClick={() => onSelectService(service.id)}
            className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow border-2 border-transparent hover:border-blue-200"
          >
            <div className="text-center">
              <div className={`w-16 h-16 ${service.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                <span className="text-2xl">{service.icon}</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {service.name}
              </h3>
              <p className="text-gray-600 text-sm">
                {service.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
