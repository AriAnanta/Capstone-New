<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>{{ config('app.name', 'PTA Digital') }}</title>
        <meta name="csrf-token" content="{{ csrf_token() }}">
        @viteReactRefresh
        @vite(['resources/css/app.css', 'resources/js/app.jsx'])
    </head>
    <body class="antialiased bg-slate-50 text-slate-900">
        <div id="app"></div>
    </body>
</html>
