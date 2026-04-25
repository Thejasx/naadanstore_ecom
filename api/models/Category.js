import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema(
    {
        text: {
            type: String,
            required: true,
            trim: true,
        },
        path: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        image: {
            type: String,
            required: true,
        },
        bgColor: {
            type: String,
            default: '#F5F5F5',
        },
        description: {
            type: String,
            default: '',
        },
    },
    {
        timestamps: true,
    }
);

const Category = mongoose.model('Category', categorySchema);

export default Category;
