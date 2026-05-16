import mongoose from "mongoose";

const orderItemSchema =
  new mongoose.Schema({
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    title: {
      type: String,
      required: true,
    },

    image: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },

    quantity: {
      type: Number,
      required: true,
    },
  });

const shippingAddressSchema =
  new mongoose.Schema({
    fullName: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
      required: true,
    },

    address: {
      type: String,
      required: true,
    },

    city: {
      type: String,
      required: true,
    },

    pincode: {
      type: String,
      required: true,
    },
  });

const orderSchema =
  new mongoose.Schema(
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },

      orderItems: [
        orderItemSchema,
      ],

      shippingAddress:
        shippingAddressSchema,

      paymentMethod: {
        type: String,
        default: "Stripe",
      },

      paymentStatus: {
        type: String,
        enum: [
          "Pending",
          "Paid",
          "Failed",
        ],

        default: "Pending",
      },

      orderStatus: {
        type: String,
        enum: [
          "Processing",
          "Shipped",
          "Delivered",
          "Cancelled",
        ],

        default: "Processing",
      },

      totalPrice: {
        type: Number,
        required: true,
      },

      stripeSessionId: {
        type: String,
      },
    },
    {
      timestamps: true,
    }
  );

export default mongoose.models.Order ||
  mongoose.model(
    "Order",
    orderSchema
  );