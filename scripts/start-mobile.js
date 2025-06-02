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
  
  console.log('🔧 Mobile Development Setup');
  console.log('=====================================');
  console.log(`📱 Local IP: ${localIP}`);
  console.log(`🌐 Frontend URL: http://${localIP}:3000`);
  console.log(`🔌 Backend API: http://${localIP}:5002/api`);
  console.log(`📡 WebSocket: ws://${localIP}:5002/ws`);
  console.log('=====================================');
  console.log('📋 QR Code for mobile access:');
  console.log(`   Open this URL on your phone: http://${localIP}:3000`);
  console.log('=====================================');
  
  // Создаем .env.mobile с текущим IP
  const envContent = `# Mobile testing environment settings (auto-generated)
REACT_APP_API_URL=http://${localIP}:5002/api
REACT_APP_WS_URL=ws://${localIP}:5002/ws
REACT_APP_ENV=development
SKIP_PREFLIGHT_CHECK=true
DISABLE_ESLINT_PLUGIN=true
GENERATE_SOURCEMAP=true
HOST=0.0.0.0
PORT=3000`;

  const fs = require('fs');
  const envPath = path.join(__dirname, '..', '.env.mobile');
  fs.writeFileSync(envPath, envContent);
  
  console.log(`✅ Updated .env.mobile with IP ${localIP}`);
  console.log('🚀 Starting development server...');
  console.log('');
  
  // Запускаем dev server с настройками для мобильной разработки
  try {
    execSync('npm run start:mobile:generated', {
      stdio: 'inherit',
      env: {
        ...process.env,
        REACT_APP_API_URL: `http://${localIP}:5002/api`,
        REACT_APP_WS_URL: `ws://${localIP}:5002/ws`,
        HOST: '0.0.0.0',
        PORT: '3000',
        REACT_APP_ENV: 'development'
      }
    });
  } catch (error) {
    console.error('❌ Error starting development server:', error.message);
    process.exit(1);
  }
}

main();