import { useState, useEffect, useCallback } from 'react';
import { CiStar } from "react-icons/ci";
import { FaStar } from "react-icons/fa6";
import { IoMdCopy, IoMdCloseCircle } from "react-icons/io";
import { HiMiniPencilSquare } from "react-icons/hi2";
import { IoClose } from "react-icons/io5";
import { ToastContainer, toast } from 'react-toastify';
import api from '$/api/api';

export default function PostsPage() {
   const [posts, setPosts] = useState([]);
   const [categories, setCategories] = useState([]);
   const [loading, setLoading] = useState(false);
   const [editModal, setEditModal] = useState({ isOpen: false, type: '', postId: null });
   const [editValue, setEditValue] = useState('');
   const [createModal, setCreateModal] = useState(false);
   const [newPost, setNewPost] = useState({ title: '', url: '', image: '', category_id: [] });
   const [filters, setFilters] = useState({ search: '', category_id: '', favorites: false });
   const [categoryModal, setCategoryModal] = useState(false);
   const [newCategory, setNewCategory] = useState({ name: '', color: '#3B82F6' });
   const [editCategoryModal, setEditCategoryModal] = useState({ isOpen: false, categoryId: null });
   const [categoryListModal, setCategoryListModal] = useState(false);

   const fetchPosts = useCallback(async () => {
      setLoading(true);
      try {
         const params = new URLSearchParams();
         if (filters.search) params.append('search', filters.search);
         if (filters.category_id) params.append('category_id', filters.category_id);
         if (filters.favorites) params.append('favorites', 'true');

         const response = await api.get(`/posts?${params.toString()}`);
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
   }, [filters]);

   const fetchCategories = async () => {
      try {
         const response = await api.get('/categories');
         setCategories(response.data.data || response.data);
      } catch (error) {
         console.error('Error obteniendo categorías:', error);
      }
   };

   const handleCategoryListModal = (condition) => {
      if (condition) {
         setCategoryListModal(true);
      } else {
         setCategoryListModal(false);
      }
   };


   const openEditCategoryModal = (categoryId) => {
      const category = categories.find(cat => cat.id === categoryId);
      if (category) {
         setNewCategory({ name: category.name, color: category.color || '#3B82F6' });
         setEditCategoryModal({ isOpen: true, categoryId });
         setCategoryListModal(false);
         setCategoryModal(true);
      }
   };

   const handleUpdateCategory = async () => {
      try {
         const response = await api.put(`/categories/${editCategoryModal.categoryId}`, newCategory);
         setCategories(categories.map(cat => 
            cat.id === editCategoryModal.categoryId ? response.data : cat
         ));
         setCategoryModal(false);
         setEditCategoryModal({ isOpen: false, categoryId: null });
         setNewCategory({ name: '', color: '#3B82F6' });
         toast.success('Categoría actualizada exitosamente');
      } catch (error) {
         console.error('Error al actualizar categoría:', error);
         toast.error('Error al actualizar la categoría');
      }
   };

   const handleDeleteCategory = async (categoryId) => {
      if (window.confirm('¿Estás seguro de que quieres eliminar esta categoría? Esto no eliminará los posts, solo las relaciones.')) {
         try {
            await api.delete(`/categories/${categoryId}`);
            setCategories(categories.filter(cat => cat.id !== categoryId));
            toast.success('Categoría eliminada exitosamente');
         } catch (error) {
            console.error('Error al eliminar categoría:', error);
            toast.error('Error al eliminar la categoría');
         }
      }
   };

   const handleCreatePostModal = (condition) => {
      if(condition){
         setCreateModal(true);
      } else {
         setCreateModal(false);
      }
      setNewPost({ title: '', url: '', image: '', category_id: [] });
   };


   const handleCreatePost = async () => {
      try {
         const response = await api.post('/posts', newPost);
         setPosts([response.data, ...posts]);
         handleCreatePostModal(false);
         toast.success('Post creado exitosamente');
      } catch (error) {
         console.error('Error al crear post:', error);
         toast.error('Error al crear el post');
      }
   };

   const handleCategoryModal = (condition) => {
      if (condition) {
         setCategoryModal(true);
      } else {
         setCategoryModal(false);
      }
      setNewCategory({ name: '', color: '#3B82F6' });
   };

   const handleCreateCategory = async () => {
      try {
         const response = await api.post('/categories', newCategory);
         setCategories([...categories, response.data]);
         handleCategoryModal(false);
         toast.success('Categoría creada exitosamente');
      } catch (error) {
         console.error('Error al crear categoría:', error);
         toast.error('Error al crear la categoría');
      }
   };

   const changeIsFavorite = async (postId) => {
      try {
         await api.patch(`/posts/${postId}/favorite`);
         console.log('Cambio de favorito exitoso');

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

   const deletePost = async (postId) => {
      try {
         await api.delete(`/posts/${postId}`);
         setPosts(posts.filter(post => post.id !== postId));
      } catch (err) {
         console.error('Error al eliminar post:', err);
      }
   }

   useEffect(() => {
      fetchPosts();
      fetchCategories();
   }, [fetchPosts]);

   return (
      <div className="min-h-screen ">
         <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
               <h1 className="text-4xl md:text-5xl font-bold mb-4 ">
                  Mis Posts
               </h1>
               <p className="text-lg text-gray-600">Gestiona y organiza tus enlaces favoritos</p>
            </div>

            {/* Filtros */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
               <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                  <div>
                     <label className="block text-sm font-medium text-gray-700 mb-2">Buscar</label>
                     <input
                        type="text"
                        value={filters.search}
                        onChange={(e) => setFilters({...filters, search: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2  focus:border-transparent"
                        placeholder="Buscar por título..."
                     />
                  </div>
                  <div>
                     <label className="block text-sm font-medium text-gray-700 mb-2">Categoría</label>
                     <select
                        value={filters.category_id}
                        onChange={(e) => setFilters({...filters, category_id: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2  focus:border-transparent"
                     >
                        <option value="">Todas las categorías</option>
                        {categories.map((category) => (
                           <option key={category.id} value={category.id}>
                              {category.name}
                           </option>
                        ))}
                     </select>
                  </div>
                  <div className="flex items-center">
                     <label className="flex items-center">
                        <input
                           type="checkbox"
                           checked={filters.favorites}
                           onChange={(e) => setFilters({...filters, favorites: e.target.checked})}
                           className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded "
                        />
                        <span className="ml-2 text-sm font-medium text-gray-700">Solo favoritos</span>
                     </label>
                  </div>
                  <div className='flex flex-col gap-y-2'>
                     <button
                        onClick={() => handleCategoryModal(true)}
                        className="cursor-pointer w-full bg-green-600 text-white px-4 py-1 rounded-lg hover:bg-green-700 transition-colors font-medium"
                     >
                        Nueva Categoría
                     </button>
                     <button
                        onClick={() => handleCategoryListModal(true)}
                        className='cursor-pointer w-full bg-slate-400 text-white px-4 py-1 rounded-lg hover:bg-slate-600 transition-colors font-medium'
                     >
                        Editar Categorías
                     </button>
                  </div>
               </div>
            </div>
            
            {loading && (
               <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                  <p className="ml-4 text-gray-600 text-lg">Cargando posts...</p>
               </div>
            )}

            {!loading && posts.length > 0 && (
               <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {posts.map((post) => (
                     <article key={post.id} className="relative group bg-slate-200/50 rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-400  border border-gray-300">
                        
                        <header className="relative p-6 pb-0">
                           <aside className='absolute -top-3 left-1/2 -translate-x-1/2 z-10'>
                              <button
                                 className="bg-white cursor-pointer hover:bg-gray-100 rounded-full shadow-md p-1"
                                 title="Eliminar post"
                                 onClick={() => deletePost(post.id)}
                              >
                                 <IoMdCloseCircle className="text-red-500 hover:text-red-600 size-8" />
                              </button>
                           </aside>
                           <div className="flex justify-between items-center mb-4 mt-3">
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
                     </article>
                  ))}


                  <article className="relative group flex flex-col gap-y-3 justify-center items-center py-6 px-4 bg-slate-200/50 rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-400  border border-gray-300">
                        <div className="text-6xl mb-4">📝</div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">No hay posts disponibles</h3>
                        <p className="text-gray-600">¡Crea tu primer post para comenzar!</p>
                        <button
                           onClick={() => handleCreatePostModal(true)}
                           className=" bg-blue-600 cursor-pointer text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-700 transition-colors"
                        >
                           Crear nuevo post
                        </button>
                     </article>

               </main>
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
                           className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2  focus:border-transparent transition-colors"
                           placeholder="Ingresa el nuevo título"
                           autoFocus
                        />
                     ) : (
                        <input
                           type="url"
                           value={editValue}
                           onChange={(e) => setEditValue(e.target.value)}
                           className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2  focus:border-transparent transition-colors"
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

         {createModal && (
            <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
               <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full mx-4 transform transition-all">
                  <header className="flex items-center justify-between p-6 border-b border-gray-200">
                     <h3 className="text-xl font-bold text-gray-900">Crear Nuevo Post</h3>
                     <button
                        onClick={() => handleCreatePostModal(false)}
                        className="cursor-pointer p-2 hover:bg-gray-200 rounded-full transition-colors"
                     >
                        <IoClose className="size-6 text-gray-400" />
                     </button>
                  </header>
                  
                  <main className="p-6 flex flex-col gap-4">
                     <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Título</label>
                        <input
                           type="text"
                           value={newPost.title}
                           onChange={(e) => setNewPost({...newPost, title: e.target.value})}
                           className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2  focus:border-transparent"
                           placeholder="Título del post"
                        />
                     </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">URL</label>
                        <input
                           type="url"
                           value={newPost.url}
                           onChange={(e) => setNewPost({...newPost, url: e.target.value})}
                           className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:border-transparent"
                           placeholder="https://ejemplo.com"
                        />
                     </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Imagen (opcional)</label>
                        <input
                           type="url"
                           value={newPost.image}
                           onChange={(e) => setNewPost({...newPost, image: e.target.value})}
                           className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:border-transparent"
                           placeholder="https://ejemplo.com/imagen.jpg"
                        />
                     </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Categorías</label>
                        <select
                           multiple
                           value={newPost.category_id}
                           onChange={(e) => setNewPost({
                              ...newPost, 
                              category_id: Array.from(e.target.selectedOptions, option => option.value)
                           })}
                           className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:border-transparent h-32"
                        >
                           {categories.map((category) => (
                              <option key={category.id} value={category.id} className='px-2 py-1 rounded-md'>
                                 {category.name}
                              </option>
                           ))}
                        </select>
                        <p className="text-xs text-gray-500 mt-1">Mantén presionado Ctrl (Cmd en Mac) para seleccionar múltiples categorías</p>
                     </div>
                  </main>
                  
                  <footer className="flex gap-3 p-6 pt-0">
                     <button
                        onClick={() => handleCreatePostModal(false)}
                        className="cursor-pointer flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium"
                     >
                        Cancelar
                     </button>
                     <button
                        onClick={handleCreatePost}
                        disabled={!newPost.title || !newPost.url}
                        className="cursor-pointer flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                     >
                        Crear Post
                     </button>
                  </footer>
               </div>
            </div>
         )}

         {categoryModal && (
            <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
               <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 transform transition-all">
                  <header className="flex items-center justify-between p-6 border-b border-gray-200">
                     <h3 className="text-xl font-bold text-gray-900">
                        {editCategoryModal.isOpen ? 'Editar Categoría' : 'Nueva Categoría'}
                     </h3>
                     <button
                        onClick={() => {
                           handleCategoryModal(false);
                           if (editCategoryModal.isOpen) {
                              setEditCategoryModal({ isOpen: false, categoryId: null });
                           }
                        }}
                        className="cursor-pointer p-2 hover:bg-gray-200 rounded-full transition-colors"
                     >
                        <IoClose className="size-6 text-gray-500" />
                     </button>
                  </header>
                  
                  <main className="p-6 flex flex-col gap-4">
                     <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Nombre</label>
                        <input
                           type="text"
                           value={newCategory.name}
                           onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
                           className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:border-transparent"
                           placeholder="Nombre de la categoría"
                        />
                     </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
                        <input
                           type="color"
                           value={newCategory.color}
                           onChange={(e) => setNewCategory({...newCategory, color: e.target.value})}
                           className="w-full h-12 border border-gray-300 rounded-xl focus:ring-2 focus:border-transparent"
                        />
                     </div>
                  </main>
                  
                  <footer className="flex gap-3 p-6 pt-0">
                     <button
                        onClick={() => {
                           handleCategoryModal(false);
                           if (editCategoryModal.isOpen) {
                              setEditCategoryModal({ isOpen: false, categoryId: null });
                           }
                        }}
                        className="cursor-pointer flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium"
                     >
                        Cancelar
                     </button>
                     <button
                        onClick={editCategoryModal.isOpen ? handleUpdateCategory : handleCreateCategory}
                        disabled={!newCategory.name.trim()}
                        className={`cursor-pointer flex-1 px-4 py-3 text-white rounded-xl hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium ${
                           editCategoryModal.isOpen ? 'bg-blue-600' : 'bg-green-600'
                        }`}
                     >
                        {editCategoryModal.isOpen ? 'Actualizar Categoría' : 'Crear Categoría'}
                     </button>
                  </footer>
               </div>
            </div>
         )}

         {categoryListModal && (
            <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
               <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full mx-4 transform transition-all">
                  <header className="flex items-center justify-between p-6 border-b border-gray-200">
                     <h3 className="text-xl font-bold text-gray-900">Gestionar Categorías</h3>
                     <button
                        onClick={() => handleCategoryListModal(false)}
                        className="cursor-pointer p-2 hover:bg-gray-200 rounded-full transition-colors"
                     >
                        <IoClose className="size-6 text-gray-500" />
                     </button>
                  </header>
                  
                  <main className="p-6">
                     {categories.length === 0 ? (
                        <div className="text-center py-8">
                           <p className="text-gray-500">No tienes categorías creadas</p>
                           <button
                              onClick={() => {
                                 handleCategoryListModal(false);
                                 handleCategoryModal(true);
                              }}
                              className="mt-4 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                           >
                              Crear primera categoría
                           </button>
                        </div>
                     ) : (
                        <div className="space-y-3 max-h-96 overflow-y-auto">
                           {categories.map((category) => (
                              <div key={category.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                                 <div className="flex items-center gap-3">
                                    <div 
                                       className="w-6 h-6 rounded-full border-2 border-gray-300"
                                       style={{ backgroundColor: category.color }}
                                    ></div>
                                    <span className="font-medium text-gray-800">{category.name}</span>
                                 </div>
                                 <div className="flex gap-2">
                                    <button
                                       onClick={() => openEditCategoryModal(category.id)}
                                       className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                       title="Editar categoría"
                                    >
                                       <HiMiniPencilSquare className="size-5" />
                                    </button>
                                    <button
                                       onClick={() => handleDeleteCategory(category.id)}
                                       className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                       title="Eliminar categoría"
                                    >
                                       <IoMdCloseCircle className="size-5" />
                                    </button>
                                 </div>
                              </div>
                           ))}
                        </div>
                     )}
                  </main>
                  
                  <footer className="flex gap-3 p-6 pt-0 border-t border-gray-200">
                     <button
                        onClick={() => handleCategoryListModal(false)}
                        className="cursor-pointer flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium"
                     >
                        Cerrar
                     </button>
                     <button
                        onClick={() => {
                           handleCategoryListModal(false);
                           handleCategoryModal(true);
                        }}
                        className="cursor-pointer flex-1 px-4 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-medium"
                     >
                        Nueva Categoría
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
