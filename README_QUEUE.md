# Queue Worker Usage Guide (Laravel Sail)

## Overview
The password reset functionality's email sending process has been implemented using queues. This eliminates the need for users to wait for email sending completion, improving system responsiveness.

## Configuration Changes
- `QUEUE_CONNECTION=database` has been changed
- Queue table (`jobs`) migration completed
- Failed jobs table (`failed_jobs`) also available

## Starting Queue Workers (Laravel Sail)

### Development Environment Startup
```bash
# Start queue worker using Sail
./vendor/bin/sail artisan queue:work

# Start in background (recommended)
./vendor/bin/sail artisan queue:work --daemon

# Process specific queue
./vendor/bin/sail artisan queue:work --queue=default

# Retry failed jobs
./vendor/bin/sail artisan queue:retry all
```

### Production Environment Startup
```bash
# Persistent startup using Supervisor (recommended)
# Add configuration to /etc/supervisor/conf.d/laravel-worker.conf

[program:laravel-worker]
process_name=%(program_name)s_%(process_num)02d
command=php /path/to/your/project/artisan queue:work --sleep=3 --tries=3 --max-time=3600
autostart=true
autorestart=true
stopasgroup=true
killasgroup=true
user=www-data
numprocs=8
redirect_stderr=true
stdout_logfile=/path/to/your/project/storage/logs/worker.log
stopwaitsecs=3600
```

## Queue Monitoring

### Queue Status Check
```bash
# Check queue status
./vendor/bin/sail artisan queue:monitor

# Check failed jobs
./vendor/bin/sail artisan queue:failed

# Retry specific failed job
./vendor/bin/sail artisan queue:retry {id}
```

### Log Monitoring
```bash
# Check queue worker logs
./vendor/bin/sail exec laravel.test tail -f storage/logs/laravel.log | grep "Queue:"

# Or check directly inside container
./vendor/bin/sail exec laravel.test bash
tail -f storage/logs/laravel.log | grep "Queue:"
```

## Implemented Features

### SendPasswordResetEmail Job
- Password reset email sending process
- Timeout: 60 seconds
- Retry attempts: 3 times
- Failure logging

### PasswordResetService Changes
- Changed email sending process to use queues
- Immediate response return
- Improved user experience

## Troubleshooting

### Queue Worker Won't Start
1. Check database connection
2. Verify migrations are completed
3. Check log files for errors

### Emails Not Being Sent
1. Check if queue worker is running
2. Verify jobs are added to queue table
3. Check for failed jobs

### Performance Optimization
- Adjust number of queue workers (`numprocs`)
- Set queue priorities
- Utilize batch processing

## Sail-Specific Notes

### Container Names
- Main application: `laravel.test`
- Database: `mysql`
- Redis: `redis`
- Mail testing: `mailpit`

### Useful Commands
```bash
# Execute commands inside container
./vendor/bin/sail exec laravel.test php artisan queue:work

# Start bash inside container
./vendor/bin/sail exec laravel.test bash

# Check logs
./vendor/bin/sail logs laravel.test
```
