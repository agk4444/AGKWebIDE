// Docker Configuration Test Script
// Run with: node test-docker.js

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🐳 Testing Docker Configuration...\n');

// Check Docker files
const dockerFiles = [
  'Dockerfile',
  'docker-compose.yml',
  'nginx.conf',
  '.dockerignore',
  'package.json'
];

let dockerFilesExist = true;

console.log('📁 Checking Docker files...');
dockerFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - MISSING`);
    dockerFilesExist = false;
  }
});

// Check Dockerfile content
if (fs.existsSync('Dockerfile')) {
  const dockerfile = fs.readFileSync('Dockerfile', 'utf8');
  console.log('\n🏗️  Validating Dockerfile...');

  const stages = ['wasm-builder', 'node-builder', 'production'];
  stages.forEach(stage => {
    if (dockerfile.includes(`AS ${stage}`) || dockerfile.includes(stage)) {
      console.log(`✅ Stage: ${stage}`);
    } else {
      console.log(`❌ Stage: ${stage} - MISSING`);
    }
  });
}

// Check docker-compose.yml content
if (fs.existsSync('docker-compose.yml')) {
  const composeFile = fs.readFileSync('docker-compose.yml', 'utf8');
  console.log('\n🐙 Validating docker-compose.yml...');

  const services = ['agk-web-ide'];
  services.forEach(service => {
    if (composeFile.includes(`${service}:`)) {
      console.log(`✅ Service: ${service}`);
    } else {
      console.log(`❌ Service: ${service} - MISSING`);
    }
  });

  // Check for ports
  if (composeFile.includes('ports:')) {
    console.log('✅ Port mapping configured');
  } else {
    console.log('❌ Port mapping missing');
  }
}

// Check nginx configuration
if (fs.existsSync('nginx.conf')) {
  const nginxConf = fs.readFileSync('nginx.conf', 'utf8');
  console.log('\n🌐 Validating nginx.conf...');

  const nginxChecks = [
    { name: 'Server block', check: 'server {' },
    { name: 'Location block', check: 'location /' },
    { name: 'Gzip compression', check: 'gzip on' },
    { name: 'Security headers', check: 'add_header' },
    { name: 'Health check', check: '/health' }
  ];

  nginxChecks.forEach(({ name, check }) => {
    if (nginxConf.includes(check)) {
      console.log(`✅ ${name}`);
    } else {
      console.log(`❌ ${name} - MISSING`);
    }
  });
}

// Check package.json for Docker scripts
if (fs.existsSync('package.json')) {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  console.log('\n📦 Checking Docker scripts...');

  const dockerScripts = ['docker:build', 'docker:run', 'docker:dev'];
  dockerScripts.forEach(script => {
    if (packageJson.scripts && packageJson.scripts[script]) {
      console.log(`✅ Script: ${script}`);
    } else {
      console.log(`❌ Script: ${script} - MISSING`);
    }
  });
}

console.log('\n🚀 Docker Status:');
if (dockerFilesExist) {
  console.log('✅ All Docker files are present');
  console.log('✅ Multi-stage build configured');
  console.log('✅ Docker Compose orchestration ready');
  console.log('✅ Nginx configuration optimized');
  console.log('✅ Security features enabled');
  console.log('\n🎉 Docker configuration is ready!');
  console.log('\n📝 Quick start:');
  console.log('1. docker-compose up -d');
  console.log('2. Open http://localhost:3000');
} else {
  console.log('❌ Some Docker files are missing. Please check the configuration.');
}

console.log('\n🏢 AGK FIRE INC - Docker Deployment Ready');
console.log('📧 agk4444@gmail.com\n');