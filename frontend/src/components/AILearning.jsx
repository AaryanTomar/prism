import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AILearning({ ticker, profile, stockData }) {
  const [questions, setQuestions] = useState({
    hypothetical: '',
    term: '',
    industry: ''
  });
  const [selectedQuestion, setSelectedQuestion] = useState('');
  const [customQuestion, setCustomQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (ticker && profile) {
      generateQuestions();
    }
  }, [ticker, profile]);

  const generateQuestions = async () => {
    setLoading(true);
    setError(null);
    try {
      const companyParagraph = createCompanyParagraph();
      
      const [hypotheticalRes, termRes, industryRes] = await Promise.all([
        axios.post('http://localhost:3000/api/ai/hypothetical-question', { paragraph: companyParagraph }),
        axios.post('http://localhost:3000/api/ai/term-question', { paragraph: companyParagraph }),
        axios.post('http://localhost:3000/api/ai/industry-question', { paragraph: companyParagraph })
    ]);
      
      setQuestions({
        hypothetical: hypotheticalRes.data.question,
        term: termRes.data.question,
        industry: industryRes.data.question
      });
    } catch (err) {
      console.error('Error generating AI questions:', err);
      setError('Failed to generate learning questions. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const createCompanyParagraph = () => {
    return `${profile.name} (${ticker}) is a ${profile.finnhubIndustry} company with a market cap of $${(profile.marketCapitalization / 1000000000).toFixed(2)} billion. 
    The current stock price is $${stockData.c.toFixed(2)}, with a ${stockData.c > stockData.pc ? 'positive' : 'negative'} change of 
    ${Math.abs((stockData.c - stockData.pc) / stockData.pc * 100).toFixed(2)}% from the previous close. 
    The company is headquartered in ${profile.country} and employs approximately ${profile.employeeTotal} people.`;
  };

  const handleSelectQuestion = (questionType) => {
    setSelectedQuestion(questions[questionType]);
    setCustomQuestion(questions[questionType]);
  };

  const handleSubmitQuestion = async () => {
    if (!customQuestion.trim()) return;
    
    setLoading(true);
    setAnswer('');
    setError(null);
    
    try {
      const response = await axios.post('http://localhost:3000/api/ai/answer-question', { 
        question: customQuestion 
      });
      
      setAnswer(response.data.answer);
    } catch (err) {
      console.error('Error getting answer:', err);
      setError('Failed to get an answer. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  if (!ticker || !profile || !stockData) {
    return null;
  }

  return (
    <div className="ai-learning-section">
      <h2>Learn More About Finance</h2>
      
      {loading && !answer && <div className="loading">Generating content...</div>}
      {error && <div className="error">{error}</div>}
      
      {!loading && questions.hypothetical && (
        <div className="question-options">
          <h3>Select a Question to Learn From:</h3>
          <div className="question-buttons">
            <button 
              onClick={() => handleSelectQuestion('hypothetical')}
              className={selectedQuestion === questions.hypothetical ? 'active' : ''}
            >
              {questions.hypothetical}
            </button>
            <button 
              onClick={() => handleSelectQuestion('term')}
              className={selectedQuestion === questions.term ? 'active' : ''}
            >
              {questions.term}
            </button>
            <button 
              onClick={() => handleSelectQuestion('industry')}
              className={selectedQuestion === questions.industry ? 'active' : ''}
            >
              {questions.industry}
            </button>
          </div>
        </div>
      )}
      
      <div className="custom-question">
        <h3>Ask Your Own Question:</h3>
        <div className="question-input">
          <input
            type="text"
            value={customQuestion}
            onChange={(e) => setCustomQuestion(e.target.value)}
            placeholder="Type your finance question here..."
          />
          <button onClick={handleSubmitQuestion}>Ask</button>
        </div>
      </div>
      
      {answer && (
        <div className="ai-answer">
          <h3>Answer:</h3>
          <p>{answer}</p>
        </div>
      )}
    </div>
  );
}

export default AILearning;