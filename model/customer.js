const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema(
  {
    first_name: { type: String },
    last_name: { type: String },
    city: { type: String },
    company: { type: String },
  },
  {
    autoCreate: true,
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model("customer", customerSchema);
