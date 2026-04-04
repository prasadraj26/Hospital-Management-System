const express = require("express");
const router = express.Router();
const Billing = require("../models/billing");

// Get all bills
router.get("/", async (req, res) => {
  try {
    const { patientId, status, paymentMethod, startDate, endDate, limit = 50 } = req.query;
    
    let filter = {};
    if (patientId) filter.patientId = patientId;
    if (status) filter.status = status;
    if (paymentMethod) filter['payments.paymentMethod'] = paymentMethod;
    
    if (startDate || endDate) {
      filter.billDate = {};
      if (startDate) filter.billDate.$gte = new Date(startDate);
      if (endDate) filter.billDate.$lte = new Date(endDate);
    }
    
    const bills = await Billing.find(filter)
      .sort({ billDate: -1 })
      .limit(parseInt(limit));
    
    res.status(200).json({
      success: true,
      bills
    });
  } catch (error) {
    console.error("Get Bills Error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch bills"
    });
  }
});

// Get bill by ID
router.get("/:billId", async (req, res) => {
  try {
    const { billId } = req.params;
    const bill = await Billing.findOne({ billNumber: billId });
    
    if (!bill) {
      return res.status(404).json({
        success: false,
        error: "Bill not found"
      });
    }
    
    res.status(200).json({
      success: true,
      bill
    });
  } catch (error) {
    console.error("Get Bill Error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch bill"
    });
  }
});

// Create new bill
router.post("/", async (req, res) => {
  try {
    const billData = req.body;
    
    // Generate unique bill number if not provided
    if (!billData.billNumber) {
      const billCount = await Billing.countDocuments();
      billData.billNumber = `BILL-${String(billCount + 1).padStart(3, '0')}`;
    }
    
    // Check if bill number already exists
    const existingBill = await Billing.findOne({ billNumber: billData.billNumber });
    if (existingBill) {
      return res.status(400).json({
        success: false,
        error: "Bill number already exists"
      });
    }
    
    // Calculate totals
    const subtotal = billData.items.reduce((sum, item) => sum + item.totalPrice, 0);
    const taxAmount = subtotal * (billData.taxRate || 0.18);
    const totalAmount = subtotal + taxAmount - (billData.discount || 0);
    
    const bill = new Billing({
      ...billData,
      subtotal,
      taxAmount,
      totalAmount,
      paidAmount: 0,
      balanceAmount: totalAmount,
      status: 'pending',
      billDate: new Date(),
      dueDate: billData.dueDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    });
    
    await bill.save();
    
    res.status(201).json({
      success: true,
      bill,
      message: "Bill created successfully"
    });
  } catch (error) {
    console.error("Create Bill Error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to create bill",
      details: error.message
    });
  }
});

// Update bill
router.put("/:billId", async (req, res) => {
  try {
    const { billId } = req.params;
    const updateData = req.body;
    
    // Recalculate totals if items are updated
    if (updateData.items) {
      const subtotal = updateData.items.reduce((sum, item) => sum + item.totalPrice, 0);
      const taxAmount = subtotal * (updateData.taxRate || 0.18);
      const totalAmount = subtotal + taxAmount - (updateData.discount || 0);
      
      updateData.subtotal = subtotal;
      updateData.taxAmount = taxAmount;
      updateData.totalAmount = totalAmount;
      updateData.balanceAmount = totalAmount - (updateData.paidAmount || 0);
    }
    
    const bill = await Billing.findOneAndUpdate(
      { billNumber: billId },
      { ...updateData, updatedAt: new Date() },
      { new: true }
    );
    
    if (!bill) {
      return res.status(404).json({
        success: false,
        error: "Bill not found"
      });
    }
    
    res.status(200).json({
      success: true,
      bill,
      message: "Bill updated successfully"
    });
  } catch (error) {
    console.error("Update Bill Error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to update bill"
    });
  }
});

