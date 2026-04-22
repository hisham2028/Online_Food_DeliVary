import mongoose from "mongoose";

class UserModel {
  constructor() {
    this.schema = new mongoose.Schema({
      name: { type: String, required: true },
      email: { type: String, required: true, unique: true },
      password: { type: String, required: true },
      cartData: { type: Object, default: {} },
      provider: { type: String, enum: ['local', 'google', 'facebook'], default: 'local' },
      firebaseUid: { type: String, sparse: true },
      photoURL: { type: String, default: '' },
      isVerified: { type: Boolean, default: false },           // ✅ new
      verificationToken: { type: String },                     // ✅ new
      verificationTokenExpire: { type: Date },                 // ✅ new
      resetPasswordToken: { type: String },
      resetPasswordExpire: { type: Date }
    }, { 
      minimize: false, 
      timestamps: true
    });

    this.model = mongoose.models.user || mongoose.model("user", this.schema);
  }

  async create(userData) {
    const user = new this.model(userData);
    return await user.save();
  }

  async findById(id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return null;
    }
    const objectId = new mongoose.Types.ObjectId(id);
    return await this.model.findById(objectId);
  }

  async findByEmail(email) {
    if (typeof email !== "string") {
      return null;
    }

    const normalizedEmail = email.trim();
    const escapedEmail = normalizedEmail.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    return await this.model.findOne({
      email: { $regex: new RegExp(`^${escapedEmail}$`, 'i') }
    });
  }

  async findByVerificationToken(token) {
    return await this.model.findOne({
      verificationToken: token,
      verificationTokenExpire: { $gt: Date.now() }
    });
  }

  async updateById(id, updateData) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return null;
    }
    const objectId = new mongoose.Types.ObjectId(id);
    return await this.model.findByIdAndUpdate(objectId, updateData, { new: true });
  }

  async deleteById(id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return null;
    }
    const objectId = new mongoose.Types.ObjectId(id);
    return await this.model.findByIdAndDelete(objectId);
  }

  async updateCart(userId, cartData) {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return null;
    }
    const objectId = new mongoose.Types.ObjectId(userId);
    return await this.model.findByIdAndUpdate(objectId, { cartData }, { new: true });
  }

  async clearCart(userId) {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return null;
    }
    const objectId = new mongoose.Types.ObjectId(userId);
    return await this.model.findByIdAndUpdate(objectId, { cartData: {} }, { new: true });
  }

  getModel() {
    return this.model;
  }
}

export default new UserModel();