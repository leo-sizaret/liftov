# Deploying Liftov to Vercel

This guide will help you deploy your Liftov PWA to Vercel so you can access it from any device.

## Prerequisites

1. A GitHub account
2. A Vercel account (you can sign up for free with your GitHub account)

## Step 1: Push to GitHub

1. Create a new repository on GitHub
2. Initialize your local repository and push to GitHub:

```bash
# Navigate to your project directory
cd liftov

# Initialize git repository (if not already done)
git init

# Add all files
git add .

# Commit changes
git commit -m "Initial commit"

# Add your GitHub repository as remote
git remote add origin https://github.com/yourusername/liftov.git

# Push to GitHub
git push -u origin main
```

## Step 2: Deploy to Vercel

1. Go to [Vercel](https://vercel.com/) and sign in with your GitHub account
2. Click "New Project"
3. Import your GitHub repository
4. Configure the project:
   - Framework Preset: Next.js
   - Root Directory: ./
   - Build Command: (leave as default)
   - Output Directory: (leave as default)
5. Click "Deploy"

Vercel will automatically build and deploy your application. Once the deployment is complete, you'll receive a URL where your app is hosted (e.g., `https://liftov.vercel.app`).

## Step 3: Install on Your Phone

To install the PWA on your phone:

1. Open the Vercel URL in your mobile browser (Chrome for Android or Safari for iOS)
2. For Android:
   - Tap the menu button (three dots)
   - Select "Add to Home screen"
3. For iOS:
   - Tap the share button
   - Scroll down and select "Add to Home Screen"

Now you can access Liftov directly from your home screen like a native app!

## Automatic Updates

One of the benefits of deploying to Vercel is that whenever you push changes to your GitHub repository, Vercel will automatically rebuild and deploy your app. This means you can easily update your app by simply pushing changes to GitHub.

## Custom Domain (Optional)

If you want to use a custom domain instead of the Vercel subdomain:

1. Go to your project on Vercel
2. Click on "Settings" > "Domains"
3. Add your custom domain and follow the instructions to configure DNS settings

## Troubleshooting

If you encounter any issues during deployment:

1. Check the build logs in Vercel for error messages
2. Ensure your Next.js application builds correctly locally with `npm run build`
3. Verify that all environment variables are properly set in Vercel if your app requires them