// Process payment
router.post("/:billId/payment", async (req, res) => {
  try {
    const { billId } = req.params;
    const { paymentMethod, amount, transactionId, notes } = req.body;
    
    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        error: "Valid payment amount is required"
      });
    }
    
    const bill = await Billing.findOne({ billNumber: billId });
    if (!bill) {
      return res.status(404).json({
        success: false,
        error: "Bill not found"
      });
    }
    
    // Add payment to bill
    const payment = {
      paymentMethod,
      amount,
      transactionId,
      paymentDate: new Date(),
      status: 'completed',
      notes
    };
    
    bill.payments.push(payment);
    bill.paidAmount += amount;
    bill.balanceAmount = bill.totalAmount - bill.paidAmount;
    
    // Update bill status based on payment
    if (bill.balanceAmount <= 0) {
      bill.status = 'paid';
    } else if (bill.paidAmount > 0) {
      bill.status = 'partial';
    }
    
    await bill.save();
    
    res.status(200).json({
      success: true,
      bill,
      payment,
      message: "Payment processed successfully"
    });
  } catch (error) {
    console.error("Process Payment Error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to process payment"
    });
  }
});

// Get payment history
router.get("/:billId/payments", async (req, res) => {
  try {
    const { billId } = req.params;
    const bill = await Billing.findOne({ billNumber: billId });
    
    if (!bill) {
      return res.status(404).json({
        success: false,
        error: "Bill not found"
      });
    }
    
    res.status(200).json({
      success: true,
      payments: bill.payments
    });
  } catch (error) {
    console.error("Get Payments Error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch payments"
    });
  }
});

// Generate invoice
router.get("/:billId/invoice", async (req, res) => {
  try {
    const { billId } = req.params;
    const bill = await Billing.findOne({ billNumber: billId });
    
    if (!bill) {
      return res.status(404).json({
        success: false,
        error: "Bill not found"
      });
    }
    
    // Generate invoice data
    const invoice = {
      billNumber: bill.billNumber,
      patientName: bill.patientName,
      patientEmail: bill.patientEmail,
      patientPhone: bill.patientPhone,
      doctorName: bill.doctorName,
      billDate: bill.billDate,
      dueDate: bill.dueDate,
      items: bill.items,
      subtotal: bill.subtotal,
      taxAmount: bill.taxAmount,
      discount: bill.discount,
      totalAmount: bill.totalAmount,
      paidAmount: bill.paidAmount,
      balanceAmount: bill.balanceAmount,
      status: bill.status,
      payments: bill.payments
    };
    
    res.status(200).json({
      success: true,
      invoice
    });
  } catch (error) {
    console.error("Generate Invoice Error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to generate invoice"
    });
  }
});

// Get billing statistics
router.get("/statistics/overview", async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    let filter = {};
    if (startDate || endDate) {
      filter.billDate = {};
      if (startDate) filter.billDate.$gte = new Date(startDate);
      if (endDate) filter.billDate.$lte = new Date(endDate);
    }
    
    const bills = await Billing.find(filter);
    
    const statistics = {
      totalBills: bills.length,
      totalRevenue: bills.reduce((sum, bill) => sum + bill.totalAmount, 0),
      paidBills: bills.filter(bill => bill.status === 'paid').length,
      pendingBills: bills.filter(bill => bill.status === 'pending').length,
      overdueBills: bills.filter(bill => bill.status === 'overdue').length,
      partialBills: bills.filter(bill => bill.status === 'partial').length,
      averageBillAmount: bills.length > 0 ? bills.reduce((sum, bill) => sum + bill.totalAmount, 0) / bills.length : 0,
      totalPaidAmount: bills.reduce((sum, bill) => sum + bill.paidAmount, 0),
      totalOutstanding: bills.reduce((sum, bill) => sum + bill.balanceAmount, 0)
    };
    
    res.status(200).json({
      success: true,
      statistics
    });
  } catch (error) {
    console.error("Get Billing Statistics Error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch billing statistics"
    });
  }
});

