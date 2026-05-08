import mongoose, { Schema, type InferSchemaType, type Model } from 'mongoose';

const sentimentValues = ['Positive', 'Neutral', 'Negative'] as const;
const directionValues = ['inbound', 'outbound'] as const;
const outcomeValues = ['booked', 'callback', 'missed'] as const;
const callTypeValues = ['phone_call', 'web_call'] as const;

const CallSchema = new Schema(
  {
    call_id: { type: String, required: true, unique: true },
    call_type: {
      type: String,
      enum: callTypeValues,
      default: 'phone_call',
    },
    from_number: { type: String, default: '' },
    to_number: { type: String, default: '' },
    start_time: { type: Date, required: true, index: true },
    duration_sec: { type: Number, required: true, default: 0 },
    sentiment: {
      type: String,
      required: true,
      enum: sentimentValues,
    },
    direction: {
      type: String,
      required: true,
      enum: directionValues,
    },
    outcome: {
      type: String,
      required: true,
      enum: outcomeValues,
    },
    created_at: { type: Date, required: true, default: () => new Date() },
  },
  {
    versionKey: false,
    strict: true,
  }
);

CallSchema.index({ start_time: -1 });

export type CallDocument = InferSchemaType<typeof CallSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const Call: Model<CallDocument> =
  mongoose.models.Call ?? mongoose.model<CallDocument>('Call', CallSchema);
