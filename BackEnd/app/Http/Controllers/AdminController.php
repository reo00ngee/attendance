<?php

namespace App\Http\Controllers;

use App\Models\Administrator;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class AdminController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $administrators = Administrator::all();
        return response()->json($administrators);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:30',
            'email' => 'required|string|email|max:255|unique:administrators',
            'password' => 'required|string|min:8|confirmed',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors()
            ], 422);
        }

        $administrator = Administrator::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'created_by' => auth('admin')->id(),
            'updated_by' => auth('admin')->id(),
        ]);

        return response()->json($administrator, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $administrator = Administrator::findOrFail($id);
        return response()->json($administrator);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $administrator = Administrator::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:30',
            'email' => [
                'required',
                'string',
                'email',
                'max:255',
                Rule::unique('administrators')->ignore($administrator->id)
            ],
            'password' => 'nullable|string|min:8|confirmed',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors()
            ], 422);
        }

        $data = [
            'name' => $request->name,
            'email' => $request->email,
            'updated_by' => auth('admin')->id(),
        ];

        if ($request->filled('password')) {
            $data['password'] = Hash::make($request->password);
        }

        $administrator->update($data);

        return response()->json($administrator);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $administrator = Administrator::findOrFail($id);
        $administrator->delete();

        return response()->json(['message' => 'Administrator deleted successfully']);
    }

    /**
     * Get current authenticated admin
     */
    public function me()
    {
        $admin = auth('admin')->user();
        return response()->json($admin);
    }
}






