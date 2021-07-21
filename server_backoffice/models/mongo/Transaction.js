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
    date: Date,
    state: String,
    createdAt: Date,
    updatedAt: Date
})

const OperationSchema = new Schema({
    cb: String,
    price: Number,
    quotation: String,
    status: String,
    state: String,
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
    facturationAddress: String,
    deliveryAddress: String,
    cart: [ProductSchema],
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
