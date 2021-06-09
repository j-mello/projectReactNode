const { Schema } = require("mongoose");
const conn = require("../../lib/mongo");

const ProductSchema = new Schema({
  name: String,
  price: Number,
  quantity: Number,
})

const OperationHistorySchema = new Schema({
  date: Date,
  status: String,
})

const OperationSchema = new Schema({
  cb: String,
  price: Number,
  quotation: String,
  status: String,
  state: String,
  history: [OperationHistorySchema]
})

const TransactionHistorySchema = new Schema({
  date: Date,
  status: String,
})

const TransactionSchema = new Schema({
  facturationAddress: String,
  deliveryAddress: String,
  cart: [ProductSchema],
  amount: Number,
  currency: String,
  status: String,
  operation: [OperationSchema],
  history: [TransactionHistorySchema]
});

const Transaction = conn.model("Transaction", TransactionSchema);

module.exports = Transaction;
