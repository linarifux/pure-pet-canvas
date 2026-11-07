import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
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
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
    // Optional: Save shipping details to pre-fill the checkout page
    defaultShipping: {
      address: String,
      city: String,
      state: String,
      zipCode: String,
      country: { type: String, default: 'US' },
    }
  },
  {
    timestamps: true, // Automatically creates createdAt and updatedAt fields
  }
);

// Method to compare entered password with the hashed database password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Middleware: Hash the password before saving a new user or updating a password
userSchema.pre('save', async function (next) {
  // If the password field wasn't modified, skip hashing
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model('User', userSchema);

export default User;
