import React, { useState, useContext } from 'react';
import { TokenContext } from '../components/TokenContext';

export default function Quiz() {
  const { addTokens } = useContext(TokenContext);
  const [score, setScore] = useState(null);

  const questions = [
    { q: 'What is 1/2 + 1/2?', a: '1' },
    { q: 'What is the numerator in 3/4?', a: '3' },
    { q: 'What is the denominator in 2/5?', a: '5' },
  ];

  const [answers, setAnswers] = useState({});

  const handleChange = (index, value) => {
    setAnswers({ ...answers, [index]: value });
  };

  const handleSubmit = () => {
    let correct = 0;
    questions.forEach((q, i) => {
      if (answers[i]?.trim() === q.a) correct++;
    });
    setScore(correct);
    if (correct >= 2) addTokens(10);
  };

  return (
    <div className="page">
      <h2>Quiz Time</h2>
      {questions.map((q, i) => (
        <div key={i}>
          <p>{q.q}</p>
          <input
            type="text"
            placeholder="Your answer"
            onChange={(e) => handleChange(i, e.target.value)}
          />
        </div>
      ))}
      <button onClick={handleSubmit}>Submit</button>
      {score !== null && (
        <p>
          You got {score}/{questions.length} correct. 
          {score >= 2 ? ' 🎉 You earned 10 $READS!' : ' Try again to earn tokens.'}
        </p>
      )}
    </div>
  );
}