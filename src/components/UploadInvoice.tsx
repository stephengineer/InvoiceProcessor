'use client'

import { useState } from 'react'
import { GoogleGenerativeAI } from "@google/generative-ai";

// Gemini API Key
const GEMINI_API_KEY = ""
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

interface InvoiceData {
  invoiceNumber: string
  type: string
  date: string
  amount: number
  vendor: string
}

// Interface for handling raw API responses
interface RawInvoiceData {
  invoiceNumber: string
  type: string
  date: string
  amount: string | number
  vendor: string
}

interface UploadProgress {
  [key: string]: {
    status: 'pending' | 'processing' | 'success' | 'error'
    progress: number
    error?: string
    result?: InvoiceData
  }
}

export function UploadInvoice() {
  const [files, setFiles] = useState<File[]>([])
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<UploadProgress>({})
  const [error, setError] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files)
      const validFiles: File[] = []
      const errors: string[] = []

      selectedFiles.forEach(file => {
        const fileType = file.type
        
        // Check file type
        if (!fileType.startsWith('image/') && fileType !== 'application/pdf') {
          errors.push(`${file.name}: Unsupported file type`)
          return
        }

        // Check file size (limit 10MB)
        if (file.size > 10 * 1024 * 1024) {
          errors.push(`${file.name}: File size exceeds 10MB`)
          return
        }

        validFiles.push(file)
      })

      if (errors.length > 0) {
        setError(errors.join('\n'))
      } else {
        setError(null)
      }

      setFiles(validFiles)
      
      // Initialize upload progress
      const initialProgress: UploadProgress = {}
      validFiles.forEach(file => {
        initialProgress[file.name] = {
          status: 'pending',
          progress: 0
        }
      })
      setUploadProgress(initialProgress)
    }
  }

  const processFile = async (file: File) => {
    try {
      // Update status to processing
      setUploadProgress(prev => ({
        ...prev,
        [file.name]: { ...prev[file.name], status: 'processing', progress: 0 }
      }))

      // Convert file to base64
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => {
          const result = reader.result as string
          // Remove data URL prefix (e.g., "data:image/jpeg;base64,")
          const base64String = result.split(',')[1] || result
          resolve(base64String)
        }
        reader.onerror = reject
        reader.readAsDataURL(file)
      })

      // Prepare file data
      const fileData = {
        inlineData: {
          data: base64,
          mimeType: file.type,
        },
      }

      // Select different prompts based on file type
      const prompt = file.type === 'application/pdf'
        ? 'Please analyze the invoice information in this PDF file and extract the following information: invoice number, invoice type, invoice date, amount, and vendor name. Please return in JSON format with keys: invoiceNumber, type, date, amount, vendor'
        : 'Please extract the following information from this invoice image: invoice number, invoice type, invoice date, amount, and vendor name. Please return in JSON format with keys: invoiceNumber, type, date, amount, vendor'

      // Use Gemini to analyze file
      const model = genAI.getGenerativeModel({ 
        model: "gemini-2.0-flash-exp",
        generationConfig: {
          responseMimeType: 'application/json',
        }
      });
      
      const result = await model.generateContent([
        { text: prompt },
        { inlineData: fileData.inlineData }
      ]);
      const response = await result.response;
      
      // Parse JSON response
      const responseText = response.text() || '{}';
      let rawInvoiceData;
      try {
        rawInvoiceData = JSON.parse(responseText);
      } catch (parseError) {
        throw new Error('Failed to parse invoice data. Please ensure the file format is correct');
      }

      // If rawInvoiceData is a list, take the first one
      if (Array.isArray(rawInvoiceData)) {
        rawInvoiceData = rawInvoiceData[0];
      }

      // Validate required fields
      const requiredFields = ['invoiceNumber', 'type', 'date', 'amount', 'vendor'];
      const missingFields = requiredFields.filter(field => !rawInvoiceData[field]);
      if (missingFields.length > 0) {
        throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
      }

      // Convert data types
      const invoiceData = {
        invoiceNumber: String(rawInvoiceData.invoiceNumber),
        type: String(rawInvoiceData.type),
        date: String(rawInvoiceData.date),
        amount: parseFloat(rawInvoiceData.amount) || 0,
        vendor: String(rawInvoiceData.vendor),
      };
      
      // Save invoice data to backend
      const saveResponse = await fetch('/api/invoices', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...invoiceData,
          id: Date.now().toString(),
          status: 'pending',
        }),
      });

      if (!saveResponse.ok) {
        const errorData = await saveResponse.json();
        throw new Error(errorData.error || 'Failed to save invoice data');
      }

      const savedData = await saveResponse.json();
      
      // Update status to success
      setUploadProgress(prev => ({
        ...prev,
        [file.name]: { 
          ...prev[file.name], 
          status: 'success', 
          progress: 100,
          result: invoiceData
        }
      }))

      return invoiceData;
    } catch (error) {
      // Update status to error
      setUploadProgress(prev => ({
        ...prev,
        [file.name]: { 
          ...prev[file.name], 
          status: 'error', 
          progress: 0,
          error: error instanceof Error ? error.message : 'Processing failed'
        }
      }))
      throw error;
    }
  }

  const handleUpload = async () => {
    if (files.length === 0) {
      setError('Please select files')
      return
    }

    setUploading(true)
    setError(null)

    try {
      // Process all files in parallel
      await Promise.all(files.map(file => processFile(file)))
    } catch (error) {
      console.error('Upload error:', error)
      setError('Some files failed to process. Please try again')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center justify-center w-full">
        <label
          htmlFor="dropzone-file"
          className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <svg className="w-10 h-10 mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
            </svg>
            <p className="mb-2 text-sm text-gray-500">
              <span className="font-semibold">Click to upload</span> or drag files here
            </p>
            <p className="text-xs text-gray-500">Supports images and PDF files, max size 10MB</p>
          </div>
          <input
            id="dropzone-file"
            type="file"
            className="hidden"
            onChange={handleFileChange}
            accept="image/*,.pdf"
            multiple
          />
        </label>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600 whitespace-pre-line">{error}</p>
        </div>
      )}

      {files.length > 0 && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600">{files.length} file(s) selected</p>
            <button
              onClick={handleUpload}
              disabled={uploading}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors duration-200 flex items-center space-x-2"
            >
              {uploading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/>
                  </svg>
                  <span>Start Processing</span>
                </>
              )}
            </button>
          </div>

          <div className="space-y-2">
            {files.map((file) => (
              <div key={file.name} className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                    </svg>
                    <span className="text-sm font-medium text-gray-700">{file.name}</span>
                  </div>
                  <span className="text-xs text-gray-500">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </span>
                </div>
                
                {uploadProgress[file.name] && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>
                        {uploadProgress[file.name].status === 'pending' && 'Pending'}
                        {uploadProgress[file.name].status === 'processing' && 'Processing...'}
                        {uploadProgress[file.name].status === 'success' && 'Success'}
                        {uploadProgress[file.name].status === 'error' && 'Failed'}
                      </span>
                      <span>{uploadProgress[file.name].progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${
                          uploadProgress[file.name].status === 'success' ? 'bg-green-500' :
                          uploadProgress[file.name].status === 'error' ? 'bg-red-500' :
                          'bg-blue-500'
                        }`}
                        style={{ width: `${uploadProgress[file.name].progress}%` }}
                      />
                    </div>
                    {uploadProgress[file.name].error && (
                      <p className="text-xs text-red-500">{uploadProgress[file.name].error}</p>
                    )}
                    {uploadProgress[file.name].result && (
                      <div className="mt-2 p-2 bg-gray-50 rounded text-xs">
                        <p className="font-medium">Invoice Number: {uploadProgress[file.name].result.invoiceNumber}</p>
                        <p>Type: {uploadProgress[file.name].result.type}</p>
                        <p>Amount: ${uploadProgress[file.name].result.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
} 