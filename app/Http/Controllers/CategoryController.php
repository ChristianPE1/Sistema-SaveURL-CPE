<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Http\Requests\StoreCategoryRequest;
use App\Http\Requests\UpdateCategoryRequest;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        return response()->json($request->user()->categories()->get());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $fields = $request->validate([
            'name' => 'required|string|max:200',
            'color' => 'nullable|string|max:10'
        ]);

        $exists = $request->user()->categories()->where('name',$fields['name'])->exists();
        if ($exists){
            return response()->json(['message' => 'Ya tienes una categoría con ese nombre'],422);
        }

        $category = $request->user()->categories()->create($fields);
        return response()->json($category,201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Category $category, Request $request)
    {
        if ($category->user_id !== $request->user()->id){
            abort(403, 'No autorizado');
        }

        return response()->json($category->load('posts'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateCategoryRequest $request, Category $category)
    {
        if ($category->user_id !== $request->user()->id){
            abort(403, 'No autorizado');
        }

        $fields = $request->validate([
            'name' => 'required|string|max:200',
            'color' => 'nullable|string|max:10'
        ]);

        $category->update($fields);
        return response()->json($category);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Category $category)
    {
        if ($category->user_id !== request()->user()->id) {
            abort(403, 'No autorizado');
        }

        $category->delete();
        return response()->json(['message' => 'Categoría eliminada']);
    }
}
