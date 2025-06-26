<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Support\Facades\Gate;

class PostController extends Controller implements HasMiddleware
{
    public static function middleware()
    {
        return [
            new Middleware('auth:sanctum', except: ['index', 'show'])
        ];
    }

    public function index()
    {
        return Post::all();
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
        ]);

        $post = $request->user()->posts()->create($fields);

        return response()->json($post, 201);
        //return ['post' => $post, 'message' => 'Post created successfully'];
    }

    /**
     * Display the specified resource.
     */
    public function show(Post $post)
    {
        return response()->json($post);
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
        ]);

        $post->update($fields);

        return response()->json($post);
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
}
