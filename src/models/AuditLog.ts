/**
 * Audit Log Model
 * Immutable, append-only record of every admin action.
 * Logs are NEVER updated or deleted through the API (read-only GET).
 * This creates a tamper-evident trail for compliance and forensics.
 */
import { Schema, Document, models, model } from 'mongoose';

export type AuditResource =
  | 'stats'
  | 'news'
  | 'academic_records'
  | 'donation_links'
  | 'media'
  | 'users'
  | 'system';

export interface IAuditLog extends Document {
  actorId: string;              // User ID who performed the action
  actorName: string;            // User display name at time of action
  actorRole: string;
  action: string;               // e.g., "UPDATE_IMPACT_METRIC", "DELETE_ARTICLE"
  resource: AuditResource;
  resourceId?: string;          // The specific document ID affected, if any
  details?: string;             // Human-readable description
  ipAddress: string;
  userAgent?: string;
  statusCode: number;           // HTTP result of the action
  timestamp: Date;
}

const AuditLogSchema = new Schema<IAuditLog>(
  {
    actorId:    { type: String, required: true, index: true },
    actorName:  { type: String, required: true },
    actorRole:  { type: String, required: true },
    action:     { type: String, required: true, maxlength: 100, index: true },
    resource: {
      type: String,
      enum: ['stats', 'news', 'academic_records', 'donation_links', 'media', 'users', 'system'],
      required: true,
      index: true,
    },
    resourceId: { type: String, maxlength: 100 },
    details:    { type: String, maxlength: 1000 },
    ipAddress:  { type: String, required: true, maxlength: 60 },
    userAgent:  { type: String, maxlength: 300 },
    statusCode: { type: Number, required: true },
    timestamp:  { type: Date, required: true, default: Date.now, index: true },
  },
  {
    // Disable updatedAt — this model is strictly append-only
    timestamps: { createdAt: false, updatedAt: false },
    strict: true,
  }
);

// Range index for time-based lookups and admin dashboard queries
AuditLogSchema.index({ timestamp: -1 });
AuditLogSchema.index({ actorId: 1, timestamp: -1 });
AuditLogSchema.index({ resource: 1, timestamp: -1 });

// TTL: auto-delete logs older than 2 years (optional — adjust as needed)
// Uncomment to enable:
// AuditLogSchema.index({ timestamp: 1 }, { expireAfterSeconds: 63072000 });

export const AuditLog =
  models.AuditLog || model<IAuditLog>('AuditLog', AuditLogSchema);
