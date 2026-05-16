import mongoose, {
  Schema,
  models,
  model,
} from "mongoose";

const cartItemSchema = new Schema(
  {
    product: {
      type:
        mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    quantity: {
      type: Number,
      required: true,
      default: 1,
    },
  },
  {
    _id: false,
  }
);

const cartSchema = new Schema(
  {
    user: {
      type:
        mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    items: [cartItemSchema],
  },
  {
    timestamps: true,
  }
);

const Cart =
  models.Cart ||
  model("Cart", cartSchema);

export default Cart;