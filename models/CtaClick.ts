import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const CtaClickSchema = new Schema(
  {
    cta: { type: String, required: true },
    ip: { type: String, default: "" },
    country: { type: String, default: "" },
    region: { type: String, default: "" },
    city: { type: String, default: "" },
    user_agent: { type: String, default: "" },
    referer: { type: String, default: "" },
    path: { type: String, default: "" },
    created_at: { type: Date, required: true, default: () => new Date() },
  },
  {
    versionKey: false,
    strict: true,
  }
);

export type CtaClickDocument = InferSchemaType<typeof CtaClickSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const CtaClick: Model<CtaClickDocument> =
  mongoose.models.CtaClick ??
  mongoose.model<CtaClickDocument>("CtaClick", CtaClickSchema);

