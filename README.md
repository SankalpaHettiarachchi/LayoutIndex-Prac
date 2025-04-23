# LayoutIndex Practical Test(Laravel 12 Application)

A Laravel 12-based application with real-time notifications and queue handling. This guide will help you set up the project on your local machine.

## 🧰 Requirements

Make sure your environment meets the following requirements before you begin:

- PHP >= 8.2
- Composer
- Node.js & npm
- Laravel 12
- Database - MySQL&#x20;

---

## 🚀 Installation Steps

1. **Clone the repository**

   ```bash
   git clone https://github.com/SankalpaHettiarachchi/LayoutIndex-Prac.git
   ```

2. **Navigate to the project directory**

   ```bash
   cd LayoutIndex-Prac
   ```

3. **Install PHP dependencies**

   ```bash
   composer install
   composer update
   composer dump-autoload
   ```

4. **Install frontend dependencies**

   ```bash
   npm install
   npm update
   ```

5. **Compile assets**

   ```bash
   npm run build
   ```

6. **Run migrations**

   ```bash
   php artisan migrate
   ```

7. **Seed the database**

   ```bash
   php artisan db:seed
   ```

8. **Serve the application**

   ```bash
   php artisan serve
   ```

9. **Start Reverb for real-time features**

   ```bash
   php artisan reverb:start
   ```

10. **Start the queue worker for order processing**

    ```bash
    php artisan queue:work
    ```

---

## 🔐 Default Login Users

Use any of the following credentials to log in as a staff user:

| Email                                        | Password |
| -------------------------------------------- | -------- |
| [staff1@gmail.com](mailto\:staff1@gmail.com) | sa123456 |
| [staff2@gmail.com](mailto\:staff2@gmail.com) | sa123456 |
| [staff3@gmail.com](mailto\:staff3@gmail.com) | sa123456 |
| [staff4@gmail.com](mailto\:staff4@gmail.com) | sa123456 |
| [staff5@gmail.com](mailto\:staff5@gmail.com) | sa123456 |

---

## 🧪 Running Tests

Make sure `sqlite3` is enabled in your `php.ini`.

```bash
php artisan test
```

---

## 📦 Note

- For real-time features, please ensure laravel reverb and queue servers are running correclty

---

## 📬 Support

For questions or issues, please contact the me sankalpa.isurukala17\@gmail.com.

