// aiRoutes.js - Add this file to your backend
import express from 'express';
import {
  generateHypotheticalScenarioQuestion,
  generateTermLearningQuestion,
  generateIndustryExtrapolationQuestion,
  answerEconomicConceptQuestion
} from '../controllers/learningController.js';

const router = express.Router();

// Endpoint for generating a hypothetical scenario question
router.post('/hypothetical-question', async (req, res) => {
  try {
    const { paragraph } = req.body;
    
    if (!paragraph) {
      return res.status(400).json({ error: 'Missing paragraph in request body' });
    }
    
    const question = await generateHypotheticalScenarioQuestion(paragraph);
    res.json({ question });
  } catch (error) {
    console.error('Error generating hypothetical question:', error);
    res.status(500).json({ error: 'Failed to generate question' });
  }
});

// Endpoint for generating a term learning question
router.post('/term-question', async (req, res) => {
  try {
    const { paragraph } = req.body;
    
    if (!paragraph) {
      return res.status(400).json({ error: 'Missing paragraph in request body' });
    }
    
    const question = await generateTermLearningQuestion(paragraph);
    res.json({ question });
  } catch (error) {
    console.error('Error generating term question:', error);
    res.status(500).json({ error: 'Failed to generate question' });
  }
});

// Endpoint for generating an industry extrapolation question
router.post('/industry-question', async (req, res) => {
  try {
    const { paragraph } = req.body;
    
    if (!paragraph) {
      return res.status(400).json({ error: 'Missing paragraph in request body' });
    }
    
    const question = await generateIndustryExtrapolationQuestion(paragraph);
    res.json({ question });
  } catch (error) {
    console.error('Error generating industry question:', error);
    res.status(500).json({ error: 'Failed to generate question' });
  }
});

// Endpoint for answering economic concept questions
router.post('/answer-question', async (req, res) => {
  try {
    const { question } = req.body;
    
    if (!question) {
      return res.status(400).json({ error: 'Missing question in request body' });
    }
    
    const answer = await answerEconomicConceptQuestion(question);
    res.json({ answer });
  } catch (error) {
    console.error('Error generating answer:', error);
    res.status(500).json({ error: 'Failed to generate answer' });
  }
});

export default router;