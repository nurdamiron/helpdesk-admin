#!/usr/bin/env node

const os = require('os');

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
          console.log(`Found IP ${details.address} on interface ${interfaceName}`);
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
  
  if (fallbackIP) {
    console.log(`Found fallback IP ${fallbackIP}`);
    return fallbackIP;
  }
  
  console.log('No suitable network interface found, using localhost');
  return 'localhost';
}

const ip = getLocalIP();
console.log(ip);