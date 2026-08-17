import mongoose from 'mongoose';

const offerSchema = new mongoose.Schema({
    title: { type: String, required: true },
    subtitle: { type: String, default: '' },
    code: { type: String, default: '' },
    badge: { type: String, default: 'SPECIAL DEAL' },
    image: { type: String, default: '' },
    bgGradient: { type: String, default: 'from-emerald-600 to-teal-800' },
    active: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now }
});

const Offer = mongoose.models.Offer || mongoose.model('Offer', offerSchema);

export default Offer;
