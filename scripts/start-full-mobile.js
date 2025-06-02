#!/usr/bin/env node

const { spawn } = require('child_process');
const os = require('os');
const path = require('path');

function getLocalIP() {
  const interfaces = os.networkInterfaces();
  
  // Порядок приоритета сетевых интерфейсов
  const priorityOrder = ['Wi-Fi', 'Ethernet', 'en0', 'eth0', 'wlan0'];
  
  let fallbackIP = null;
  
  // Сначала проверяем приоритетные интерфейсы
  for (const interfaceName of priorityOrder) {
    if (interfaces[interfaceName]) {
      for (const details of interfaces[interfaceName]) {
        if (details.family === 'IPv4' && !details.internal) {
          return details.address;
        }
      }
    }
  }
  
  // Если не найдено в приоритетных, ищем в остальных
  for (const interfaceName in interfaces) {
    if (priorityOrder.includes(interfaceName)) continue;
    
    for (const details of interfaces[interfaceName]) {
      if (details.family === 'IPv4' && !details.internal) {
        if (!fallbackIP) {
          fallbackIP = details.address;
        }
      }
    }
  }
  
  return fallbackIP || 'localhost';
}

function generateQRCode(url) {
  // Простой ASCII QR код для URL
  console.log('📱 QR Code для быстрого доступа с телефона:');
  console.log('');
  console.log('   ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄');
  console.log('   █                             █');
  console.log('   █  Отсканируйте этот QR код   █');
  console.log('   █  или откройте URL:          █');
  console.log(`   █  ${url.padEnd(25)} █`);
  console.log('   █                             █');
  console.log('   ▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀');
  console.log('');
  console.log(`   Или введите в браузере: ${url}`);
}

function main() {
  const localIP = getLocalIP();
  const frontendUrl = `http://${localIP}:3000`;
  const backendUrl = `http://${localIP}:5002`;
  
  console.log('🚀 Mobile Development Full Stack Startup');
  console.log('==========================================');
  console.log(`📱 Local IP: ${localIP}`);
  console.log(`🌐 Frontend: ${frontendUrl}`);
  console.log(`🔌 Backend API: ${backendUrl}/api`);
  console.log(`📡 WebSocket: ws://${localIP}:5002/ws`);
  console.log('==========================================');
  
  generateQRCode(frontendUrl);
  
  console.log('📋 Инструкции для тестирования:');
  console.log('1. Убедитесь что ваш телефон в той же Wi-Fi сети');
  console.log('2. Откройте камеру и отсканируйте QR код выше');
  console.log('3. Или введите URL вручную в браузере телефона');
  console.log('4. Для отладки откройте DevTools в браузере телефона');
  console.log('==========================================');
  
  // Проверяем наличие backend директории
  const backendPath = path.join(__dirname, '..', '..', 'helpdesk-backend');
  const fs = require('fs');
  
  if (!fs.existsSync(backendPath)) {
    console.log('⚠️  Backend directory not found at:', backendPath);
    console.log('   Запуск только frontend...');
    console.log('   Не забудьте запустить backend отдельно!');
    console.log('==========================================');
    
    // Запускаем только frontend
    startFrontend(localIP);
    return;
  }
  
  console.log('🎯 Запуск полного стека (backend + frontend)...');
  console.log('');
  
  // Запускаем backend
  console.log('🔧 Starting backend...');
  const backendProcess = spawn('node', ['scripts/start-backend-mobile.js'], {
    stdio: 'inherit',
    cwd: __dirname + '/..'
  });
  
  // Ждем немного и запускаем frontend
  setTimeout(() => {
    console.log('🔧 Starting frontend...');
    startFrontend(localIP);
  }, 3000);
  
  // Обработка завершения процессов
  process.on('SIGINT', () => {
    console.log('\n🛑 Stopping all services...');
    backendProcess.kill();
    process.exit(0);
  });
}

function startFrontend(localIP) {
  const frontendProcess = spawn('node', ['scripts/start-mobile.js'], {
    stdio: 'inherit',
    cwd: __dirname + '/..'
  });
  
  frontendProcess.on('error', (error) => {
    console.error('❌ Error starting frontend:', error.message);
  });
}

main();