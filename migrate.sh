#!/bin/bash

# Цвета для вывода
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${GREEN}Начинаем процесс миграции базы данных...${NC}"

# Проверяем наличие файла .env
if [ ! -f .production.env ]; then
    echo -e "${RED}Ошибка: Файл .production.env не найден${NC}"
    exit 1
fi

# Загружаем переменные окружения
source .production.env

# Проверяем подключение к базе данных
echo -e "${GREEN}Проверяем подключение к базе данных...${NC}"
if ! psql -h $DB_HOST -U $DB_USER -d $DB_NAME -c '\q' 2>/dev/null; then
    echo -e "${RED}Ошибка: Не удалось подключиться к базе данных${NC}"
    exit 1
fi

# Восстанавливаем бэкап, если он есть
if [ -f "geoserver_backup.sql" ]; then
    echo -e "${GREEN}Восстанавливаем бэкап базы данных...${NC}"
    psql -h $DB_HOST -U $DB_USER -d $DB_NAME -f geoserver_backup.sql
    if [ $? -ne 0 ]; then
        echo -e "${RED}Ошибка при восстановлении бэкапа${NC}"
        exit 1
    fi
fi

# Запускаем миграции
echo -e "${GREEN}Запускаем миграции...${NC}"
npm run migration:run

if [ $? -ne 0 ]; then
    echo -e "${RED}Ошибка при выполнении миграций${NC}"
    exit 1
fi

echo -e "${GREEN}Миграция успешно завершена!${NC}" 