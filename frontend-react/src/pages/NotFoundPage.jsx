import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="max-w-6xl mx-auto px-4">
      <div className="text-center py-16">
        <h1 className="text-6xl md:text-9xl font-bold text-gray-200 mb-4">404</h1>
        <h2 className="text-xl md:text-2xl font-medium text-gray-600 mb-4">Página no encontrada</h2>
        <p className="text-gray-500 mb-8">Lo sentimos, la página que buscas no existe.</p>
        <Link 
          to="/" 
          className="inline-block px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}
