const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const billItemSchema = new Schema({
  itemCode: String,
  itemName: String,
  description: String,
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  unitPrice: {
    type: Number,
    required: true,
    min: 0
  },
  totalPrice: {
    type: Number,
    required: true,
    min: 0
  },
  category: {
    type: String,
    enum: ["consultation", "medication", "procedure", "lab_test", "imaging", "room_charge", "other"],
    required: true
  }
});

const paymentSchema = new Schema({
  paymentMethod: {
    type: String,
    enum: ["cash", "card", "insurance", "bank_transfer", "upi", "cheque"],
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  transactionId: String,
  paymentDate: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ["pending", "completed", "failed", "refunded"],
    default: "pending"
  },
  notes: String
});

const billingSchema = new Schema({
  billNumber: {
    type: String,
    required: true,
    unique: true
  },
  patientId: {
    type: String,
    required: true
  },
  patientName: {
    type: String,
    required: true
  },
  patientEmail: String,
  patientPhone: String,
  appointmentId: String,
  doctorId: String,
  doctorName: String,
  billDate: {
    type: Date,
    default: Date.now
  },
  dueDate: Date,
  items: [billItemSchema],
  subtotal: {
    type: Number,
    required: true,
    min: 0
  },
  taxRate: {
    type: Number,
    default: 0.18 // 18% GST
  },
  taxAmount: {
    type: Number,
    default: 0
  },
  discount: {
    type: Number,
    default: 0,
    min: 0
  },
  discountReason: String,
  totalAmount: {
    type: Number,
    required: true,
    min: 0
  },
  paidAmount: {
    type: Number,
    default: 0,
    min: 0
  },
  balanceAmount: {
    type: Number,
    default: 0
  },
  payments: [paymentSchema],
  status: {
    type: String,
    enum: ["draft", "pending", "partial", "paid", "overdue", "cancelled"],
    default: "pending"
  },
  insuranceInfo: {
    provider: String,
    policyNumber: String,
    coverageAmount: Number,
    claimNumber: String,
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "partial"],
      default: "pending"
    }
  },
  notes: String,
  generatedBy: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

const Billing = mongoose.model('Billing', billingSchema, 'billing');
module.exports = Billing;
