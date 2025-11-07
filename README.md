# Invoice Processor

An AI-powered invoice and receipt processing system designed to help accounting professionals quickly analyze, organize, and archive invoices and receipts. This application leverages Google's Gemini AI to automatically extract key information from invoice images and PDF documents.

## Features

- **AI-Powered Extraction**: Automatically extracts invoice information (invoice number, type, date, amount, vendor) from images and PDF files using Google Gemini AI
- **Batch Processing**: Upload and process multiple invoices simultaneously
- **Invoice Management**: View, search, and manage all processed invoices in a centralized list
- **Status Tracking**: Track invoice approval status (pending/approved)
- **Modern UI**: Clean and intuitive interface built with Next.js and Tailwind CSS

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **AI Integration**: Google Gemini AI (gemini-2.0-flash)
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **Deployment**: Vercel (recommended) or GitHub Pages

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
   - Open `src/components/UploadInvoice.tsx`
   - Replace the empty string in `GEMINI_API_KEY` with your API key:
   ```typescript
   const GEMINI_API_KEY = "your-api-key-here"
   ```

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
│   │   ├── api/
│   │   │   └── invoices/        # API routes for invoice CRUD
│   │   ├── page.tsx          # Main page
│   │   └── layout.tsx        # Root layout
│   └── components/
│       ├── UploadInvoice.tsx # Invoice upload component
│       ├── InvoiceList.tsx   # Invoice list component
│       └── Tabs.tsx          # Tab navigation component
└── public/                   # Static assets
```

## API Endpoints

- `GET /api/invoices` - Get all invoices
- `POST /api/invoices` - Create a new invoice
- `PATCH /api/invoices/[id]` - Update invoice status

## Deployment

### Step 1: Push to GitHub

1. Initialize git repository (if not already done):
```bash
git init
git add .
git commit -m "Initial commit"
```

2. Create a new repository on GitHub (https://github.com/new)

3. Push your code to GitHub:
```bash
git remote add origin https://github.com/YOUR_USERNAME/invoice-processor.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy to Vercel (Recommended)

**Note**: Since this app uses Next.js API routes, GitHub Pages won't work. Vercel is the recommended deployment platform for Next.js apps.

1. Go to [Vercel](https://vercel.com) and sign up/login
2. Click "Add New Project"
3. Import your GitHub repository
4. Add environment variable:
   - Name: `GEMINI_API_KEY`
   - Value: Your Google Gemini API key
5. Click "Deploy"

Your app will be live at `https://your-project-name.vercel.app`

### Alternative: Deploy to Other Platforms

- **Netlify**: Similar to Vercel, supports Next.js with API routes
- **Railway**: Good for full-stack Next.js apps
- **Render**: Another option for Next.js deployment

**Important**: For production, move the API key from the component to environment variables for security.

## Environment Variables

- `GEMINI_API_KEY` - Your Google Gemini API key (required)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

See LICENSE file for details.
