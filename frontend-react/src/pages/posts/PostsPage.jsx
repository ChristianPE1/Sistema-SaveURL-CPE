import { useState, useEffect } from 'react';
import api from '$/api/api';

export default function PostsPage() {
   const [posts, setPosts] = useState([]);
   const [loading, setLoading] = useState(false);

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

   useEffect(() => {
      fetchPosts();
   }, []);

   return (
      <div className="max-w-3xl mx-auto px-4">
         <h1 className="text-4xl font-semibold text-gray-900 mb-8">Posts</h1>
         
         {loading && <p className="text-gray-500 italic">Cargando posts...</p>}
         
         {!loading && posts.length === 0 && (
            <div className="text-center py-8">
               <p className="text-gray-600">No hay posts disponibles.</p>
            </div>
         )}
         
         {!loading && posts.length > 0 && (
            <ul className="space-y-4">
               {posts.map((post) => (
                  <li key={post.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:border-gray-300 transition-colors">
                     <h3 className="text-lg font-medium text-gray-800 mb-2">{post.title}</h3>
                     {post.description && <p className="text-gray-600 mb-3">{post.description}</p>}
                     {post.url && (
                        <a 
                           href={post.url} 
                           target="_blank" 
                           rel="noopener noreferrer"
                           className="text-blue-600 hover:text-blue-800 transition-colors"
                        >
                           Ver enlace
                        </a>
                     )}
                  </li>
               ))}
            </ul>
         )}
      </div>
   );
}
