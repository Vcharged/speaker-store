#!/bin/bash

# 🔧 Исправление JWT ошибки 405 и обновление дизайна
# Запустить на сервере

echo "🎵 Исправление Music Store..."

# Переход в папку проекта
cd /var/speaker-store

# Скачать последние изменения
echo "📥 Загрузка изменений с GitHub..."
git pull origin main

# Перезапустить контейнеры с исправлениями
echo "🔄 Перезапуск контейнеров..."
docker-compose down
docker-compose up --build -d

# Ожидание запуска
echo "⏱️ Ожидание запуска сервисов..."
sleep 45

# Проверка статуса
echo "📊 Проверка статуса..."
docker-compose ps

# Проверка API
echo "🔍 Проверка API..."
curl -f http://localhost:3000/api/products || echo "❌ API не отвечает"

# Проверка сайта
echo "🌐 Проверка сайта..."
curl -f http://localhost || echo "❌ Сайт не отвечает"

# Проверка auth endpoints
echo "🔐 Проверка авторизации..."
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"123456","firstName":"Test","lastName":"User","birthDate":"2000-01-01","phone":"1234567890"}' \
  || echo "❌ Регистрация не работает"

echo ""
echo "✅ Обновление завершено!"
echo ""
echo "🔧 Исправления:"
echo "  - JWT_SECRET исправлен в стратегиях"
echo "  - CORS настроен правильно"
echo "  - Новый дизайн применен"
echo ""
echo "🌐 Доступные URL:"
echo "  - Сайт: http://167.172.169.150"
echo "  - API: http://167.172.169.150/api"
echo "  - API Docs: http://167.172.169.150/api/docs"
echo ""
echo "🔧 Если есть проблемы:"
echo "  - Логи: docker-compose logs -f"
echo "  - Перезапуск: docker-compose restart"
echo ""
echo "🎵 Music Store исправлен!"
