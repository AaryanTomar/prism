import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();


const genAI = new GoogleGenerativeAI(`${process.env.GEMINI_API_KEY}`);
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

// Function 1: Generate a hypothetical scenario question
async function generateHypotheticalScenarioQuestion(paragraph) {
    const prompt = `Based on the following text, create a one-sentence question about a hypothetical economic scenario related to the company in the text and how they might be affected specifically by something mentioned in the paragraph, such as tariffs, interest rates, trade wars, etc:\n\n"${paragraph}"`;
    const response = await model.generateContent(prompt, {max_tokens: 50});
    return response.response.text();
}

// Function 2: Generate a question to learn about a specific term
async function generateTermLearningQuestion(paragraph) {
    const prompt = `Based on the following text, create a one-sentence question asking to learn about a specific economic term or concept mentioned in the text in the format similar to \'What is a trade war?\' or \'what are tariffs?\':\n\n"${paragraph}"`;
    const response = await model.generateContent(prompt, {max_tokens: 50});
    return response.response.text();
}

// Function 3: Generate a question to extrapolate facts to the industry
async function generateIndustryExtrapolationQuestion(paragraph) {
    const prompt = `Based on the following text, create a one-sentence question asking to extrapolate some fact in the text to the industry of the company:\n\n"${paragraph}"`;
    const response = await model.generateContent(prompt, {max_tokens: 50});
    return response.response.text();
}

// Function 4: Answer a user question about an economic concept
async function answerEconomicConceptQuestion(userQuestion) {
    const prompt = `Do not use any formatting, such as bolding. You are a finance expert. Answer the following question in 3-4 sentences in layman's terms. :\n\n"${userQuestion}"`;
    const response = await model.generateContent(prompt, {max_tokens: 150});
    return response.response.text();
}

export {
    generateHypotheticalScenarioQuestion,
    generateTermLearningQuestion,
    generateIndustryExtrapolationQuestion,
    answerEconomicConceptQuestion,
};