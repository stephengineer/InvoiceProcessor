import { NextResponse } from 'next/server'
import { mockInvoices } from '../route'

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const data = await request.json()
    
    // In a real application, this should be a database update operation
    const invoiceIndex = mockInvoices.findIndex(inv => inv.id === id)
    if (invoiceIndex === -1) {
      return NextResponse.json(
        { error: 'Invoice not found' },
        { status: 404 }
      )
    }

    // Update invoice status
    mockInvoices[invoiceIndex] = {
      ...mockInvoices[invoiceIndex],
      status: data.status,
    }

    return NextResponse.json(mockInvoices[invoiceIndex])
  } catch (error) {
    console.error('Error updating invoice:', error)
    return NextResponse.json(
      { error: 'Failed to update invoice' },
      { status: 500 }
    )
  }
} 