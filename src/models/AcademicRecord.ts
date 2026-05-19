/**
 * Academic Record Model
 * Stores student article metadata and achievement poster URLs.
 * IMPORTANT: Only Cloudinary secure URLs are stored here — no binary data.
 * Heavy file storage is delegated entirely to Cloudinary.
 */
import mongoose, { Schema, Document, models, model } from 'mongoose';

export type RecordType = 'article' | 'poster' | 'thesis' | 'research_paper';
export type RecordStatus = 'draft' | 'review' | 'published' | 'archived';

export interface IAcademicRecord extends Document {
  title: string;
  type: RecordType;
  status: RecordStatus;
  authorName: string;
  authorBatch?: string;           // e.g., "2022–2023"
  abstract?: string;
  // Cloudinary fields — only URLs stored, never raw files
  cloudinaryPublicId?: string;
  imageUrl?: string;              // Cloudinary optimized image URL
  documentUrl?: string;          // Cloudinary PDF/document URL
  thumbnailUrl?: string;
  tags: string[];
  isPublished: boolean;
  publishedAt?: Date;
  viewCount: number;
  createdBy: mongoose.Types.ObjectId; // Reference to User who uploaded
  createdAt: Date;
  updatedAt: Date;
}

const AcademicRecordSchema = new Schema<IAcademicRecord>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 300,
      index: 'text', // Enable full-text search on title
    },
    type: {
      type: String,
      enum: ['article', 'poster', 'thesis', 'research_paper'] as RecordType[],
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: ['draft', 'review', 'published', 'archived'] as RecordStatus[],
      default: 'draft',
      index: true,
    },
    authorName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    authorBatch: { type: String, maxlength: 50 },
    abstract: { type: String, maxlength: 2000 },
    cloudinaryPublicId: { type: String, maxlength: 255 },
    imageUrl: { type: String, maxlength: 500 },
    documentUrl: { type: String, maxlength: 500 },
    thumbnailUrl: { type: String, maxlength: 500 },
    tags: {
      type: [String],
      default: [],
      index: true,
    },
    isPublished: { type: Boolean, default: false, index: true },
    publishedAt: { type: Date },
    viewCount: { type: Number, default: 0, min: 0 },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true, strict: true }
);

// Compound index for the public listing endpoint
AcademicRecordSchema.index({ isPublished: 1, type: 1, publishedAt: -1 });
// Text index for search
AcademicRecordSchema.index({ title: 'text', abstract: 'text', authorName: 'text' });

export const AcademicRecord =
  models.AcademicRecord ||
  model<IAcademicRecord>('AcademicRecord', AcademicRecordSchema);
