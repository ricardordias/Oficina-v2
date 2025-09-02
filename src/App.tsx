import { Authenticated, Unauthenticated, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { SignInForm } from "./SignInForm";
import { SignOutButton } from "./SignOutButton";
import { Toaster } from "sonner";
import { useState } from "react";
import HomePage from "./components/HomePage";
import ProfilePage from "./components/ProfilePage";
import ServicesPage from "./components/ServicesPage";
import ServiceRegistrationPage from "./components/ServiceRegistrationPage";

export default function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'profile' | 'services' | 'service-registration'>('home');
  const [selectedService, setSelectedService] = useState<string>('');

  const loggedInUser = useQuery(api.auth.loggedInUser);

  const navigateToServices = () => setCurrentPage('services');
  const navigateToProfile = () => setCurrentPage('profile');
  const navigateToServiceRegistration = (serviceType: string) => {
    setSelectedService(serviceType);
    setCurrentPage('service-registration');
  };

  if (loggedInUser === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Authenticated>
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setCurrentPage('home')}
                className="text-2xl font-bold text-blue-600 hover:text-blue-700"
              >
                🔧 AutoCare
              </button>
              <nav className="flex space-x-4">
                  <button
                    onClick={navigateToProfile}
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                      currentPage === 'profile'
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Perfil
                  </button>
                  <button
                    onClick={navigateToServices}
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                      currentPage === 'services' || currentPage === 'service-registration'
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Serviços
                  </button>
              </nav>
            </div>
            <SignOutButton />
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 py-8">
          {currentPage === 'home' && (
            <HomePage onNavigateToProfile={navigateToProfile} />
          )}
          {currentPage === 'profile' && (
            <ProfilePage onNavigateToServices={navigateToServices} />
          )}
          {currentPage === 'services' && (
            <ServicesPage onSelectService={navigateToServiceRegistration} />
          )}
          {currentPage === 'service-registration' && (
            <ServiceRegistrationPage
              serviceType={selectedService}
              onBack={navigateToServices}
              onSuccess={navigateToProfile}
            />
          )}
        </main>
      </Authenticated>

      <Unauthenticated>
        <HomePage onNavigateToProfile={() => {}} />
      </Unauthenticated>

      <Toaster />
    </div>
  );
}
