import { Unauthenticated } from "convex/react";
import { SignInForm } from "../SignInForm";

interface HomePageProps {
  onNavigateToProfile: () => void;
}

export default function HomePage({ onNavigateToProfile }: HomePageProps) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center max-w-md mx-auto">
        <div className="mb-8">
          <div className="text-8xl mb-4">🔧</div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">AutoCare</h1>
          <p className="text-xl text-gray-600">Sua oficina mecânica digital</p>
        </div>

        <Unauthenticated>
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              Entre com sua conta
            </h2>
            <SignInForm />
          </div>
        </Unauthenticated>
      </div>
    </div>
  );
}
