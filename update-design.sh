#!/bin/bash

# 🎨 Обновление дизайна и исправление 405 ошибки
# Запустить на сервере

echo "🎵 Обновление Music Store..."

# Переход в папку проекта
cd /var/speaker-store

# Перезапустить контейнеры с новыми изменениями
echo "🔄 Перезапуск контейнеров..."
docker-compose down
docker-compose up --build -d

# Ожидание запуска
echo "⏱️ Ожидание запуска сервисов..."
sleep 30

# Проверка статуса
echo "📊 Проверка статуса..."
docker-compose ps

# Проверка API
echo "🔍 Проверка API..."
curl -f http://localhost:3000/api/products || echo "❌ API не отвечает"

# Проверка сайта
echo "🌐 Проверка сайта..."
curl -f http://localhost || echo "❌ Сайт не отвечает"

echo ""
echo "✅ Обновление завершено!"
echo ""
echo "🎨 Новые функции:"
echo "  - Современный молодежный дизайн"
echo "  - Адаптивность под мобильные устройства"
echo "  - Footer прикреплен к низу страницы"
echo "  - Новая цветовая схема (градиенты)"
echo "  - Анимации и hover эффекты"
echo "  - Исправлена ошибка 405 в авторизации"
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
echo "🎵 Music Store обновлен!"
