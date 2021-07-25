const {Schema} = require("mongoose");
const conn = require("../../lib/mongo");

const ProductSchema = new Schema({
    name: String,
    price: Number,
    quantity: Number,
})

const SellerSchema = new Schema({
    id: Number,
    siren: String,
    society: String,
    urlRedirectConfirm: String,
    urlRedirectCancel: String,
    currency: String,
    active: Boolean,
})

const OperationHistorySchema = new Schema({
    finish: Boolean,
    createdAt: Date,
    updatedAt: Date
})

const OperationSchema = new Schema({
    price: Number,
    quotation: String,
    status: String,
    finish: Boolean,
    OperationHistories: [OperationHistorySchema],
    createdAt: Date,
    updatedAt: Date
})

const TransactionHistorySchema = new Schema({
    date: Date,
    status: String,
    createdAt: Date,
    updatedAt: Date
})

const TransactionSchema = new Schema({
    id: Number,
    facturationAddress: String,
    deliveryAddress: String,
    cart: [ProductSchema],
    cb: String,
    amount: Number,
    currency: String,
    status: String,
    Operations: [OperationSchema],
    TransactionHistories: [TransactionHistorySchema],
    Seller: SellerSchema,
    createdAt: Date,
    updatedAt: Date
});

const Transaction = conn.model("Transaction", TransactionSchema);

module.exports = Transaction;
