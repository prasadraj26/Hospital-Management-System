const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const auditLogSchema = new Schema({
  userId: String,
  userName: String,
  userRole: String,
  action: {
    type: String,
    required: true
  },
  resource: {
    type: String,
    required: true
  },
  resourceId: String,
  operation: {
    type: String,
    enum: ["CREATE", "READ", "UPDATE", "DELETE", "LOGIN", "LOGOUT", "EXPORT", "IMPORT"],
    required: true
  },
  details: {
    before: Schema.Types.Mixed,
    after: Schema.Types.Mixed,
    changes: [String]
  },
  ipAddress: String,
  userAgent: String,
  sessionId: String,
  timestamp: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ["success", "failure", "error"],
    default: "success"
  },
  errorMessage: String,
  severity: {
    type: String,
    enum: ["low", "medium", "high", "critical"],
    default: "low"
  },
  department: String,
  location: {
    ward: String,
    room: String,
    floor: String
  }
});

const AuditLog = mongoose.model('AuditLog', auditLogSchema, 'auditLogs');
module.exports = AuditLog;
