import { useState, useEffect } from 'react';
import { CiStar } from "react-icons/ci";
import { FaStar } from "react-icons/fa6";
import { IoMdCopy } from "react-icons/io";
import { HiMiniPencilSquare } from "react-icons/hi2";
import { IoClose } from "react-icons/io5";
import { ToastContainer, toast } from 'react-toastify';
import api from '$/api/api';

export default function PostsPage() {
   const [posts, setPosts] = useState([]);
   const [loading, setLoading] = useState(false);
   const [editModal, setEditModal] = useState({ isOpen: false, type: '', postId: null });
   const [editValue, setEditValue] = useState('');

   const fetchPosts = async () => {
      setLoading(true);
      try {
         const response = await api.get('/posts');
         setPosts(response.data.data || response.data);
         console.log('Posts obtenidos:', response.data);
      } catch (error) {
         if (error.response && error.response.status === 401) {
            console.error('No autorizado:', error);
         } else {
            console.error('Error obteniendo posts:', error);
         }
      } finally {
         setLoading(false);
      }
   };

   const changeIsFavorite = async (postId) => {
      try {
         const res = await api.patch(`/posts/${postId}/favorite`);
         console.log('Cambio de favorito exitoso:', res.data);

         setPosts(posts.map((post) => {
            if (post.id === postId) {
               return { ...post, is_favorite: !post.is_favorite };
            }
            return post;
         }));
      } catch (err) {
         console.error('Error al cambiar favorito:', err);
      }
   }

   const openEditModal = (type, postId, currentValue) => {
      setEditModal({ isOpen: true, type, postId });
      // Asegurar que editValue sea siempre una cadena (fallback a cadena vacía)
      setEditValue(currentValue ?? '');
   };

   const closeEditModal = () => {
      setEditModal({ isOpen: false, type: '', postId: null });
      setEditValue('');
   };

   const handleEdit = async () => {
      try {
         const { type, postId } = editModal;
         let updateData = {};
         
         if (type === 'title') updateData.title = editValue;
         if (type === 'image') updateData.image = editValue;
         if (type === 'url') updateData.url = editValue;

         await api.put(`/posts/${postId}`, updateData);
         
         // Actualizar el estado de la card
         setPosts(posts.map((post) => {
            if (post.id === postId) {
               return { ...post, ...updateData, image_url: type === 'image' ? editValue : post.image_url };
            }
            return post;
         }));

         closeEditModal();
      } catch (error) {
         console.error('Error al editar post:', error);
      }
   };

   const canSave = !!(editValue && String(editValue).trim());

   const copyToClipboard = async (url) => {
      try {
         await navigator.clipboard.writeText(url);
         toast.success('Enlace copiado al portapapeles');
      } catch (err) {
         console.error('Error al copiar:', err);
         toast.error('Error al copiar el enlace');
      }
   };

   useEffect(() => {
      fetchPosts();
   }, []);

   return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
         <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
               <h1 className="text-4xl md:text-5xl font-bold mb-4 ">
                  Mis Posts
               </h1>
               <p className="text-lg text-gray-600">Gestiona y organiza tus enlaces favoritos</p>
            </div>
            
            {loading && (
               <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                  <p className="ml-4 text-gray-600 text-lg">Cargando posts...</p>
               </div>
            )}
            
            {!loading && posts.length === 0 && (
               <div className="text-center py-16">
                  <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md mx-auto">
                     <div className="text-6xl mb-4">📝</div>
                     <h3 className="text-xl font-semibold text-gray-800 mb-2">No hay posts disponibles</h3>
                     <p className="text-gray-600">¡Crea tu primer post para comenzar!</p>
                  </div>
               </div>
            )}
            
            {!loading && posts.length > 0 && (
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {posts.map((post) => (
                     <div key={post.id} className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-400 overflow-hidden border border-gray-200">
                        <header className="relative p-6 pb-0">
                           <div className="flex justify-between items-center mb-4">
                              <div className="flex items-center justify-center gap-2 ">
                                 <h3 className="text-lg font-bold text-gray-800 line-clamp-2 leading-tight">
                                    {post.title}
                                 </h3>
                                 <button
                                    onClick={() => openEditModal('title', post.id, post.title)}
                                    className="cursor-pointer p-1 hover:bg-gray-100 rounded-md"
                                    title="Editar título"
                                 >
                                    <HiMiniPencilSquare className="text-gray-500 hover:text-blue-600 size-6" />
                                 </button>
                              </div>
                              <button 
                                 className="cursor-pointer hover:bg-gray-100 rounded-full transition-colors"
                                 onClick={() => changeIsFavorite(post.id)}
                                 title={post.is_favorite ? "Quitar de favoritos" : "Agregar a favoritos"}
                              >
                                 {post.is_favorite ? (
                                    <FaStar className="text-yellow-500 size-6" />
                                 ) : (
                                    <CiStar className="text-gray-400 size-6" />
                                 )}
                              </button>
                           </div>
                        </header>
                        
                        <section className="relative group/image px-6">
                           <div className="relative overflow-hidden rounded-xl">
                              <img 
                                 src={post.image} 
                                 alt={post.title} 
                                 className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105" 
                              />
                              <div className="absolute inset-0  flex items-center justify-center">
                                 <button
                                    onClick={() => openEditModal('image', post.id, post.image)}
                                    className=" bg-white hover:bg-gray-300 cursor-pointer p-2 rounded-full shadow-lg"
                                    title="Cambiar imagen"
                                 >
                                    <HiMiniPencilSquare className="text-gray-700 size-4" />
                                 </button>
                              </div>
                           </div>
                        </section>
                        
                        {/* Footer with actions */}
                        <footer className="p-6 pt-4">
                           <div className="flex items-center gap-3  min-w-0">
                              <button
                                 onClick={() => copyToClipboard(post.url)}
                                 className="p-2 hover:bg-white rounded-lg flex-shrink-0"
                                 title="Copiar enlace"
                              >
                                 <IoMdCopy className="text-gray-600 hover:text-blue-600 size-5" />
                              </button>
                              
                              {post.url && (
                                 <section className="flex items-center gap-2 flex-1 min-w-0">
                                    <a 
                                       href={post.url} 
                                       target="_blank" 
                                       rel="noopener noreferrer"
                                       className="text-blue-600 hover:text-blue-800 font-medium truncate flex-1"
                                       title={post.url}
                                    >
                                       Ver enlace
                                    </a>
                                    <button
                                       onClick={() => openEditModal('url', post.id, post.url)}
                                       className="p-1 hover:bg-white rounded-md flex-shrink-0"
                                       title="Editar URL"
                                    >
                                       <HiMiniPencilSquare className="text-gray-500 hover:text-blue-600 size-4" />
                                    </button>
                                 </section>
                              )}
                           </div>
                        </footer>
                     </div>
                  ))}
               </div>
            )}
         </section>

         {editModal.isOpen && (
            <div className="fixed inset-0  bg-opacity-50 flex items-center justify-center p-4 z-50">
               <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 transform transition-all">
                  <header className="flex items-center justify-between p-6 border-b border-gray-200">
                     <h3 className="text-xl font-bold text-gray-900">
                        Editar {editModal.type === 'title' ? 'Título' : editModal.type === 'image' ? 'Imagen' : 'URL'}
                     </h3>
                     <button
                        onClick={closeEditModal}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                     >
                        <IoClose className="size-6 text-gray-400" />
                     </button>
                  </header>
                  
                  <main className="p-6">
                     <label className="block text-sm font-medium text-gray-700 mb-3">
                        {editModal.type === 'title' ? 'Nuevo título:' : 
                         editModal.type === 'image' ? 'Nueva URL de imagen:' : 
                         'Nueva URL:'}
                     </label>
                     {editModal.type === 'title' ? (
                        <input
                           type="text"
                           value={editValue}
                           onChange={(e) => setEditValue(e.target.value)}
                           className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                           placeholder="Ingresa el nuevo título"
                           autoFocus
                        />
                     ) : (
                        <input
                           type="url"
                           value={editValue}
                           onChange={(e) => setEditValue(e.target.value)}
                           className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                           placeholder={editModal.type === 'image' ? "https://ejemplo.com/imagen.jpg" : "https://ejemplo.com"}
                           autoFocus
                        />
                     )}
                  </main>
                  
                  <footer className="flex gap-3 p-6 pt-0">
                     <button
                        onClick={closeEditModal}
                        className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                     >
                        Cancelar
                     </button>
                     <button
                        onClick={handleEdit}
                        disabled={!canSave}
                        className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                     >
                        Guardar
                     </button>
                  </footer>
               </div>
            </div>
         )}
         <ToastContainer 
            position="top-center" 
            autoClose={1000} 
            hideProgressBar={true} 
            newestOnTop={false} 
            closeOnClick 
            rtl={false} 
            pauseOnFocusLoss 
            draggable 
            pauseOnHover
         />
      </div>
   );
}