// Get revenue by payment method
router.get("/statistics/payment-methods", async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    let filter = {};
    if (startDate || endDate) {
      filter.billDate = {};
      if (startDate) filter.billDate.$gte = new Date(startDate);
      if (endDate) filter.billDate.$lte = new Date(endDate);
    }
    
    const bills = await Billing.find(filter);
    
    const paymentMethodStats = {};
    
    bills.forEach(bill => {
      bill.payments.forEach(payment => {
        if (!paymentMethodStats[payment.paymentMethod]) {
          paymentMethodStats[payment.paymentMethod] = {
            count: 0,
            totalAmount: 0
          };
        }
        paymentMethodStats[payment.paymentMethod].count++;
        paymentMethodStats[payment.paymentMethod].totalAmount += payment.amount;
      });
    });
    
    res.status(200).json({
      success: true,
      paymentMethodStats
    });
  } catch (error) {
    console.error("Get Payment Method Statistics Error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch payment method statistics"
    });
  }
});

// Get monthly revenue
router.get("/statistics/monthly-revenue", async (req, res) => {
  try {
    const { year = new Date().getFullYear() } = req.query;
    
    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year, 11, 31);
    
    const bills = await Billing.find({
      billDate: { $gte: startDate, $lte: endDate }
    });
    
    const monthlyRevenue = Array(12).fill(0);
    
    bills.forEach(bill => {
      const month = bill.billDate.getMonth();
      monthlyRevenue[month] += bill.totalAmount;
    });
    
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    
    const monthlyData = months.map((month, index) => ({
      month,
      revenue: monthlyRevenue[index]
    }));
    
    res.status(200).json({
      success: true,
      monthlyRevenue: monthlyData
    });
  } catch (error) {
    console.error("Get Monthly Revenue Error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch monthly revenue"
    });
  }
});

// Cancel bill
router.put("/:billId/cancel", async (req, res) => {
  try {
    const { billId } = req.params;
    const { reason } = req.body;
    
    const bill = await Billing.findOneAndUpdate(
      { billNumber: billId },
      { 
        status: 'cancelled',
        notes: reason ? `Cancelled: ${reason}` : 'Bill cancelled',
        updatedAt: new Date()
      },
      { new: true }
    );
    
    if (!bill) {
      return res.status(404).json({
        success: false,
        error: "Bill not found"
      });
    }
    
    res.status(200).json({
      success: true,
      bill,
      message: "Bill cancelled successfully"
    });
  } catch (error) {
    console.error("Cancel Bill Error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to cancel bill"
    });
  }
});

// Refund payment
router.post("/:billId/refund", async (req, res) => {
  try {
    const { billId } = req.params;
    const { paymentId, refundAmount, reason } = req.body;
    
    const bill = await Billing.findOne({ billNumber: billId });
    if (!bill) {
      return res.status(404).json({
        success: false,
        error: "Bill not found"
      });
    }
    
    const payment = bill.payments.id(paymentId);
    if (!payment) {
      return res.status(404).json({
        success: false,
        error: "Payment not found"
      });
    }
    
    if (refundAmount > payment.amount) {
      return res.status(400).json({
        success: false,
        error: "Refund amount cannot exceed payment amount"
      });
    }
    
    // Add refund payment
    const refund = {
      paymentMethod: payment.paymentMethod,
      amount: -refundAmount,
      transactionId: `REFUND-${Date.now()}`,
      paymentDate: new Date(),
      status: 'completed',
      notes: reason ? `Refund: ${reason}` : 'Payment refunded'
    };
    
    bill.payments.push(refund);
    bill.paidAmount -= refundAmount;
    bill.balanceAmount = bill.totalAmount - bill.paidAmount;
    
    // Update bill status
    if (bill.balanceAmount >= bill.totalAmount) {
      bill.status = 'pending';
    } else if (bill.paidAmount > 0) {
      bill.status = 'partial';
    }
    
    await bill.save();
    
    res.status(200).json({
      success: true,
      bill,
      refund,
      message: "Refund processed successfully"
    });
  } catch (error) {
    console.error("Process Refund Error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to process refund"
    });
  }
});

module.exports = router;

