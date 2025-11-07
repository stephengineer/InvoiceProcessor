import { NextResponse } from 'next/server'

// Mock data
export const mockInvoices = [
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

export async function GET() {
  try {
    return NextResponse.json(mockInvoices)
  } catch (error) {
    console.error('Error fetching invoices:', error)
    return NextResponse.json(
      { error: 'Failed to fetch invoice list' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const invoiceData = await request.json()
    
    // Validate required fields
    const requiredFields = ['invoiceNumber', 'type', 'date', 'amount', 'vendor']
    const missingFields = requiredFields.filter(field => !invoiceData[field])
    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      )
    }

    // Validate data types
    if (typeof invoiceData.amount !== 'number') {
      return NextResponse.json(
        { error: 'Amount must be a number' },
        { status: 400 }
      )
    }

    // Check if invoice number already exists
    const existingInvoice = mockInvoices.find(
      inv => inv.invoiceNumber === invoiceData.invoiceNumber
    )
    if (existingInvoice) {
      return NextResponse.json(
        { error: 'Invoice number already exists' },
        { status: 400 }
      )
    }

    // Create new invoice
    const newInvoice = {
      ...invoiceData,
      id: Date.now().toString(),
      status: 'pending',
    }

    // Add to mock data
    mockInvoices.push(newInvoice)
    
    return NextResponse.json(newInvoice, { status: 201 })
  } catch (error) {
    console.error('Error saving invoice:', error)
    return NextResponse.json(
      { error: 'Failed to save invoice' },
      { status: 500 }
    )
  }
} 