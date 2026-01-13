<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Mailgun, Postmark, AWS and more. This file provides the de facto
    | location for this type of information, allowing packages to have
    | a conventional file to locate the various service credentials.
    |
    */

    'postmark' => [
        'key' => env('POSTMARK_API_KEY'),
    ],

    'resend' => [
        'key' => env('RESEND_API_KEY'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    'slack' => [
        'notifications' => [
            'bot_user_oauth_token' => env('SLACK_BOT_USER_OAUTH_TOKEN'),
            'channel' => env('SLACK_BOT_USER_DEFAULT_CHANNEL'),
        ],
    ],

    'gemini' => [
        'key' => env('GEMINI_API_KEY'),
        'keys' => array_values(array_filter(array_map('trim', explode(',', env('GEMINI_API_KEYS', env('GEMINI_API_KEY', '')))))),
        'model' => env('GEMINI_MODEL', 'gemini-1.5-flash'),
        'safety' => [],
        'timeout' => (int) env('GEMINI_TIMEOUT', 30), // Reduced from 60 to 30 seconds
        'max_retries' => (int) env('GEMINI_MAX_RETRIES', 2),
        'retry_delay' => (int) env('GEMINI_RETRY_DELAY', 1000), // 1 second
    ],

    'ocr' => [
        'pdf_command' => env('OCR_PDF_COMMAND'),
        'image_command' => env('OCR_IMAGE_COMMAND'),
        'pdf_to_image_command' => env('OCR_PDF_TO_IMAGE_COMMAND'),
        
        // Konfigurasi Tesseract
        'tesseract_path' => env('TESSERACT_PATH', 'tesseract'),
        'tesseract_lang' => env('TESSERACT_LANG', 'ind+eng'),
        'tesseract_oem' => env('TESSERACT_OEM', '3'), // 0=Legacy, 1=LSTM, 2=Legacy+LSTM, 3=Default
        'tesseract_psm' => env('TESSERACT_PSM', '3'), // Page segmentation mode
        
        // Preprocessing options
        'preprocessing' => [
            'enabled' => env('OCR_PREPROCESSING_ENABLED', true),
            'min_width' => env('OCR_MIN_WIDTH', 1000),
            'target_width' => env('OCR_TARGET_WIDTH', 1500),
            'enhanced_target_width' => env('OCR_ENHANCED_TARGET_WIDTH', 2000),
        ],
    ],

];
