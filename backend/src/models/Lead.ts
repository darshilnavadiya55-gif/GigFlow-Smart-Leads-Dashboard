import mongoose, { Document, Schema } from 'mongoose';
import { ILead } from '../types/lead';

interface ILeadDocument extends Omit<ILead, '_id' | 'createdBy'>, Document {
  createdBy: mongoose.Types.ObjectId;
}

const leadSchema = new Schema<ILeadDocument>(
  {
    name: {
      type: String,
      required: [true, 'Lead name is required'],
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [100, 'Name cannot exceed 100 characters'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Invalid email format'],
      lowercase: true
    },
    status: {
      type: String,
      enum: {
        values: ['New', 'Contacted', 'Qualified', 'Lost'],
        message: 'Status must be one of: New, Contacted, Qualified, Lost'
      },
      default: 'New'
    },
    source: {
      type: String,
      enum: {
        values: ['Website', 'Instagram', 'Referral'],
        message: 'Source must be one of: Website, Instagram, Referral'
      },
      required: [true, 'Source is required']
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  { timestamps: true }
);

// Index for better query performance
leadSchema.index({ createdBy: 1, createdAt: -1 });
leadSchema.index({ status: 1, source: 1 });
leadSchema.index({ email: 1 });

export const Lead = mongoose.model<ILeadDocument>('Lead', leadSchema);
