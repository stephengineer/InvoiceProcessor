# Invoice Processor

An AI-powered invoice and receipt processing system designed to help accounting professionals quickly analyze, organize, and archive invoices and receipts. This application leverages Google's Gemini AI to automatically extract key information from invoice images and PDF documents.

## Features

- **AI-Powered Extraction**: Automatically extracts invoice information (invoice number, type, date, amount, vendor) from images and PDF files using Google Gemini AI
- **Batch Processing**: Upload and process multiple invoices simultaneously
- **Invoice Management**: View, search, and manage all processed invoices in a centralized list
- **Status Tracking**: Track invoice approval status (pending/approved)
- **Modern UI**: Clean and intuitive interface built with Next.js and Tailwind CSS

## Tech Stack

- **Framework**: Next.js 15 with App Router (Static Export)
- **AI Integration**: Google Gemini AI (gemini-2.0-flash)
- **Storage**: Client-side localStorage
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **Deployment**: GitHub Pages

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Google Gemini API key ([Get your API key here](https://makersuite.google.com/app/apikey))

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd invoice-processor
```

2. Install dependencies:
```bash
npm install
```

3. Add your Google Gemini API key:
   
   **For Local Development:**
   - Create a `.env.local` file in the root directory
   - Add: `NEXT_PUBLIC_GEMINI_API_KEY=your-api-key-here`
   - Get your API key from: [Google AI Studio](https://makersuite.google.com/app/apikey)
   
   **For Production (GitHub Pages):**
   - Add the environment variable as a GitHub Secret (see Deployment section)

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

1. **Upload Invoices**: 
   - Navigate to the "Upload Invoices" tab
   - Click or drag and drop invoice images (JPG, PNG) or PDF files
   - Files must be under 10MB
   - Click "Start Processing" to analyze invoices

2. **View Invoices**:
   - Navigate to the "Invoice List" tab
   - Search invoices by invoice number or vendor name
   - Toggle approval status by clicking the status button

## Project Structure

```
invoice-processor/
├── src/
│   ├── app/
│   │   ├── page.tsx          # Main page
│   │   └── layout.tsx        # Root layout
│   ├── components/
│   │   ├── UploadInvoice.tsx # Invoice upload component
│   │   ├── InvoiceList.tsx   # Invoice list component
│   │   └── Tabs.tsx          # Tab navigation component
│   └── lib/
│       └── storage.ts        # Client-side storage service
└── public/                   # Static assets
```

## Storage

This app uses **client-side localStorage** to store invoices. Data is saved in the user's browser and persists across sessions.

## Deployment to GitHub Pages

This app is configured for static export and can be deployed to GitHub Pages for free!

### Step 1: Push Your Code to GitHub

1. **Initialize Git** (if not already done):
```bash
git init
git add .
git commit -m "Initial commit: Invoice processor"
```

2. **Create a GitHub Repository**:
   - Go to [GitHub.com](https://github.com) and sign in
   - Click the **"+"** icon → **"New repository"**
   - Repository name: `invoice-processor` (or your preferred name)
   - Choose **Public**
   - **DO NOT** initialize with README
   - Click **"Create repository"**

3. **Push to GitHub**:
```bash
git remote add origin https://github.com/YOUR_USERNAME/invoice-processor.git
git branch -M main
git push -u origin main
```

### Step 2: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** → **Pages** (in the left sidebar)
3. Under **Source**, select:
   - **Source**: `GitHub Actions`
4. Click **Save**

### Step 3: Add API Key as GitHub Secret

1. In your repository, go to **Settings** → **Secrets and variables** → **Actions**
2. Click **"New repository secret"**
3. **Name**: `NEXT_PUBLIC_GEMINI_API_KEY`
4. **Value**: Your Google Gemini API key
   - Get your API key from: [Google AI Studio](https://makersuite.google.com/app/apikey)
5. Click **"Add secret"**

### Step 4: Trigger Deployment

1. The GitHub Actions workflow will automatically run when you push to `main`
2. Or manually trigger it: Go to **Actions** tab → **Deploy to GitHub Pages** → **Run workflow**

### Step 5: Configure Base Path (If Repository Name is Different)

If your repository name is NOT `invoice-processor`, you need to update the base path:

1. Open `next.config.ts`
2. Uncomment and update these lines:
```typescript
basePath: '/YOUR_REPO_NAME',
assetPrefix: '/YOUR_REPO_NAME',
```
3. Replace `YOUR_REPO_NAME` with your actual repository name
4. Commit and push the changes

### Step 6: Access Your Website

Once deployment completes (usually 2-3 minutes):
- Your website will be available at:
  ```
  https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/
  ```
- Or if you have a custom domain, configure it in **Settings** → **Pages**

### Automatic Updates

Every time you push changes to the `main` branch, GitHub Actions will automatically rebuild and redeploy your site!

## Environment Variables

- `NEXT_PUBLIC_GEMINI_API_KEY` - Your Google Gemini API key (required)
  - For local development: Add to `.env.local` file
  - For production: Add as GitHub Secret (see Deployment section)

## Troubleshooting

### Build Fails
- Check GitHub Actions logs in the **Actions** tab
- Verify `NEXT_PUBLIC_GEMINI_API_KEY` secret is set correctly
- Make sure all dependencies are in `package.json`

### Website Not Loading
- Wait a few minutes after deployment
- Check that GitHub Pages is enabled in repository settings
- Verify the build completed successfully in Actions tab

### API Key Not Working
- Verify the secret name is exactly: `NEXT_PUBLIC_GEMINI_API_KEY`
- Check that the API key is valid
- Re-run the workflow after updating the secret

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

See LICENSE file for details.
