<?php

namespace App\Http\Middleware;

use Illuminate\Auth\Middleware\Authenticate as Middleware;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Closure;

class Authenticate extends Middleware
{
    /**
     * Handle an incoming request.
     */
    public function handle($request, Closure $next, ...$guards)
    {
        if ($request->expectsJson() || $request->is('api/*')) {
            try {
                $this->authenticate($request, $guards);
            } catch (\Illuminate\Auth\AuthenticationException $e) {
                return response()->json(['message' => 'Unauthenticated.'], 401);
            }
            
            return $next($request);
        }
        
        return parent::handle($request, $next, ...$guards);
    }

    /**
     * Get the path the user should be redirected to when they are not authenticated.
     */
    protected function redirectTo(Request $request): ?string
    {
        if ($request->expectsJson()) {
            return null;
        }
        
        // API routes should not redirect to login
        if ($request->is('api/*')) {
            return null;
        }
        
        // For web routes, return login route if it exists
        if (Route::has('login')) {
            return route('login');
        }
        
        return null;
    }
}
