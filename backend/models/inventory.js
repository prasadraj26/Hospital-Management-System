const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const inventoryItemSchema = new Schema({
  itemCode: {
    type: String,
    required: true,
    unique: true
  },
  itemName: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ["medication", "equipment", "supplies", "consumables", "instruments"],
    required: true
  },
  description: String,
  unit: {
    type: String,
    enum: ["pieces", "boxes", "bottles", "vials", "tubes", "packs", "liters", "grams", "milliliters"],
    required: true
  },
  currentStock: {
    type: Number,
    required: true,
    min: 0
  },
  minimumStock: {
    type: Number,
    required: true,
    min: 0
  },
  maximumStock: {
    type: Number,
    required: true,
    min: 0
  },
  unitPrice: {
    type: Number,
    required: true,
    min: 0
  },
  supplier: {
    name: String,
    contact: String,
    email: String,
    phone: String
  },
  expiryDate: Date,
  batchNumber: String,
  location: {
    ward: String,
    shelf: String,
    position: String
  },
  status: {
    type: String,
    enum: ["available", "low_stock", "out_of_stock", "expired", "damaged"],
    default: "available"
  },
  lastRestocked: Date,
  lastUsed: Date,
  usageHistory: [{
    date: {
      type: Date,
      default: Date.now
    },
    quantity: Number,
    usedBy: String,
    purpose: String,
    patientId: String
  }],
  reorderLevel: {
    type: Number,
    default: 10
  },
  isCritical: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

const inventoryTransactionSchema = new Schema({
  itemId: {
    type: Schema.Types.ObjectId,
    ref: 'InventoryItem',
    required: true
  },
  transactionType: {
    type: String,
    enum: ["in", "out", "transfer", "adjustment", "expired", "damaged"],
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  unitPrice: Number,
  totalValue: Number,
  fromLocation: String,
  toLocation: String,
  performedBy: String,
  purpose: String,
  patientId: String,
  notes: String,
  transactionDate: {
    type: Date,
    default: Date.now
  }
});

const InventoryItem = mongoose.model('InventoryItem', inventoryItemSchema, 'inventory');
const InventoryTransaction = mongoose.model('InventoryTransaction', inventoryTransactionSchema, 'inventoryTransactions');

module.exports = { InventoryItem, InventoryTransaction };
