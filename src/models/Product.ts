import mongoose, { Schema, models, model } from "mongoose";

const reviewSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    rating: Number,

    comment: String,
  },
  { timestamps: true }
);

const variantSchema = new Schema(
  {
    color: String,
    storage: String,
    ram: String,
    price: Number,
    stock: Number,
    sku: String,
  },
  { _id: false }
);

const productSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
    },

    description: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },

    discountPrice: {
      type: Number,
    },

    images: [
      {
        type: String,
      },
    ],

    category: {
      type: String,
      required: true,
    },

    brand: {
      type: String,
      required: true,
    },

    stock: {
      type: Number,
      required: true,
    },

    rating: {
      type: Number,
      default: 0,
    },

    reviews: [reviewSchema],

    variants: [variantSchema],

    isFeatured: {
      type: Boolean,
      default: false,
    },

    isPublished: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Product = models.Product || model("Product", productSchema);

export default Product;