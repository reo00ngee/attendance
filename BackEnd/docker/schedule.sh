#!/bin/sh

# Laravel スケジューラーを1分ごとに実行
while [ true ]; do
    php /var/www/html/artisan schedule:run --verbose --no-interaction
    sleep 60
done

