<?php

return [
    'default' => env('DB_CONNECTION', 'pgsql'),
    
    'connections' => [
        'pgsql' => [
            'driver' => 'pgsql',
            'url' => env('DB_URL'),
            'host' => env('DB_HOST', 'postgres'),
            'port' => env('DB_PORT', '5432'),
            'database' => env('DB_DATABASE', 'blockchain'),
            'username' => env('DB_USERNAME', 'blockchain_user'),
            'password' => env('DB_PASSWORD', 'blockchain_pass'),
            'charset' => env('DB_CHARSET', 'utf8'),
            'prefix' => '',
            'prefix_indexes' => true,
            'search_path' => 'public',
            'sslmode' => 'prefer',
        ],
    ],
    
    'migrations' => [
        'table' => 'migrations',
        'update_date_on_publish' => true,
    ],
];
