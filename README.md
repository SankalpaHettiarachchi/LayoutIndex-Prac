# LayoutIndex Practical Test (Laravel 12 Application)

A Laravel 12-based application with real-time notifications and queue handling. This guide will help you set up the project on your local machine.

## 🧰 Requirements

Make sure your environment meets the following requirements before you begin:

- PHP >= 8.2
- Composer
- Node.js & npm
- Laravel 12
- Database - MySQL

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
   npm run build
   ```

5. **Copy environment file and generate app key**

   ```bash
   cp .env.example .env
   php artisan key:generate
   ```

6. **Run migrations (creates `layoutindex_prac` database)**

   ```bash
   php artisan migrate
   ```

7. **Seed the database**

   ```bash
   php artisan db:seed
   ```
   This seeds 5 users, 100 concessions, and 100 pending orders. Load tested with 100,000 concessions and 10,000 orders.

8. **Link storage for default images**

   ```bash
   php artisan storage:link
   ```

---

## ▶️ Runtime Commands

9. **Serve the application**

   ```bash
   php artisan serve
   ```

10. **Start Reverb for real-time notifications**

   ```bash
   php artisan reverb:start
   ```

11. **Start the queue worker for auto order sending**

   ```bash
   php artisan queue:work
   ```

---

## 🎉 Congratulations

You can now log in using any of the auto-generated users:

| Email                | Password  |
|---------------------|-----------|
| staff1@gmail.com     | sa123456  |
| staff2@gmail.com     | sa123456  |
| staff3@gmail.com     | sa123456  |
| staff4@gmail.com     | sa123456  |
| staff5@gmail.com     | sa123456  |


---

## 📦 Note

- For real-time features, please ensure Laravel Reverb and queue servers are running correctly.

---

## 📬 Support

For questions or issues, please contact me at [sankalpa.isurukala17@gmail.com](mailto:sankalpa.isurukala17@gmail.com).

