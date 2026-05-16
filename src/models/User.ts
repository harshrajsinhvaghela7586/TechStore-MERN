import mongoose, { Schema, models, model } from "mongoose";

const addressSchema = new Schema(
  {
    fullName: String,
    phone: String,
    city: String,
    state: String,
    country: String,
    postalCode: String,
    addressLine1: String,
    addressLine2: String,
  },
  { _id: false }
);

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
isBlocked: {
      type: Boolean,
      default: false,
    },
  
    addresses: [addressSchema],

    profileImage: {
      type: String,
      default: "",
    },
  
  resetOtp: {
  type: String,
},

resetOtpExpiry: {
  type: Date,
},
resetOtpLastSentAt: {
  type: Date,
  default: null,
},
emailVerifyOtp: {
  type: String,
  default: null,
},

emailVerifyOtpExpiry: {
  type: Date,
  default: null,
},

emailVerifyOtpLastSentAt: {
  type: Date,
  default: null,
},

isEmailVerified: {
  type: Boolean,
  default: false,
},
},
  {
    timestamps: true,
  }
);

const User = models.User || model("User", userSchema);

export default User;