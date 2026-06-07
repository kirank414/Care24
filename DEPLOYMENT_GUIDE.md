# Care24 Deployment Guide

This guide provides step-by-step instructions for deploying the Care24 application to production.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Environment Configuration](#environment-configuration)
3. [MongoDB Atlas Setup](#mongodb-atlas-setup)
4. [Local Build Test](#local-build-test)
5. [Deployment Options](#deployment-options)
6. [Post-Deployment Steps](#post-deployment-steps)
7. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before deploying, ensure you have:

- [x] Node.js installed (v18 or higher)
- [x] Git installed
- [x] MongoDB Atlas account (free tier available)
- [x] GitHub account (for deployment platforms)
- [x] Deployment platform account (Render, Vercel, AWS, etc.)

---

## Environment Configuration

### 1. Create Production Environment Variables

Create a `.env` file in your project root with the following variables:

```env
# MongoDB Atlas Database URI Connection String
MONGODB_URI="mongodb+srv://<username>:<password>@cluster0.xxxxxx.mongodb.net/care24?retryWrites=true&w=majority"

# JWT Secret Signing Key (REQUIRED - must be set in production)
JWT_SECRET="your_secure_random_jwt_secret_key_here"

# Port Configuration
PORT=3000

# Environment Level
NODE_ENV="production"
```

### 2. Generate Secure JWT Secret

Generate a secure random JWT secret:

```bash
# Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Using OpenSSL
openssl rand -hex 32
```

Copy the generated string and use it as your JWT_SECRET.

---

## MongoDB Atlas Setup

### 1. Create MongoDB Atlas Account

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up for a free account
3. Create a new project

### 2. Create a Cluster

1. Click "Build a Database"
2. Choose "FREE" tier (M0)
3. Select a region closest to your deployment location
4. Name your cluster (e.g., "care24-cluster")
5. Click "Create"

### 3. Create Database User

1. Go to "Database Access" in the left sidebar
2. Click "Add New Database User"
3. Choose "Password Authentication"
4. Enter username and password (save these credentials)
5. Select "Read and write to any database"
6. Click "Add User"

### 4. Whitelist IP Addresses

1. Go to "Network Access" in the left sidebar
2. Click "Add IP Address"
3. For deployment platforms like Render/Vercel, add: `0.0.0.0/0` (allows all IPs)
4. For specific hosting, add your server's public IP
5. Click "Confirm"

### 5. Get Connection String

1. Go to "Database" in the left sidebar
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Select Node.js version
5. Copy the connection string
6. Replace `<password>` with your database user password
7. Use this as your MONGODB_URI

---

## Local Build Test

Before deploying, test the build locally:

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Environment Variables

Create a `.env` file with your production values (or use `.env.example` as template).

### 3. Build the Application

```bash
npm run build
```

This will create a `dist/` folder with the production build.

### 4. Test Production Build Locally

```bash
# Set NODE_ENV to production
set NODE_ENV=production  # Windows
export NODE_ENV=production  # Linux/Mac

# Start the server
node server.js
```

Or use tsx:

```bash
npx tsx server.ts
```

### 5. Verify the Application

1. Open http://localhost:3000
2. Test user registration
3. Test login functionality
4. Verify database connections in console logs

---

## Deployment Options

### Option 1: Render (Recommended - Free Tier)

Render is a cloud platform that offers free hosting for web services.

#### Step 1: Prepare GitHub Repository

1. Ensure your code is pushed to GitHub
2. Repository should be public or private (your choice)
3. Verify `.env` is NOT committed (it should be in `.gitignore`)

#### Step 2: Create Render Account

1. Go to [Render](https://render.com)
2. Sign up with GitHub
3. Authorize Render to access your repositories

#### Step 3: Create Web Service

1. Click "New +" → "Web Service"
2. Select your `Care24` repository
3. Configure the service:

**Build & Deploy Settings:**
- **Name:** care24 (or your preferred name)
- **Branch:** main
- **Runtime:** Node
- **Build Command:** `npm install && npm run build`
- **Start Command:** `node server.js`

**Environment Variables:**
- **MONGODB_URI:** Your MongoDB Atlas connection string
- **JWT_SECRET:** Your secure JWT secret
- **PORT:** 3000 (or leave blank for default)
- **NODE_ENV:** production

#### Step 4: Deploy

1. Click "Create Web Service"
2. Wait for the build to complete (2-5 minutes)
3. Render will provide a URL like: `https://care24.onrender.com`

#### Step 5: Verify Deployment

1. Click the provided URL
2. Test the application
3. Check Render logs for any errors

---

### Option 2: Vercel (Frontend + Backend)

Vercel is optimized for frontend deployment but can host Node.js backends.

#### Step 1: Install Vercel CLI

```bash
npm install -g vercel
```

#### Step 2: Login to Vercel

```bash
vercel login
```

#### Step 3: Deploy

```bash
# From project root
vercel
```

Follow the prompts:
- Link to existing project? No
- Project name: care24
- Directory: ./
- Build Command: `npm run build`
- Output Directory: dist
- Install Command: `npm install`
- Start Command: `node server.js`

#### Step 4: Add Environment Variables

1. Go to Vercel dashboard
2. Select your project
3. Go to Settings → Environment Variables
4. Add:
   - MONGODB_URI
   - JWT_SECRET
   - PORT
   - NODE_ENV

#### Step 5: Redeploy

After adding environment variables, trigger a redeploy from the Vercel dashboard.

---

### Option 3: AWS EC2 (Full Control)

AWS EC2 provides full control over your server.

#### Step 1: Launch EC2 Instance

1. Go to [AWS Console](https://console.aws.amazon.com)
2. Navigate to EC2
3. Click "Launch Instance"
4. Choose:
   - **Name:** care24-server
   - **AMI:** Ubuntu Server 22.04 LTS
   - **Instance Type:** t2.micro (free tier eligible)
   - **Key Pair:** Create or select a key pair
5. Configure security groups:
   - Allow SSH (Port 22) from your IP
   - Allow HTTP (Port 80) from anywhere
   - Allow HTTPS (Port 443) from anywhere
   - Allow Custom TCP (Port 3000) from anywhere
6. Click "Launch Instance"

#### Step 2: Connect to EC2 Instance

```bash
ssh -i your-key.pem ubuntu@your-instance-ip
```

#### Step 3: Install Node.js

```bash
# Update system
sudo apt update

# Install Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Verify installation
node -v
npm -v
```

#### Step 4: Clone Repository

```bash
# Install Git
sudo apt install git

# Clone repository
git clone https://github.com/kirank414/Care24.git
cd Care24
```

#### Step 5: Install Dependencies

```bash
npm install
```

#### Step 6. Create Environment File

```bash
nano .env
```

Add your environment variables:
```env
MONGODB_URI="your-mongodb-uri"
JWT_SECRET="your-jwt-secret"
PORT=3000
NODE_ENV="production"
```

Save and exit (Ctrl+X, Y, Enter).

#### Step 7. Build Application

```bash
npm run build
```

#### Step 8. Install PM2 (Process Manager)

```bash
sudo npm install -g pm2
```

#### Step 9. Start Application with PM2

```bash
pm2 start server.js --name care24
pm2 save
pm2 startup
```

#### Step 10. Configure Nginx (Optional but Recommended)

```bash
# Install Nginx
sudo apt install nginx

# Configure Nginx
sudo nano /etc/nginx/sites-available/care24
```

Add this configuration:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable the site:
```bash
sudo ln -s /etc/nginx/sites-available/care24 /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

---

### Option 4: Railway (Simple Deployment)

Railway is a simple deployment platform with a generous free tier.

#### Step 1: Create Railway Account

1. Go to [Railway](https://railway.app)
2. Sign up with GitHub

#### Step 2: Create New Project

1. Click "New Project"
2. Click "Deploy from GitHub repo"
3. Select your `Care24` repository

#### Step 3: Configure Project

1. Railway will detect it's a Node.js project
2. Add environment variables in the "Variables" tab:
   - MONGODB_URI
   - JWT_SECRET
   - PORT
   - NODE_ENV

#### Step 4: Deploy

Railway will automatically deploy. You'll get a URL like: `https://care24.up.railway.app`

---

## Post-Deployment Steps

### 1. Create Admin Account

After deployment, create an admin account:

```bash
# SSH into your server (if using EC2)
ssh -i your-key.pem ubuntu@your-instance-ip
cd Care24

# Run the admin creation script
npx tsx create_admin.ts
```

Or use the API directly:
```bash
curl -X POST https://your-domain.com/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "System Admin",
    "email": "admin@care24.com",
    "password": "your-secure-password",
    "phone": "+1555000000",
    "role": "admin"
  }'
```

**Note:** You'll need to temporarily modify the signup route to allow admin role creation, or use MongoDB Compass to manually update the user role.

### 2. Seed Service Categories

Add initial service categories:

```bash
npx tsx seed_services.ts
```

### 3. Verify Database Connection

Check your MongoDB Atlas dashboard to verify:
- Cluster is active
- Data is being written
- No connection errors in logs

### 4. Test Application Endpoints

Test critical endpoints:
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get user profile (requires auth)
- `GET /api/services` - Get services
- `POST /api/bookings` - Create booking (requires auth)

### 5. Set Up Domain (Optional)

#### For Render:
1. Go to your web service settings
2. Add custom domain
3. Update DNS records as instructed

#### For Vercel:
1. Go to project settings
2. Add domain
3. Update DNS records

#### For AWS EC2:
1. Purchase domain from Route 53 or other registrar
2. Configure DNS to point to your EC2 IP
3. Set up SSL with Let's Encrypt:
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

### 6. Enable HTTPS (SSL)

#### For Render/Vercel:
- SSL is automatically enabled

#### For AWS EC2:
```bash
sudo certbot --nginx -d your-domain.com
sudo systemctl restart nginx
```

---

## Troubleshooting

### Issue: Build Fails

**Solution:**
- Check build logs for specific errors
- Ensure all dependencies are in package.json
- Verify Node.js version compatibility
- Run `npm install` locally first

### Issue: Database Connection Failed

**Solution:**
- Verify MONGODB_URI is correct
- Check MongoDB Atlas IP whitelist
- Ensure database user has correct permissions
- Check MongoDB Atlas cluster status

### Issue: JWT_SECRET Not Set

**Solution:**
- Add JWT_SECRET to environment variables
- Restart the application after adding
- Verify the variable is set correctly

### Issue: Port Already in Use

**Solution:**
- Change PORT in environment variables
- Or kill the process using the port:
```bash
# Find process
lsof -i :3000
# Kill process
kill -9 <PID>
```

### Issue: Application Not Starting

**Solution:**
- Check application logs
- Verify all environment variables are set
- Ensure build completed successfully
- Check Node.js version compatibility

### Issue: CORS Errors

**Solution:**
- Add CORS configuration in server.ts
- Allow your frontend domain
- Check API endpoint URLs

---

## Monitoring and Maintenance

### 1. Check Application Logs

**Render/Vercel:**
- Check dashboard logs

**AWS EC2:**
```bash
pm2 logs care24
```

### 2. Monitor MongoDB Atlas

- Check cluster metrics
- Monitor connection count
- Review slow queries
- Set up alerts

### 3. Regular Backups

- Enable MongoDB Atlas automated backups
- Set backup retention period
- Test restore process

### 4. Update Dependencies

Regularly update dependencies:
```bash
npm audit
npm update
```

### 5. Security Updates

- Keep Node.js updated
- Update MongoDB Atlas
- Monitor security advisories
- Review access logs

---

## Cost Estimation

### Free Tier Options:

**Render:**
- Free tier: 512 MB RAM, 0.1 CPU
- Suitable for small projects
- Sleeps after 15 minutes of inactivity

**Vercel:**
- Free tier: 100 GB bandwidth/month
- Excellent for frontend
- Backend may have limitations

**Railway:**
- Free tier: $5 credit/month
- Good for small projects
- No sleep timer

**AWS EC2:**
- Free tier: 750 hours/month for 12 months
- t2.micro instance
- Full control

### Paid Tier (if needed):

- Render: $7/month for starter
- Vercel: $20/month for pro
- Railway: $5/month for basic
- AWS EC2: ~$8-15/month depending on instance

---

## Support

For issues or questions:
- Check platform documentation (Render, Vercel, AWS, Railway)
- Review MongoDB Atlas documentation
- Check application logs
- Review this deployment guide

---

**Deployment Guide Version:** 1.0  
**Last Updated:** June 7, 2026  
**Application:** Care24  
**Repository:** https://github.com/kirank414/Care24
