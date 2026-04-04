const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const blockSchema = new Schema({
  blockHash: {
    type: String,
    required: true,
    unique: true
  },
  previousHash: String,
  timestamp: {
    type: Date,
    default: Date.now
  },
  nonce: Number,
  merkleRoot: String,
  transactions: [{
    transactionId: String,
    from: String,
    to: String,
    data: Schema.Types.Mixed,
    signature: String,
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  blockNumber: {
    type: Number,
    required: true
  },
  difficulty: Number,
  validator: String
});

const blockchainRecordSchema = new Schema({
  patientId: {
    type: String,
    required: true
  },
  patientName: {
    type: String,
    required: true
  },
  recordHash: {
    type: String,
    required: true,
    unique: true
  },
  recordType: {
    type: String,
    enum: ["medical_history", "diagnosis", "prescription", "lab_result", "imaging", "treatment", "consent"],
    required: true
  },
  encryptedData: {
    type: String,
    required: true
  },
  dataHash: {
    type: String,
    required: true
  },
  accessControl: {
    owner: String, // Patient ID
    authorizedUsers: [String], // Doctor/Nurse IDs
    accessLevel: {
      type: String,
      enum: ["read", "write", "admin"],
      default: "read"
    },
    expirationDate: Date
  },
  consent: {
    given: {
      type: Boolean,
      default: false
    },
    consentType: {
      type: String,
      enum: ["treatment", "research", "sharing", "emergency"],
      default: "treatment"
    },
    consentDate: Date,
    consentSignature: String,
    consentWitness: String
  },
  blockchain: {
    network: {
      type: String,
      enum: ["ethereum", "hyperledger", "custom"],
      default: "custom"
    },
    contractAddress: String,
    transactionHash: String,
    gasUsed: Number,
    blockNumber: Number,
    blockHash: String
  },
  version: {
    type: Number,
    default: 1
  },
  previousVersion: String,
  changeLog: [{
    changeType: {
      type: String,
      enum: ["create", "update", "delete", "access"]
    },
    changedBy: String,
    changeReason: String,
    timestamp: {
      type: Date,
      default: Date.now
    },
    oldHash: String,
    newHash: String
  }],
  auditTrail: [{
    action: String,
    performedBy: String,
    timestamp: {
      type: Date,
      default: Date.now
    },
    ipAddress: String,
    userAgent: String,
    result: {
      type: String,
      enum: ["success", "failure", "denied"]
    }
  }],
  sharing: {
    isShared: {
      type: Boolean,
      default: false
    },
    sharedWith: [{
      organization: String,
      purpose: String,
      sharedDate: Date,
      accessExpiry: Date,
      consentId: String
    }]
  },
  compliance: {
    hipaaCompliant: {
      type: Boolean,
      default: true
    },
    gdprCompliant: {
      type: Boolean,
      default: true
    },
    dataRetentionPolicy: String,
    encryptionStandard: {
      type: String,
      default: "AES-256"
    }
  },
  isActive: {
    type: Boolean,
    default: true
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

const BlockchainRecord = mongoose.model('BlockchainRecord', blockchainRecordSchema, 'blockchainRecords');
const Block = mongoose.model('Block', blockSchema, 'blocks');

module.exports = { BlockchainRecord, Block };

