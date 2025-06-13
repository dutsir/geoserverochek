#!/bin/bash

# Цвета для вывода
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${GREEN}Начинаем создание бэкапа базы данных...${NC}"

# Проверяем наличие файла .env
if [ ! -f .production.env ]; then
    echo -e "${RED}Ошибка: Файл .production.env не найден${NC}"
    exit 1
fi

# Загружаем переменные окружения
source .production.env

# Создаем имя файла с текущей датой
BACKUP_FILE="geoserver_backup_$(date +%Y%m%d_%H%M%S).sql"

# Создаем бэкап
echo -e "${GREEN}Создаем бэкап базы данных...${NC}"
pg_dump -h $DB_HOST -U $DB_USER -d $DB_NAME > $BACKUP_FILE

if [ $? -ne 0 ]; then
    echo -e "${RED}Ошибка при создании бэкапа${NC}"
    exit 1
fi

echo -e "${GREEN}Бэкап успешно создан: $BACKUP_FILE${NC}" 