import mongoose from "mongoose";

const NewsArticleSchema = new mongoose.Schema({
    ticker: {type: String, required: true},
    title: String,
    description: String,
    publishedAt: Date
}, {timestamps: true});

export default mongoose.model('NewsArticle', NewsArticleSchema);