import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '$/api/api';

export default function RegisterPage() {
   const [name, setName] = useState('');
   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');
   const [passwordConfirmation, setPasswordConfirmation] = useState('');
   const [isLoading, setIsLoading] = useState(false);

   const handleSubmit = async (e) => {
      e.preventDefault();
      setIsLoading(true);
      try {
         const res = await api.post('/register', { 
            name, 
            email, 
            password,
            password_confirmation: passwordConfirmation
         });
         if (res.data.token) {
            console.log('Registro exitoso');
         }
      } catch (error) {
         console.error('Error en el registro:', error);
      } finally {
         setIsLoading(false);
      }
   };

   return (
      <div className="min-h-[calc(100vh-200px)] flex justify-center items-center">
         <div className="w-full max-w-md mx-4 bg-white border border-gray-200 rounded-lg p-8 shadow-sm">
            <div className="text-center mb-6">
               <h1 className="text-3xl font-semibold text-gray-900 mb-2">Registrarse</h1>
               <p className="text-gray-600">Crea tu cuenta en SaveURL</p>
            </div>
            
            {isLoading && <p className="text-gray-500 italic text-center mb-4">Creando cuenta...</p>}
            
            <form onSubmit={handleSubmit}>
               <div className="mb-6">
                  <label htmlFor="name-input" className="block mb-2 font-medium text-gray-700">Nombre:</label>
                  <input
                     type="text"
                     value={name}
                     onChange={(e) => setName(e.target.value)}
                     placeholder="Tu nombre completo"
                     id="name-input"
                     className="w-full px-4 py-3 border border-gray-300 rounded-md text-base bg-white transition-colors focus:outline-none focus:ring-3 focus:ring-blue-100 focus:border-blue-600"
                     required
                  />
               </div>

               <div className="mb-6">
                  <label htmlFor="email-input" className="block mb-2 font-medium text-gray-700">Email:</label>
                  <input
                     type="email"
                     value={email}
                     onChange={(e) => setEmail(e.target.value)}
                     placeholder="tu@email.com"
                     id="email-input"
                     className="w-full px-4 py-3 border border-gray-300 rounded-md text-base bg-white transition-colors focus:outline-none focus:ring-3 focus:ring-blue-100 focus:border-blue-600"
                     required
                  />
               </div>
               
               <div className="mb-6">
                  <label htmlFor="password-input" className="block mb-2 font-medium text-gray-700">Contraseña:</label>
                  <input
                     type="password"
                     value={password}
                     onChange={(e) => setPassword(e.target.value)}
                     placeholder="Tu contraseña"
                     id="password-input"
                     className="w-full px-4 py-3 border border-gray-300 rounded-md text-base bg-white transition-colors focus:outline-none focus:ring-3 focus:ring-blue-100 focus:border-blue-600"
                     required
                  />
               </div>

               <div className="mb-6">
                  <label htmlFor="password-confirmation-input" className="block mb-2 font-medium text-gray-700">Confirmar Contraseña:</label>
                  <input
                     type="password"
                     value={passwordConfirmation}
                     onChange={(e) => setPasswordConfirmation(e.target.value)}
                     placeholder="Repite tu contraseña"
                     id="password-confirmation-input"
                     className="w-full px-4 py-3 border border-gray-300 rounded-md text-base bg-white transition-colors focus:outline-none focus:ring-3 focus:ring-blue-100 focus:border-blue-600"
                     required
                  />
               </div>
               
               <button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 hover:-translate-y-0.5"
               >
                  {isLoading ? 'Creando cuenta...' : 'Registrarse'}
               </button>
            </form>
            
            <div className="text-center mt-6">
               <p className="text-gray-600">
                  ¿Ya tienes cuenta?{' '}
                  <Link to="/login" className="text-blue-600 hover:text-blue-800 transition-colors">
                     Inicia sesión aquí
                  </Link>
               </p>
            </div>
         </div>
      </div>
   );
}