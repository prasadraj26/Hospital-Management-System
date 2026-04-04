# Hospital Management System - Production Deployment Guide

## 🚀 Overview

This guide provides comprehensive instructions for deploying the Hospital Management System to production environments. The system is designed to be scalable, secure, and production-ready with enterprise-grade features.

## 📋 Pre-Deployment Checklist

### System Requirements
- **Server**: Ubuntu 20.04+ / CentOS 8+ / Windows Server 2019+
- **RAM**: Minimum 8GB, Recommended 16GB+
- **Storage**: Minimum 100GB SSD
- **CPU**: Minimum 4 cores, Recommended 8 cores+
- **Network**: Stable internet connection with static IP

### Software Requirements
- **Node.js**: v18.0.0 or higher
- **MongoDB**: v6.0 or higher (or MongoDB Atlas)
- **Nginx**: v1.18+ (for reverse proxy)
- **PM2**: For process management
- **SSL Certificate**: For HTTPS

## 🔧 Environment Setup

### 1. Server Preparation

#### Ubuntu/Debian
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install MongoDB
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org

# Install Nginx
sudo apt install nginx -y

# Install PM2
sudo npm install -g pm2
```

#### CentOS/RHEL
```bash
# Update system
sudo yum update -y

# Install Node.js
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install -y nodejs

# Install MongoDB
sudo yum install -y mongodb-org

# Install Nginx
sudo yum install nginx -y

# Install PM2
sudo npm install -g pm2
```

### 2. Database Setup

#### Option A: Local MongoDB
```bash
# Start MongoDB service
sudo systemctl start mongod
sudo systemctl enable mongod

# Create database and user
mongo
use hospital-management
db.createUser({
  user: "hospital_admin",
  pwd: "secure_password_here",
  roles: ["readWrite"]
})
```

#### Option B: MongoDB Atlas (Recommended)
1. Create account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create new cluster
3. Configure network access (whitelist your server IP)
4. Create database user
5. Get connection string

### 3. Application Deployment

#### Clone and Setup
```bash
# Clone repository
git clone <your-repository-url>
cd Hospital-Management-System-MERN-Stack-main

# Install backend dependencies
cd backend
npm install --production

# Install frontend dependencies
cd ../frontend
npm install
npm run build
```

#### Environment Configuration
```bash
# Create production environment file
cd backend
nano .env
```

**Production .env file:**
```env
NODE_ENV=production
PORT=4451
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/hospital-management
JWT_SECRET=your-super-secure-jwt-secret-key-here
CORS_ORIGIN=https://yourdomain.com
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## 🚀 Deployment Methods

### Method 1: Traditional Server Deployment

#### 1. Backend Deployment
```bash
# Create PM2 ecosystem file
nano ecosystem.config.js
```

**ecosystem.config.js:**
```javascript
module.exports = {
  apps: [{
    name: 'hospital-backend',
    script: 'server.js',
    cwd: '/path/to/backend',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 4451
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true
  }]
};
```

```bash
# Start backend with PM2
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

#### 2. Frontend Deployment
```bash
# Build frontend
cd frontend
npm run build

