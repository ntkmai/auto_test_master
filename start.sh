#!/bin/bash

clear
echo "========================================"
echo "  Web Black Box Testing Tool"
echo "========================================"
echo ""
echo "Đang khởi động server..."
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "Chưa cài đặt dependencies. Đang cài đặt..."
    npm install
    echo ""
fi

# Build TypeScript
echo "Đang compile TypeScript..."
npm run build
echo ""

# Start server in background
echo "Khởi động server..."
npm run server &
SERVER_PID=$!

# Wait for server to start
echo "Đợi server khởi động..."
sleep 3

# Open browser
echo "Mở browser..."
if command -v open &> /dev/null; then
    # macOS
    open http://localhost:3000
elif command -v xdg-open &> /dev/null; then
    # Linux
    xdg-open http://localhost:3000
else
    echo "Không thể tự động mở browser. Vui lòng mở thủ công:"
    echo "http://localhost:3000"
fi

echo ""
echo "========================================"
echo "Server đang chạy tại: http://localhost:3000"
echo "Nhấn Ctrl+C để dừng server"
echo "========================================"
echo ""

# Wait for user to stop
wait $SERVER_PID
