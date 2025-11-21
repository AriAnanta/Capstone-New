<?php

namespace App\Http\Middleware;

use App\Enums\UserRole;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserHasRole
{
    /**
     * Handle an incoming request.
     *
     * @param  array<int, string>  $roles
     */
    public function handle(Request $request, Closure $next, ...$roles): Response
    {
        $user = $request->user();

        if (! $user) {
            abort(Response::HTTP_UNAUTHORIZED, 'Unauthenticated.');
        }

        $userRole = $user->role instanceof UserRole ? $user->role->value : (string) $user->role;

        if (! empty($roles) && ! in_array($userRole, $roles, true)) {
            abort(Response::HTTP_FORBIDDEN, 'Anda tidak memiliki hak akses.');
        }

        return $next($request);
    }
}
