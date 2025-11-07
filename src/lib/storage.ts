// Client-side storage service for invoices
// This replaces API routes for GitHub Pages static deployment

export interface Invoice {
  id: string
  invoiceNumber: string
  type: string
  date: string
  amount: number
  vendor: string
  status: string
}

const STORAGE_KEY = 'invoice-processor-invoices'

// Initialize with sample data if storage is empty
const defaultInvoices: Invoice[] = [
  {
    id: '1',
    invoiceNumber: 'INV123456',
    type: 'VAT Special Invoice',
    date: '2025-03-15',
    amount: 12500.00,
    vendor: 'Premium Supplier A',
    status: 'approved',
  },
  {
    id: '2',
    invoiceNumber: 'INV123457',
    type: 'VAT General Invoice',
    date: '2025-03-10',
    amount: 8750.50,
    vendor: 'Standard Supplier B',
    status: 'pending',
  },
  {
    id: '3',
    invoiceNumber: 'INV123458',
    type: 'Electronic Invoice',
    date: '2025-03-05',
    amount: 3250.00,
    vendor: 'Premium Supplier A',
    status: 'approved',
  },
]

function getInvoices(): Invoice[] {
  if (typeof window === 'undefined') {
    return defaultInvoices
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      return JSON.parse(stored)
    }
    // Initialize with default data
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultInvoices))
    return defaultInvoices
  } catch (error) {
    console.error('Error reading from localStorage:', error)
    return defaultInvoices
  }
}

function saveInvoices(invoices: Invoice[]): void {
  if (typeof window === 'undefined') {
    return
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(invoices))
  } catch (error) {
    console.error('Error saving to localStorage:', error)
  }
}

export const invoiceStorage = {
  getAll: (): Invoice[] => {
    return getInvoices()
  },

  getById: (id: string): Invoice | undefined => {
    const invoices = getInvoices()
    return invoices.find(inv => inv.id === id)
  },

  create: (invoiceData: Omit<Invoice, 'id' | 'status'>): Invoice => {
    const invoices = getInvoices()
    
    // Validate required fields
    const requiredFields = ['invoiceNumber', 'type', 'date', 'amount', 'vendor']
    const missingFields = requiredFields.filter(field => !invoiceData[field as keyof typeof invoiceData])
    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(', ')}`)
    }

    // Validate data types
    if (typeof invoiceData.amount !== 'number') {
      throw new Error('Amount must be a number')
    }

    // Check if invoice number already exists
    const existingInvoice = invoices.find(
      inv => inv.invoiceNumber === invoiceData.invoiceNumber
    )
    if (existingInvoice) {
      throw new Error('Invoice number already exists')
    }

    // Create new invoice
    const newInvoice: Invoice = {
      ...invoiceData,
      id: Date.now().toString(),
      status: 'pending',
    }

    invoices.push(newInvoice)
    saveInvoices(invoices)
    return newInvoice
  },

  update: (id: string, updates: Partial<Invoice>): Invoice => {
    const invoices = getInvoices()
    const index = invoices.findIndex(inv => inv.id === id)
    
    if (index === -1) {
      throw new Error('Invoice not found')
    }

    invoices[index] = { ...invoices[index], ...updates }
    saveInvoices(invoices)
    return invoices[index]
  },

  updateStatus: (id: string, status: string): Invoice => {
    return invoiceStorage.update(id, { status })
  },

  delete: (id: string): void => {
    const invoices = getInvoices()
    const filtered = invoices.filter(inv => inv.id !== id)
    saveInvoices(filtered)
  },

  clear: (): void => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY)
      // Reinitialize with default data
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultInvoices))
    }
  },
}

