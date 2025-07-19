<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Closure;

use App\Enums\Role;

class CheckRole
{
public function handle(Request $request, Closure $next, ...$roles)
{
    $user = $request->user();

    $allowedRoles = collect($roles)->map(fn($r) => (int)$r);

    // ユーザーが1つでも該当ロールを持っていればOK
    if (!$user || !$user->role_ids->intersect($allowedRoles)->count()) {
        return response()->json(['error' => 'Unauthorized'], 403);
    }

    return $next($request);
}
}
