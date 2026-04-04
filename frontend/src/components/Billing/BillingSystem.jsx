import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

function BillingSystem() {
  const [bills, setBills] = useState([]);
  const [selectedBill, setSelectedBill] = useState(null);
  const [showCreateBill, setShowCreateBill] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const [newBill, setNewBill] = useState({
    patientId: '',
    patientName: '',
    patientEmail: '',
    patientPhone: '',
    appointmentId: '',
    doctorId: '',
    doctorName: '',
    items: [],
    subtotal: 0,
    taxRate: 0.18,
    taxAmount: 0,
    discount: 0,
    discountReason: '',
    totalAmount: 0,
    paymentMethod: 'cash',
    insuranceInfo: {
      provider: '',
      policyNumber: '',
      coverageAmount: 0
    }
  });

  const [newItem, setNewItem] = useState({
    itemCode: '',
    itemName: '',
    description: '',
    quantity: 1,
    unitPrice: 0,
    totalPrice: 0,
    category: 'consultation'
  });

  const [payment, setPayment] = useState({
    paymentMethod: 'cash',
    amount: 0,
    transactionId: '',
    notes: ''
  });

  const itemCategories = [
    { value: 'consultation', label: 'Consultation' },
    { value: 'medication', label: 'Medication' },
    { value: 'procedure', label: 'Procedure' },
    { value: 'lab_test', label: 'Lab Test' },
    { value: 'imaging', label: 'Imaging' },
    { value: 'room_charge', label: 'Room Charge' },
    { value: 'other', label: 'Other' }
  ];

  const paymentMethods = [
    { value: 'cash', label: 'Cash' },
    { value: 'card', label: 'Credit/Debit Card' },
    { value: 'insurance', label: 'Insurance' },
    { value: 'bank_transfer', label: 'Bank Transfer' },
    { value: 'upi', label: 'UPI' },
    { value: 'cheque', label: 'Cheque' }
  ];

  useEffect(() => {
    fetchBills();
  }, []);

  const fetchBills = async () => {
    try {
      setLoading(true);
      // Mock data for demonstration
      const mockBills = [
        {
          _id: '1',
          billNumber: 'BILL-001',
          patientName: 'John Doe',
          patientEmail: 'john@example.com',
          patientPhone: '+1234567890',
          billDate: new Date(),
          dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          items: [
            {
              itemCode: 'CONS001',
              itemName: 'General Consultation',
              description: 'Initial consultation with doctor',
              quantity: 1,
              unitPrice: 200,
              totalPrice: 200,
              category: 'consultation'
            },
            {
              itemCode: 'MED001',
              itemName: 'Aspirin 81mg',
              description: 'Blood thinner medication',
              quantity: 30,
              unitPrice: 2.50,
              totalPrice: 75,
              category: 'medication'
            }
          ],
          subtotal: 275,
          taxRate: 0.18,
          taxAmount: 49.5,
          discount: 0,
          totalAmount: 324.5,
          paidAmount: 324.5,
          balanceAmount: 0,
          status: 'paid',
          paymentMethod: 'card',
          createdAt: new Date()
        },
        {
          _id: '2',
          billNumber: 'BILL-002',
          patientName: 'Jane Smith',
          patientEmail: 'jane@example.com',
          patientPhone: '+1234567891',
          billDate: new Date(),
          dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
          items: [
            {
              itemCode: 'PROC001',
              itemName: 'ECG Test',
              description: 'Electrocardiogram test',
              quantity: 1,
              unitPrice: 150,
              totalPrice: 150,
              category: 'procedure'
            }
          ],
          subtotal: 150,
          taxRate: 0.18,
          taxAmount: 27,
          discount: 10,
          discountReason: 'Senior citizen discount',
          totalAmount: 167,
          paidAmount: 0,
          balanceAmount: 167,
          status: 'pending',
          paymentMethod: 'insurance',
          insuranceInfo: {
            provider: 'Blue Cross',
            policyNumber: 'BC123456',
            coverageAmount: 167
          },
          createdAt: new Date()
        }
      ];
      setBills(mockBills);
    } catch (error) {
      console.error('Error fetching bills:', error);
      Swal.fire('Error', 'Failed to fetch billing data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const addItem = () => {
    if (!newItem.itemName || !newItem.unitPrice) {
      Swal.fire('Error', 'Please fill in required fields', 'error');
      return;
    }

    const item = {
      ...newItem,
      totalPrice: newItem.quantity * newItem.unitPrice
    };

    setNewBill({
      ...newBill,
      items: [...newBill.items, item]
    });

    // Reset form
    setNewItem({
      itemCode: '',
      itemName: '',
      description: '',
      quantity: 1,
      unitPrice: 0,
      totalPrice: 0,
      category: 'consultation'
    });

    calculateTotal();
  };

  const removeItem = (index) => {
    const newItems = newBill.items.filter((_, i) => i !== index);
    setNewBill({ ...newBill, items: newItems });
    calculateTotal();
  };

  const calculateTotal = () => {
    const subtotal = newBill.items.reduce((sum, item) => sum + item.totalPrice, 0);
    const taxAmount = subtotal * newBill.taxRate;
    const totalAmount = subtotal + taxAmount - newBill.discount;

    setNewBill({
      ...newBill,
      subtotal,
      taxAmount,
      totalAmount
    });
  };

  const createBill = async () => {
    try {
      if (!newBill.patientName || newBill.items.length === 0) {
        Swal.fire('Error', 'Please fill in required fields and add at least one item', 'error');
        return;
      }

      const billNumber = `BILL-${String(bills.length + 1).padStart(3, '0')}`;
      const billData = {
        ...newBill,
        billNumber,
        billDate: new Date(),
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        paidAmount: 0,
        balanceAmount: newBill.totalAmount,
        status: 'pending'
      };

      // Here you would make an API call to create the bill
      console.log('Creating bill:', billData);
      
      Swal.fire('Success', 'Bill created successfully', 'success');
      setShowCreateBill(false);
      resetBillForm();
      fetchBills();
    } catch (error) {
      console.error('Error creating bill:', error);
      Swal.fire('Error', 'Failed to create bill', 'error');
    }
  };

  const resetBillForm = () => {
    setNewBill({
      patientId: '',
      patientName: '',
      patientEmail: '',
      patientPhone: '',
      appointmentId: '',
      doctorId: '',
      doctorName: '',
      items: [],
      subtotal: 0,
      taxRate: 0.18,
      taxAmount: 0,
      discount: 0,
      discountReason: '',
      totalAmount: 0,
      paymentMethod: 'cash',
      insuranceInfo: {
        provider: '',
        policyNumber: '',
        coverageAmount: 0
      }
    });
  };

  const processPayment = async () => {
    try {
      if (!payment.amount || payment.amount <= 0) {
        Swal.fire('Error', 'Please enter a valid payment amount', 'error');
        return;
      }

      // Here you would make an API call to process payment
      console.log('Processing payment:', payment);
      
      Swal.fire('Success', 'Payment processed successfully', 'success');
      setShowPaymentModal(false);
      setPayment({
        paymentMethod: 'cash',
        amount: 0,
        transactionId: '',
        notes: ''
      });
      fetchBills();
    } catch (error) {
      console.error('Error processing payment:', error);
      Swal.fire('Error', 'Failed to process payment', 'error');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid': return 'text-green-600 bg-green-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'partial': return 'text-blue-600 bg-blue-100';
      case 'overdue': return 'text-red-600 bg-red-100';
      case 'cancelled': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const filteredBills = bills.filter(bill => {
    const statusMatch = filterStatus === 'all' || bill.status === filterStatus;
    const searchMatch = bill.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       bill.billNumber.toLowerCase().includes(searchTerm.toLowerCase());
    return statusMatch && searchMatch;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading billing data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-6">
            <h1 className="text-3xl font-bold mb-2">💰 Billing & Payment System</h1>
            <p className="text-purple-100">Comprehensive billing management with multiple payment methods</p>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex flex-wrap gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Status</label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="paid">Paid</option>
                  <option value="partial">Partial</option>
                  <option value="overdue">Overdue</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
                <input
                  type="text"
                  placeholder="Search by patient name or bill number"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>
            
            <button
              onClick={() => setShowCreateBill(true)}
              className="px-6 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-200"
            >
              + Create Bill
            </button>
          </div>
        </div>

        {/* Bills Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bill #</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Method</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredBills.map(bill => (
                  <tr key={bill._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {bill.billNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{bill.patientName}</div>
                        <div className="text-sm text-gray-500">{bill.patientEmail}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(bill.billDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${bill.totalAmount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(bill.status)}`}>
                        {bill.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {bill.paymentMethod.replace('_', ' ').toUpperCase()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setSelectedBill(bill)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          View
                        </button>
                        {bill.status !== 'paid' && (
                          <button
                            onClick={() => {
                              setSelectedBill(bill);
                              setShowPaymentModal(true);
                            }}
                            className="text-green-600 hover:text-green-900"
                          >
                            Pay
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Create Bill Modal */}
        {showCreateBill && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <h2 className="text-2xl font-bold mb-6 text-center">Create New Bill</h2>
                
                <div className="space-y-6">
                  {/* Patient Information */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold mb-4">Patient Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Patient Name *</label>
                        <input
                          type="text"
                          value={newBill.patientName}
                          onChange={(e) => setNewBill({...newBill, patientName: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Patient Email</label>
                        <input
                          type="email"
                          value={newBill.patientEmail}
                          onChange={(e) => setNewBill({...newBill, patientEmail: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Patient Phone</label>
                        <input
                          type="tel"
                          value={newBill.patientPhone}
                          onChange={(e) => setNewBill({...newBill, patientPhone: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Doctor Name</label>
                        <input
                          type="text"
                          value={newBill.doctorName}
                          onChange={(e) => setNewBill({...newBill, doctorName: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Bill Items */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold mb-4">Bill Items</h3>
                    
                    {/* Add Item Form */}
                    <div className="grid grid-cols-1 md:grid-cols-6 gap-2 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Item Name *</label>
                        <input
                          type="text"
                          value={newItem.itemName}
                          onChange={(e) => setNewItem({...newItem, itemName: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                          placeholder="e.g., Consultation"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                        <select
                          value={newItem.category}
                          onChange={(e) => setNewItem({...newItem, category: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                        >
                          {itemCategories.map(cat => (
                            <option key={cat.value} value={cat.value}>{cat.label}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                        <input
                          type="number"
                          min="1"
                          value={newItem.quantity}
                          onChange={(e) => setNewItem({...newItem, quantity: parseInt(e.target.value) || 1})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Unit Price *</label>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={newItem.unitPrice}
                          onChange={(e) => setNewItem({...newItem, unitPrice: parseFloat(e.target.value) || 0})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Total</label>
                        <input
                          type="number"
                          step="0.01"
                          value={newItem.quantity * newItem.unitPrice}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
                          readOnly
                        />
                      </div>
                      <div className="flex items-end">
                        <button
                          onClick={addItem}
                          className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                        >
                          Add Item
                        </button>
                      </div>
                    </div>

                    {/* Items List */}
                    {newBill.items.length > 0 && (
                      <div className="space-y-2">
                        {newBill.items.map((item, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-white rounded border">
                            <div className="flex-1">
                              <div className="font-medium">{item.itemName}</div>
                              <div className="text-sm text-gray-600">{item.category} - Qty: {item.quantity}</div>
                            </div>
                            <div className="flex items-center space-x-4">
                              <div className="text-right">
                                <div className="font-medium">${item.totalPrice.toFixed(2)}</div>
                                <div className="text-sm text-gray-600">${item.unitPrice.toFixed(2)} each</div>
                              </div>
                              <button
                                onClick={() => removeItem(index)}
                                className="text-red-600 hover:text-red-800"
                              >
                                ✕
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Bill Summary */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold mb-4">Bill Summary</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Subtotal:</span>
                        <span>${newBill.subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tax ({(newBill.taxRate * 100).toFixed(0)}%):</span>
                        <span>${newBill.taxAmount.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Discount:</span>
                        <span>-${newBill.discount.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between font-bold text-lg border-t pt-2">
                        <span>Total Amount:</span>
                        <span>${newBill.totalAmount.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-4 mt-6">
                  <button
                    onClick={() => setShowCreateBill(false)}
                    className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={createBill}
                    className="px-6 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-200"
                  >
                    Create Bill
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Payment Modal */}
        {showPaymentModal && selectedBill && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-md">
              <div className="p-6">
                <h2 className="text-xl font-bold mb-4">Process Payment</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Bill Number</label>
                    <input
                      type="text"
                      value={selectedBill.billNumber}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
                      readOnly
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Total Amount</label>
                    <input
                      type="text"
                      value={`$${selectedBill.totalAmount.toFixed(2)}`}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
                      readOnly
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
                    <select
                      value={payment.paymentMethod}
                      onChange={(e) => setPayment({...payment, paymentMethod: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      {paymentMethods.map(method => (
                        <option key={method.value} value={method.value}>{method.label}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Payment Amount *</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      max={selectedBill.balanceAmount}
                      value={payment.amount}
                      onChange={(e) => setPayment({...payment, amount: parseFloat(e.target.value) || 0})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Transaction ID</label>
                    <input
                      type="text"
                      value={payment.transactionId}
                      onChange={(e) => setPayment({...payment, transactionId: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                    <textarea
                      value={payment.notes}
                      onChange={(e) => setPayment({...payment, notes: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                      rows="3"
                    />
                  </div>
                </div>
                
                <div className="flex justify-end space-x-4 mt-6">
                  <button
                    onClick={() => setShowPaymentModal(false)}
                    className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={processPayment}
                    className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-200"
                  >
                    Process Payment
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Bill Detail Modal */}
        {selectedBill && !showPaymentModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">Bill Details - {selectedBill.billNumber}</h2>
                  <button
                    onClick={() => setSelectedBill(null)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Patient Information</h3>
                    <div className="space-y-2">
                      <div><strong>Name:</strong> {selectedBill.patientName}</div>
                      <div><strong>Email:</strong> {selectedBill.patientEmail}</div>
                      <div><strong>Phone:</strong> {selectedBill.patientPhone}</div>
                      <div><strong>Doctor:</strong> {selectedBill.doctorName}</div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Bill Information</h3>
                    <div className="space-y-2">
                      <div><strong>Date:</strong> {new Date(selectedBill.billDate).toLocaleDateString()}</div>
                      <div><strong>Due Date:</strong> {new Date(selectedBill.dueDate).toLocaleDateString()}</div>
                      <div><strong>Status:</strong> <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedBill.status)}`}>{selectedBill.status.toUpperCase()}</span></div>
                      <div><strong>Payment Method:</strong> {selectedBill.paymentMethod.replace('_', ' ').toUpperCase()}</div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-3">Items</h3>
                  <div className="space-y-2">
                    {selectedBill.items.map((item, index) => (
                      <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                        <div>
                          <div className="font-medium">{item.itemName}</div>
                          <div className="text-sm text-gray-600">{item.description}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">${item.totalPrice.toFixed(2)}</div>
                          <div className="text-sm text-gray-600">Qty: {item.quantity} × ${item.unitPrice.toFixed(2)}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="mt-6 bg-gray-50 p-4 rounded">
                  <h3 className="text-lg font-semibold mb-3">Bill Summary</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>${selectedBill.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax ({(selectedBill.taxRate * 100).toFixed(0)}%):</span>
                      <span>${selectedBill.taxAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Discount:</span>
                      <span>-${selectedBill.discount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg border-t pt-2">
                      <span>Total Amount:</span>
                      <span>${selectedBill.totalAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Paid Amount:</span>
                      <span>${selectedBill.paidAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg">
                      <span>Balance:</span>
                      <span>${selectedBill.balanceAmount.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default BillingSystem;