# Copy build files to web directory
sudo cp -r dist/* /var/www/html/
```

#### 3. Nginx Configuration
```bash
# Create Nginx configuration
sudo nano /etc/nginx/sites-available/hospital-management
```

**Nginx configuration:**
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    
    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;
    
    # SSL Configuration
    ssl_certificate /path/to/your/certificate.crt;
    ssl_certificate_key /path/to/your/private.key;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    
    # Frontend
    location / {
        root /var/www/html;
        index index.html;
        try_files $uri $uri/ /index.html;
    }
    
    # Backend API
    location /api {
        proxy_pass http://localhost:4451;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/hospital-management /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Method 2: Docker Deployment

#### 1. Create Dockerfile
**backend/Dockerfile:**
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 4451

CMD ["node", "server.js"]
```

**frontend/Dockerfile:**
```dockerfile
FROM node:18-alpine as build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
```

#### 2. Docker Compose
**docker-compose.yml:**
```yaml
version: '3.8'

services:
  mongodb:
    image: mongo:6.0
    container_name: hospital-mongodb
    restart: unless-stopped
    ports:
      - "27017:27017"
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: password
    volumes:
      - mongodb_data:/data/db

  backend:
    build: ./backend
    container_name: hospital-backend
    restart: unless-stopped
    ports:
      - "4451:4451"
    environment:
      NODE_ENV: production
      MONGODB_URI: mongodb://admin:password@mongodb:27017/hospital-management?authSource=admin
      JWT_SECRET: your-jwt-secret
    depends_on:
      - mongodb

  frontend:
    build: ./frontend
    container_name: hospital-frontend
    restart: unless-stopped
    ports:
      - "80:80"
    depends_on:
      - backend

volumes:
  mongodb_data:
```

#### 3. Deploy with Docker
```bash
# Build and start services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Method 3: Cloud Deployment

#### AWS Deployment

##### 1. EC2 Setup
```bash
# Launch EC2 instance (t3.medium or larger)
# Install Docker
sudo yum update -y
sudo yum install -y docker
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -a -G docker ec2-user

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

##### 2. RDS MongoDB Setup
1. Create RDS MongoDB cluster
2. Configure security groups
3. Get connection string
4. Update environment variables

##### 3. Application Load Balancer
1. Create ALB
2. Configure target groups
3. Set up SSL certificate
4. Configure health checks

#### Heroku Deployment

##### 1. Backend Deployment
```bash
# Install Heroku CLI
# Login to Heroku
heroku login

# Create app
heroku create hospital-management-api

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set MONGODB_URI=mongodb+srv://...
heroku config:set JWT_SECRET=your-secret

# Deploy
git push heroku main
```

##### 2. Frontend Deployment
```bash
# Create separate app for frontend
heroku create hospital-management-web

# Build and deploy
npm run build
git add dist/
git commit -m "Build for production"
git push heroku main
```

#### DigitalOcean Deployment

##### 1. Droplet Setup
```bash
# Create droplet (4GB RAM minimum)
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

##### 2. MongoDB Managed Database
1. Create MongoDB cluster
2. Configure firewall rules
3. Get connection string
4. Update application config

## 🔒 Security Configuration

### 1. SSL/TLS Setup

#### Let's Encrypt (Free)
```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Get certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

#### Commercial SSL
1. Purchase SSL certificate
2. Generate CSR
3. Install certificate files
4. Configure Nginx

### 2. Firewall Configuration
```bash
# UFW (Ubuntu)
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable

# iptables (CentOS)
sudo iptables -A INPUT -p tcp --dport 22 -j ACCEPT
sudo iptables -A INPUT -p tcp --dport 80 -j ACCEPT
sudo iptables -A INPUT -p tcp --dport 443 -j ACCEPT
sudo iptables -A INPUT -j DROP
```

### 3. Database Security
```javascript
// MongoDB security configuration
{
  "security": {
    "authorization": "enabled"
  },
  "net": {
    "bindIp": "127.0.0.1"
  }
}
```

## 📊 Monitoring and Logging

### 1. Application Monitoring
```bash
# Install monitoring tools
npm install -g clinic
npm install -g 0x

# Monitor performance
clinic doctor -- node server.js
```

### 2. Log Management
```bash
# Configure log rotation
sudo nano /etc/logrotate.d/hospital-management
```

**Log rotation config:**
```
/var/log/hospital-management/*.log {
    daily
    missingok
    rotate 52
    compress
    delaycompress
    notifempty
    create 644 root root
    postrotate
        pm2 reloadLogs
    endscript
}
```

### 3. Health Checks
```javascript
// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage()
  });
});
```

## 🔄 Backup and Recovery

### 1. Database Backup
```bash
# MongoDB backup script
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
mongodump --uri="mongodb://localhost:27017/hospital-management" --out="/backup/mongodb_$DATE"
tar -czf "/backup/mongodb_$DATE.tar.gz" "/backup/mongodb_$DATE"
rm -rf "/backup/mongodb_$DATE"
```

### 2. Application Backup
```bash
# Application backup script
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
tar -czf "/backup/app_$DATE.tar.gz" "/path/to/application"
```

### 3. Automated Backups
```bash
# Add to crontab
0 2 * * * /path/to/backup-script.sh
```

## 🚀 Performance Optimization

### 1. Database Optimization
```javascript
// MongoDB indexes
db.users.createIndex({ email: 1 }, { unique: true })
db.appointments.createIndex({ date: 1, time: 1 })
db.medicalRecords.createIndex({ patientId: 1 })
db.inventory.createIndex({ name: 1 })
```

### 2. Caching Strategy
```javascript
// Redis caching
const redis = require('redis');
const client = redis.createClient();

// Cache frequently accessed data
app.get('/api/doctors', async (req, res) => {
  const cacheKey = 'doctors:all';
  const cached = await client.get(cacheKey);
  
  if (cached) {
    return res.json(JSON.parse(cached));
  }
  
  const doctors = await Doctor.find();
  await client.setex(cacheKey, 3600, JSON.stringify(doctors));
  res.json(doctors);
});
```

### 3. CDN Configuration
```nginx
# Nginx CDN configuration
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
    add_header Vary Accept-Encoding;
}
```

## 🔧 Maintenance

### 1. Regular Updates
```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Update Node.js dependencies
npm audit fix
npm update

# Update PM2
pm2 update
```

### 2. Database Maintenance
```bash
# MongoDB maintenance
mongo
use hospital-management
db.runCommand({compact: "users"})
db.runCommand({compact: "appointments"})
```

### 3. Log Cleanup
```bash
# Clean old logs
find /var/log -name "*.log" -mtime +30 -delete
pm2 flush
```

## 📈 Scaling

### 1. Horizontal Scaling
```yaml
# Docker Compose scaling
version: '3.8'
services:
  backend:
    build: ./backend
    deploy:
      replicas: 3
    ports:
      - "4451-4453:4451"
```

### 2. Load Balancer Configuration
```nginx
upstream backend {
    server localhost:4451;
    server localhost:4452;
    server localhost:4453;
}

server {
    location /api {
        proxy_pass http://backend;
    }
}
```

### 3. Database Scaling
- Use MongoDB replica sets
- Implement read replicas
- Consider sharding for large datasets

## 🚨 Troubleshooting

### Common Issues

#### 1. Port Already in Use
```bash
# Find process using port
lsof -i :4451
# Kill process
kill -9 <PID>
```

#### 2. MongoDB Connection Issues
```bash
# Check MongoDB status
sudo systemctl status mongod
# Restart MongoDB
sudo systemctl restart mongod
```

#### 3. Memory Issues
```bash
# Check memory usage
free -h
# Restart PM2 processes
pm2 restart all
```

#### 4. SSL Certificate Issues
```bash
# Check certificate validity
openssl x509 -in /path/to/certificate.crt -text -noout
# Renew Let's Encrypt certificate
sudo certbot renew
```

## 📋 Post-Deployment Checklist

### ✅ Completed Tasks
- [ ] Server configured and secured
- [ ] Database setup and secured
- [ ] Application deployed
- [ ] SSL certificate installed
- [ ] Domain configured
- [ ] Monitoring set up
- [ ] Backups configured
- [ ] Performance optimized
- [ ] Security hardened
- [ ] Documentation updated

### 🔄 Ongoing Tasks
- [ ] Regular security updates
- [ ] Performance monitoring
- [ ] Backup verification
- [ ] Log analysis
- [ ] User training
- [ ] Feature updates

## 📞 Support

### Getting Help
- Check application logs
- Review system metrics
- Contact technical support
- Submit issue on GitHub

### Maintenance Schedule
- **Daily**: Log review, performance check
- **Weekly**: Backup verification, security scan
- **Monthly**: System updates, performance optimization
- **Quarterly**: Security audit, disaster recovery test

---

**Deployment Status**: Production Ready
**Security Level**: Enterprise Grade
**Scalability**: High
**Maintenance**: Automated
**Support**: 24/7 Available

This deployment guide ensures your Hospital Management System is production-ready with enterprise-grade security, performance, and reliability.

