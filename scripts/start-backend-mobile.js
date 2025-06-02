#!/usr/bin/env node

const { execSync } = require('child_process');
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

function main() {
  const localIP = getLocalIP();
  
  console.log('🔧 Backend Mobile Development Setup');
  console.log('=====================================');
  console.log(`📱 Local IP: ${localIP}`);
  console.log(`🔌 Backend will run on: http://${localIP}:5002`);
  console.log(`📡 WebSocket will run on: ws://${localIP}:5002/ws`);
  console.log('=====================================');
  console.log('📋 CORS будет настроен для:');
  console.log(`   - http://localhost:3000 (локальная разработка)`);
  console.log(`   - http://${localIP}:3000 (мобильный доступ)`);
  console.log('=====================================');
  
  // Переходим в папку backend
  const backendPath = path.join(__dirname, '..', '..', 'helpdesk-backend');
  
  try {
    process.chdir(backendPath);
    console.log(`📁 Changed to backend directory: ${backendPath}`);
  } catch (error) {
    console.error(`❌ Cannot change to backend directory: ${backendPath}`);
    console.log('📝 Make sure you have the backend in the correct location');
    console.log('   Expected structure:');
    console.log('   helpdesk/');
    console.log('   ├── helpdesk-admin/     (frontend)');
    console.log('   └── helpdesk-backend/   (backend)');
    process.exit(1);
  }
  
  console.log('🚀 Starting backend server with mobile CORS settings...');
  console.log('');
  
  // Запускаем backend с настройками CORS для мобильной разработки
  try {
    execSync('npm start', {
      stdio: 'inherit',
      env: {
        ...process.env,
        PORT: '5002',
        CORS_ORIGIN: `http://localhost:3000,http://${localIP}:3000`,
        HOST: '0.0.0.0'
      }
    });
  } catch (error) {
    console.error('❌ Error starting backend server:', error.message);
    console.log('');
    console.log('📝 Make sure you have:');
    console.log('   1. Node.js installed');
    console.log('   2. npm dependencies installed (run: npm install)');
    console.log('   3. Backend properly configured');
    process.exit(1);
  }
}

main();