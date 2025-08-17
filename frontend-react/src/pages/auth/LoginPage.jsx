import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '$/api/api.js';
import { ACCESS_TOKEN } from '$/api/constants';

export default function LoginPage() {
   const navigate = useNavigate();
   
   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');
   const [isLoading, setIsLoading] = useState(false);
   const defaultLogin = {
      email: 'user@gmail.com',
      password: '123456'
   };

   const handleSubmit = async (e) => {
      e.preventDefault();
      setIsLoading(true);
      try {
         const res = await api.post('/login', { email, password });
         console.log('Login response:', res.data);
         if (res.data.token) {
            localStorage.setItem(ACCESS_TOKEN, res.data.token);
            console.log('Login exitoso - Token guardado:', localStorage.getItem(ACCESS_TOKEN) ? 'sí' : 'no');
            navigate('/posts');
         }
      } catch (error) {
         console.error('Error en el login:', error);
      } finally {
         setIsLoading(false);
      }
   };

   return (
      <div className="min-h-[calc(100vh-200px)] flex justify-center items-center">
         <div className="w-full max-w-md mx-4 bg-white border border-gray-200 rounded-lg p-8 shadow-sm">
            <div className="text-center mb-6">
               <h1 className="text-3xl font-semibold text-gray-900 mb-2">Iniciar Sesión</h1>
               <p className="text-gray-600">Ingresa a tu cuenta de SaveURL</p>
            </div>
            
            {isLoading && <p className="text-gray-500 italic text-center mb-4">Iniciando sesión...</p>}
            
            <form onSubmit={handleSubmit}>
               <div className="mb-6">
                  <label htmlFor="email-input" className="block mb-2 font-medium text-gray-700">
                     Email:
                  </label>
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
                  <label htmlFor="password-input" className="block mb-2 font-medium text-gray-700">
                     Contraseña:
                  </label>
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
               
               <button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full mb-4 px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 hover:-translate-y-0.5"
               >
                  {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
               </button>
               
               <button
                  type="button"
                  onClick={() => {
                     setEmail(defaultLogin.email);
                     setPassword(defaultLogin.password);
                  }}
                  className="w-full px-6 py-3 bg-gray-600 text-white font-medium rounded-md hover:bg-gray-700 transition-all duration-200 hover:-translate-y-0.5"
               >
                  Usar credenciales por defecto
               </button>
            </form>
            
            <div className="text-center mt-6">
               <p className="text-gray-600">
                  ¿No tienes cuenta?{' '}
                  <Link to="/register" className="text-blue-600 hover:text-blue-800 transition-colors">
                     Regístrate aquí
                  </Link>
               </p>
            </div>
         </div>
      </div>
   );
}