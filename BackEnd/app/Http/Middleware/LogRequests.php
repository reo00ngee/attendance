<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;

class LogRequests
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // リクエストの詳細をログ
        Log::info('API Request', [
            'method' => $request->getMethod(),
            'url' => $request->fullUrl(),
            'ip' => $request->ip(),
            'user_agent' => $request->userAgent(),
            'headers' => $request->headers->all(),
            'parameters' => $request->all(),
        ]);

        $response = $next($request);

        // レスポンスの詳細をログ
        $responseData = [
            'status_code' => $response->getStatusCode(),
            'headers' => $response->headers->all(),
        ];

        // レスポンス内容も記録（大きすぎる場合は制限）
        $content = $response->getContent();
        if (strlen($content) < 10000) { // 10KB未満の場合のみ
            $responseData['content'] = $content;
        } else {
            $responseData['content'] = 'Response too large to log';
        }

        Log::info('API Response', $responseData);

        // エラーレスポンスの場合は追加でERRORレベルでログ
        if ($response->getStatusCode() >= 400) {
            Log::error('API Error Response', [
                'status_code' => $response->getStatusCode(),
                'url' => $request->fullUrl(),
                'method' => $request->getMethod(),
                'content' => $content,
            ]);
        }

        return $response;
    }
}