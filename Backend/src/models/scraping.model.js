import mongoose from 'mongoose';

const FinancialDataSchema = new mongoose.Schema({
  symbol: String,
  name: String,
  price: Number,
  previousPrice: Number,
  change: Number,
  percentChange: Number,
  source: String,
  updatedAt: {
    type: Date,
    default: Date.now
  },
  updatePeriod: {
    type: String,
    enum: ['morning', 'afternoon'],
    required: true
  }
});

export default mongoose.model('FinancialData', FinancialDataSchema);