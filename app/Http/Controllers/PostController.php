<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class PostController extends Controller
{
    public function index(Request $request)
    {
        $query = $request->user()->posts()->with('categories');

        // Filtrar por titulo
        if ($request->has('search')) {
            $query->where('title','like','%' . $request->search . '%');
        }

        // Filtrar favoritos
        if ($request->has('favorites') && $request->favorites == 'true'){
            $query->where('is_favorite', true);
        }

        // Filtrar por categoria
        if ($request->has('category_id')) {
            $query->whereHas('categories', function ($q) use ($request) {
                $q->where('categories.id', $request->category_id);
            });
        }

        $query->orderBy('created_at', 'desc');

        return response()->json($query->get());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $fields = $request->validate([
            'title' => 'required|string|max:255',
            'url' => 'required|url|unique:posts,url',
            'image' => 'nullable|string|max:2048',
            'is_favorite' => 'boolean',
            'category_id' => 'array',
            'category_id.*' => 'exists:categories,id'
        ]);

        $post = $request->user()->posts()->create($fields);

        if (isset($fields['category_id'])) {
            // Verificar que las categorías pertenezcan al usuario
            $userCategories = $request->user()->categories()
                ->whereIn('id', $fields['category_id'])
                ->pluck('id');

            $post->categories()->attach($userCategories);
        }

        return response()->json($post->load('categories'), 201);
        //return ['post' => $post, 'message' => 'Post created successfully'];
    }

    /**
     * Display the specified resource.
     */
    public function show(Request $request, Post $post)
    {
        /*if ($post->user_id !== $request->user()->id) {
            abort(403, 'No autorizado');
        }*/
        Gate::authorize('view', $post);

        return response()->json($post->load('categories'));
        //return ['post' => $post];
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Post $post)
    {

        // Check if the authenticated user can modify the post
        Gate::authorize('modify', $post);

        $fields = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'url' => 'sometimes|required|url|unique:posts,url,' . $post->id,
            'image' => 'nullable|string|max:2048',
            'is_favorite' => 'boolean',
            'category_id' => 'array',
            'category_id.*' => 'exists:categories,id'
        ]);

        $post->update($fields);

        if (isset($fields['category_ids'])) {
            $userCategories = $request->user()->categories()
                ->whereIn('id', $fields['category_ids'])
                ->pluck('id');

            $post->categories()->sync($userCategories);
        }

        return response()->json($post->load('categories'));
        //return ['post' => $post, 'message' => 'Post updated successfully'];
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Post $post)
    {
        Gate::authorize('modify', $post);
        $post->delete();

        return response()->json(['message' => 'Post deleted successfully']);
        //return ['message' => 'Post deleted successfully'];  
    }

    public function toggleFavorite(Post $post)
    {
        Gate::authorize('modify', $post);

        $post->update(['is_favorite' => !$post->is_favorite]);

        $message = '';
        if ($post->is_favorite) {
            $message = 'Marcado como favorito';
        } else {
            $message = 'Desmarcado como favorito';
        }

        return response()->json([
            'message' => $message,
            'is_favorite' => $post->is_favorite
        ]);
    }
}
