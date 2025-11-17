# Introduction

## Essential Configuration

### Setting of Timezone

Set time zone with this process:

```php
// config/app.php

'timezone' => 'Asia/Tokyo',
```

### Setting of Configuration Files for Login Function

#### .env

```php
# 修正前
SANCTUM_STATEFUL_DOMAINS=localhost

# 修正後
SANCTUM_STATEFUL_DOMAINS=localhost:3000,localhost
SESSION_DOMAIN=localhost  # 追加
```

### Queue Configuration

The password reset functionality uses Laravel queues for email sending to improve system responsiveness.

#### Queue Connection Setting

In `.env`:

```php
QUEUE_CONNECTION=database
```

Make sure the queue tables are migrated:

```bash
cd BackEnd
./vendor/bin/sail artisan migrate
```

#### Starting Queue Workers

**Development Environment (Laravel Sail):**

```bash
cd BackEnd
./vendor/bin/sail artisan queue:work
```

For background processing:

```bash
./vendor/bin/sail artisan queue:work --daemon
```

**Production Environment:**

Use Supervisor to manage queue workers persistently. Create `/etc/supervisor/conf.d/laravel-worker.conf`:

```ini
[program:laravel-worker]
process_name=%(program_name)s_%(process_num)02d
command=php /path/to/attendance/BackEnd/artisan queue:work --sleep=3 --tries=3 --max-time=3600
autostart=true
autorestart=true
stopasgroup=true
killasgroup=true
user=www-data
numprocs=8
redirect_stderr=true
stdout_logfile=/path/to/attendance/BackEnd/storage/logs/worker.log
stopwaitsecs=3600
```

Then reload Supervisor:

```bash
sudo supervisorctl reread
sudo supervisorctl update
sudo supervisorctl start laravel-worker:*
```

#### Queue Monitoring

```bash
# Check queue status
./vendor/bin/sail artisan queue:monitor

# Check failed jobs
./vendor/bin/sail artisan queue:failed

# Retry all failed jobs
./vendor/bin/sail artisan queue:retry all
```

---

## Payroll Batch (payroll:process) - How to Set Up

This section explains how the monthly payroll batch (`payroll:process`) is configured and how to run it in **development** and **production** environments.

The batch itself is implemented as a Laravel Artisan command:

- Command name: `payroll:process`
- Command class: `App\Console\Commands\ProcessMonthlyPayroll`
- Scheduled in: `App\Console\Kernel::schedule()`

```php
// App\Console\Kernel
protected function schedule(Schedule $schedule): void
{
    $schedule->command('payroll:process')
        ->timezone('Asia/Tokyo')
        ->dailyAt('01:00');
}
```

This means:

- The command will run **every day at 01:00 (Asia/Tokyo)** when the Laravel scheduler is active.

---

### 1. Development Environment (Laravel Sail + Docker)

In development we use **Laravel Sail** (Docker) and run the scheduler inside the container.

#### 1.1. Scheduler Setup in Docker

The scheduler is wired via:

- `docker/supervisord.conf`  
  Defines a `laravel-schedule` program that runs:

```bash
while true; do
  php /var/www/html/artisan schedule:run --verbose --no-interaction
  sleep 60
done
```

- `docker-compose.yml`  
  Mounts `docker/supervisord.conf` into the container so that `supervisord` starts both:
  - the PHP built‑in server (`artisan serve`)
  - the scheduler loop (`schedule:run` every minute)

You don't need to manually run `schedule:run` in dev as long as the Sail containers are up.

#### 1.2. Start Containers (with Scheduler)

From the `BackEnd` directory:

```bash
cd BackEnd
./vendor/bin/sail up -d
```

This:

- Starts the Laravel app container
- Starts `supervisord` inside the container
- Runs `schedule:run` every minute
- Therefore, `payroll:process` runs automatically at 01:00 (Asia/Tokyo)

#### 1.3. Run Payroll Batch Manually (Dev)

If you want to run the payroll batch immediately (for testing):

```bash
cd BackEnd
./vendor/bin/sail artisan payroll:process
```

This triggers the same command that the scheduler would run, but **on demand**.

---

### 2. Production Environment

In production you usually do **not** run Sail / `supervisord`.  
Instead, use the OS cron to trigger Laravel's scheduler.

#### 2.1. Configure Cron

On the production server:

1. SSH into the server  
2. Edit the cron table:

```bash
crontab -e
```

3. Add the following line (adjust the path to your `BackEnd` directory):

```cron
* * * * * php /path/to/attendance/BackEnd/artisan schedule:run >> /dev/null 2>&1
```

Notes:

- `schedule:run` is executed every minute
- Inside `App\Console\Kernel::schedule()`, Laravel decides **which commands should run at that specific time**
- Because `payroll:process` is scheduled with `dailyAt('01:00')` and `timezone('Asia/Tokyo')`, it will run once per day at 01:00 JST when `schedule:run` is called.

#### 2.2. Run Payroll Batch Manually (Prod)

If you need to execute the payroll batch immediately (outside of the normal schedule), run:

```bash
cd /path/to/attendance/BackEnd
php artisan payroll:process
```

This is useful when:

- You just deployed new payroll logic and want to test it
- You need to re‑run the batch for a specific day (with appropriate safeguards)

---

### 3. Summary

- **Dev**
  - Start containers: `./vendor/bin/sail up -d`
  - Scheduler runs automatically inside Docker (via `supervisord`)
  - On‑demand batch: `./vendor/bin/sail artisan payroll:process`

- **Prod**
  - Cron runs: `php /path/to/attendance/BackEnd/artisan schedule:run` every minute
  - `payroll:process` is triggered by Laravel at 01:00 (Asia/Tokyo)
  - On‑demand batch: `php artisan payroll:process` from the `BackEnd` directory

Make sure both environments share the same `App\Console\Kernel` configuration so that scheduling behavior is consistent.

---

### Email Configuration for Payslip Delivery

Make sure your email configuration is properly set in `.env`:

```php
MAIL_MAILER=smtp
MAIL_HOST=your-smtp-host
MAIL_PORT=587
MAIL_USERNAME=your-email@example.com
MAIL_PASSWORD=your-password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=noreply@example.com
MAIL_FROM_NAME="${APP_NAME}"
```

For development with Laravel Sail, you can use Mailpit for testing:

```php
MAIL_MAILER=smtp
MAIL_HOST=mailpit
MAIL_PORT=1025
```

Mailpit interface is available at: `http://localhost:8025`

