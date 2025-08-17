import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ACCESS_TOKEN } from '$/api/constants';
import api from '$/api/api.js';

export default function NavBar() {
   const navigate = useNavigate();
   const [isLoggingOut, setIsLoggingOut] = useState(false);

   const handleLogout = async () => {
      setIsLoggingOut(true);
      try {
         await api.post('/logout');
         console.log('Logout exitoso');
      } catch (error) {
         console.error('Error en logout:', error);
      } finally {
         localStorage.removeItem(ACCESS_TOKEN);
         setIsLoggingOut(false);
         navigate('/login');
      }
   };

   return (
      <nav className="bg-white border-b border-gray-200 py-4">
         <div className="max-w-6xl mx-auto px-4">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
               <Link to="/" className="text-xl font-semibold text-gray-800 hover:text-gray-600 transition-colors">
                  SaveURL
               </Link> 
               <div className="flex flex-wrap justify-center md:justify-end gap-4 md:gap-8 items-center">
                  <Link to="/posts" className="text-gray-600 font-medium hover:text-gray-800 transition-colors">
                     Posts
                  </Link>
                  <Link to="/login" className="text-gray-600 font-medium hover:text-gray-800 transition-colors">
                     Login
                  </Link>
                  <Link to="/register" className="text-gray-600 font-medium hover:text-gray-800 transition-colors">
                     Register
                  </Link>
                  <button 
                     onClick={handleLogout} 
                     disabled={isLoggingOut}
                     className="px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 font-medium hover:bg-gray-50 hover:border-gray-400 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 hover:-translate-y-0.5"
                  >
                     {isLoggingOut ? 'Cerrando sesión...' : 'Logout'}
                  </button>
               </div>
            </div>
         </div>
      </nav>
   );
}
