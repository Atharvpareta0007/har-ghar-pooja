# 🚀 Deployment Guide - Har Ghar Pooja

Complete guide for deploying backend and frontend to production.

## 📋 Pre-Deployment Checklist

- [ ] Environment variables configured
- [ ] Database created and accessible
- [ ] Payment provider keys obtained
- [ ] Domain/subdomain ready (optional)
- [ ] SSL certificate configured (production)

---

## 🔧 Backend Deployment

### Option 1: Render (Recommended)

1. **Create Account**: Sign up at [render.com](https://render.com)

2. **Create PostgreSQL Database**:
   - Click "New +" → "PostgreSQL"
   - Choose plan (free tier available)
   - Note the `Internal Database URL`

3. **Create Web Service**:
   - Click "New +" → "Web Service"
   - Connect GitHub repo
   - Configure:
     ```
     Name: hargharpooja-backend
     Environment: Docker
     Region: Choose nearest
     Branch: main
     Root Directory: backend
     ```

4. **Environment Variables**:
   Add in Render dashboard:
   ```
   DATABASE_URL=<your-postgres-internal-url>
   JWT_SECRET_KEY=<generate-random-string>
   RAZORPAY_KEY_ID=<your-razorpay-key>
   RAZORPAY_KEY_SECRET=<your-razorpay-secret>
   CORS_ORIGINS=https://your-frontend-domain.com
   ```

5. **Deploy**: Render auto-deploys on git push

6. **Run Seed Script**:
   ```bash
   # In Render Shell
   python -m app.seed_data
   ```

### Option 2: Heroku

```bash
# Install Heroku CLI
heroku login

# Create app
cd backend
heroku create hargharpooja-backend

# Add PostgreSQL
heroku addons:create heroku-postgresql:hobby-dev

# Set environment variables
heroku config:set JWT_SECRET_KEY=your-secret-key
heroku config:set RAZORPAY_KEY_ID=your-key

# Deploy
git push heroku main

# Run seed script
heroku run python -m app.seed_data
```

### Option 3: AWS ECS

```bash
# Build and push Docker image
docker build -t hargharpooja-backend ./backend
docker tag hargharpooja-backend:latest <aws-account-id>.dkr.ecr.region.amazonaws.com/hargharpooja:latest
docker push <aws-account-id>.dkr.ecr.region.amazonaws.com/hargharpooja:latest

# Create ECS task definition and service
# Configure RDS PostgreSQL
# Set environment variables in task definition
```

---

## 🎨 Frontend Deployment

### Option 1: Netlify (Recommended)

1. **Build Locally**:
   ```bash
   cd frontend
   npm run build
   ```

2. **Deploy via Netlify CLI**:
   ```bash
   npm install -g netlify-cli
   netlify login
   netlify deploy --prod --dir=dist
   ```

3. **Or Connect GitHub**:
   - Go to [netlify.com](https://netlify.com)
   - "New site from Git"
   - Connect repo
   - Configure:
     ```
     Base directory: frontend
     Build command: npm run build
     Publish directory: frontend/dist
     ```

4. **Environment Variables**:
   - Not needed (proxy via API)

### Option 2: Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
cd frontend
vercel --prod
```

Or connect GitHub repo in Vercel dashboard.

### Option 3: Static Hosting (Nginx)

```bash
# Build
cd frontend
npm run build

# Upload dist/ folder to server
scp -r dist/* user@server:/var/www/hargharpooja/

# Nginx config
server {
    listen 80;
    server_name yourdomain.com;
    
    root /var/www/hargharpooja;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    location /api {
        proxy_pass http://backend:8000;
        proxy_set_header Host $host;
    }
}
```

---

## 🔐 Production Checklist

### Backend
- [ ] Use strong JWT_SECRET_KEY
- [ ] Configure CORS properly
- [ ] Set up SSL/HTTPS
- [ ] Enable rate limiting
- [ ] Configure logging
- [ ] Set up monitoring (Sentry, etc.)
- [ ] Database backups enabled
- [ ] Payment webhooks verified

### Frontend
- [ ] Update API endpoints to production URLs
- [ ] Enable HTTPS
- [ ] Configure CDN (optional)
- [ ] Add analytics (optional)
- [ ] Test all user flows
- [ ] Mobile responsiveness verified

---

## 🔄 CI/CD Setup (GitHub Actions)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Render
        run: |
          curl -X POST ${{ secrets.RENDER_DEPLOY_HOOK }}

  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Netlify
        run: |
          cd frontend
          npm install
          npm run build
          npx netlify-cli deploy --prod --dir=dist --auth=${{ secrets.NETLIFY_TOKEN }}
```

---

## 🧪 Testing Production

```bash
# Test backend
curl https://api.yourdomain.com/health

# Test frontend
curl https://yourdomain.com

# Test authentication
curl -X POST https://api.yourdomain.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"phone":"919999999999","password":"Admin@123"}'
```

---

## 📊 Monitoring

### Backend Logs
- **Render**: View in dashboard logs tab
- **Heroku**: `heroku logs --tail`
- **AWS**: CloudWatch Logs

### Error Tracking
- Set up Sentry or similar
- Configure in FastAPI middleware

### Performance
- Use Application Performance Monitoring (APM)
- Monitor database query performance
- Set up uptime monitoring (UptimeRobot, etc.)

---

## 🔧 Troubleshooting

### Backend Issues
```bash
# Check logs
render logs --tail  # Render
heroku logs --tail  # Heroku

# Test database connection
psql $DATABASE_URL

# Verify environment variables
env | grep DATABASE_URL
```

### Frontend Issues
- Clear browser cache
- Check browser console for errors
- Verify API endpoints in Network tab
- Test with different browsers

---

## 📝 Post-Deployment

1. Test all major workflows:
   - User registration/login
   - Puja booking
   - Payment flow
   - Admin panel
   - Pandit dashboard

2. Monitor for 24 hours:
   - Check error rates
   - Monitor response times
   - Verify payment webhooks

3. Set up alerts for:
   - Server downtime
   - Database issues
   - Payment failures

---

## 🎉 You're Live!

Your Har Ghar Pooja platform is now in production. Share the URL and start helping devotees connect with spiritual services!

For issues: Check logs → Review environment variables → Test locally → Contact support
