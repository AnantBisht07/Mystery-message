import mongoose, { Schema, Document } from "mongoose";
// { Document } → TypeScript interface for MongoDB documents, helping with type safety.

// Define the TypeScript interface for a Message document
export interface Message extends Document {
  content: string;
  createdAt: Date;
}

// it means <> konsa schema hai(we wrote custome schema) means kahi or schema use ho to same syntax follow ho.
// Define the Mongoose schema for the Message model
const MessageSchema: Schema<Message> = new Schema({
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

// Define the TypeScript interface for a User document
export interface User extends Document {
  username: string;
  email: string;
  password: string;
  verifyCode: string;
  verifyCodeExpiry: Date;
  isVerified: boolean;
  isAcceptingMessage: boolean;
  messages: Message[];
}

const UserSchema: Schema<User> = new Schema({
  username: {
    type: String,
    required: [true, "Username is required"], // custom msg,
    trim: true, // kisi ne extra space de die to trim hojyega
    unique: true,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    match: [/.+\@.+\..+/, "Please use a valid email address"], // valid email testing(via regular expression; regex)
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  verifyCode: {
    type: String,
    required: [true, "Verify code is required"],
  },
  verifyCodeExpiry: {
    type: Date,
    required: [true, "Expiry code is required"],
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  isAcceptingMessage: {
    type: Boolean,
    default: true,
  },
  messages: [MessageSchema],
});

const UserModel =
  (mongoose.models.User as mongoose.Model<User>) ||
  mongoose.model<User>("User", UserSchema);
// ✔ If the User model already exists → Use the existing one.
// ✔ If it doesn’t exist → Create and register a new one.

export default UserModel;
