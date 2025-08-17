
import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <div className="max-w-6xl mx-auto px-4">
      <div className="text-center py-16">
        <h1 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-4">
          Bienvenido a SaveURL
        </h1>
        <p className="text-base md:text-lg text-gray-600 mb-4">
          Guarda y organiza tus enlaces favoritos de manera simple y elegante.
        </p>
        <p className="text-base md:text-lg text-gray-600 mb-8">
          Inicia creándote una cuenta para guardar tus URLs favoritos
        </p>
        <div>
          <Link 
            to="/register" 
            className="inline-block px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors duration-200 hover:-translate-y-0.5"
          >
            Crear una cuenta
          </Link>
        </div>
      </div>
    </div>
  );
}
