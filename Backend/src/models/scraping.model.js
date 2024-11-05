import mongoose from 'mongoose';

const FinancialDataSchema = new mongoose.Schema({
  symbol: String,
  name: String,
  price: Number,
  change: Number,
  percentChange: Number,
  source: String,
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model('FinancialData', FinancialDataSchema);