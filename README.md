# GeoServer API

## Описание проекта
GeoServer - это серверная часть приложения для работы с геоданными, построенная на NestJS. Проект предоставляет API для управления маркерами, опросами, файлами и пользователями с системой аутентификации и авторизации.

## Технологии
- **Backend Framework**: NestJS
- **База данных**: PostgreSQL
- **ORM**: Sequelize
- **Аутентификация**: JWT + Passport
- **Хранение файлов**: Яндекс.Облако 
- **Документация API**: Swagger
- **Линтинг**: ESLint + Prettier

## Структура проекта
```
src/
├── auth/           # Аутентификация и авторизация
├── cloudinary/     # Интеграция с Cloudinary
├── config/         # Конфигурации приложения
├── files/          # Работа с файлами
├── filesinput/     # Обработка загрузки файлов
├── markers/        # Управление маркерами
├── pages/          # Страницы приложения
├── roles/          # Управление ролями
├── storage/        # Хранение данных
├── surveys/        # Управление опросами
├── users/          # Управление пользователями
├── visits/         # Отслеживание посещений
├── app.module.ts   # Корневой модуль
└── main.ts         # Точка входа
```

## Установка и запуск

### Предварительные требования
- Node.js (v16+)
- PostgreSQL

- yandex.cloud аккаунт

### Установка зависимостей
```bash
npm install
```

### Настройка окружения
Создайте файл `.env` в корне проекта со следующими переменными:
```env
# База данных
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=your_username
DB_PASSWORD=your_password
DB_DATABASE=your_database

# JWT
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=24h

# Яндекс.Облако
YANDEX_ACCESS_KEY_ID=your_access_key
YANDEX_SECRET_ACCESS_KEY=your_secret_key
YANDEX_REGION=ru-central1
YANDEX_BUCKET_NAME=your_bucket
YANDEX_ENDPOINT=https://storage.yandexcloud.net

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Запуск в режиме разработки
```bash
npm run start:dev
```

### Сборка для продакшена
```bash
npm run build
npm run start:prod
```

## API Документация
После запуска сервера, документация API доступна по адресу:
```
http://localhost:3000/api/docs
```

## Миграции базы данных
```bash
# Создание миграции
npx sequelize-cli migration:generate --name your-migration-name

# Применение миграций
npx sequelize-cli db:migrate

# Откат миграции
npx sequelize-cli db:migrate:undo
```

## Docker
Проект поддерживает Docker. Для сборки и запуска:
```bash
docker build -t geoserver .
docker run -p 3000:3000 geoserver
```

## Лицензия
UNLICENSED
