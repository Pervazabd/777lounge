import mongoose from "mongoose";

const imageSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: true,
      trim: true,
      match: /^https?:\/\/\S+$/,
    },
    alt: {
      type: String,
      required: true,
      trim: true,
    },
    source: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { _id: false },
);

const positiveInteger = {
  validator: Number.isInteger,
  message: "Value must be a whole number.",
};

const menuItemSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      match: /^[a-z0-9-]+$/,
    },
    categoryName: {
      type: String,
      required: true,
      trim: true,
    },
    categoryOrder: {
      type: Number,
      required: true,
      min: 1,
      validate: positiveInteger,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    itemOrder: {
      type: Number,
      required: true,
      min: 1,
      validate: positiveInteger,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
      validate: Number.isInteger,
    },
    currency: {
      type: String,
      required: true,
      enum: ["TRY"],
      default: "TRY",
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    ingredients: {
      type: [{ type: String, trim: true }],
      default: [],
    },
    image: {
      type: imageSchema,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

menuItemSchema.index({ category: 1, name: 1 }, { unique: true });
menuItemSchema.index({ isActive: 1, categoryOrder: 1, itemOrder: 1 });

export const MenuItem = mongoose.model("MenuItem", menuItemSchema);
