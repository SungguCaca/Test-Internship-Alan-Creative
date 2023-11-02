<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Product;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    public function index()
    {
        $products = Product::all();
        return response()->json($products);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required',
            'price' => 'required',
            'product_category_id' => 'required|exists:product_categories,id',
            'image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048'
        ]);
    
        // Mengunggah gambar
        $imagePath = $request->file('image')->store('product_images', 'public');
    
        $product = Product::create([
            'name' => $data['name'],
            'price' => $data['price'],
            'product_category_id' => $data['product_category_id'],
            'image' => $imagePath // Menyimpan path gambar ke dalam database
        ]);
    
        return response()->json(['message' => 'Product added successfully']);
    }
    
    public function update(Request $request, $id)
    {
        $product = Product::find($id);
        if (!$product) {
            return response()->json(['error' => 'Product not found'], 404);
        }

        $data = $request->validate([
            'name' => 'required',
            'price' => 'required',
            'product_category_id' => 'required|exists:product_categories,id',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048' // Menambahkan validasi gambar opsional
        ]);

        $product->name = $data['name'];
        $product->price = $data['price'];
        $product->product_category_id = $data['product_category_id'];

        if ($request->hasFile('image')) {
            // Mengunggah gambar baru dan menghapus yang lama
            $imagePath = $request->file('image')->store('product_images', 'public');
            Storage::disk('public')->delete($product->image);
            $product->image = $imagePath;
        }

        $product->save();

        return response()->json(['message' => 'Product updated successfully']);
    }

    public function delete($id)
    {
        $product = Product::find($id);
        if (!$product) {
            return response()->json(['error' => 'Product not found'], 404);
        }
        // Menghapus gambar yang terkait dengan produk
        Storage::disk('public')->delete($product->image);
        $product->delete();

        return response()->json(['message' => 'Product deleted successfully']);
    }
}
