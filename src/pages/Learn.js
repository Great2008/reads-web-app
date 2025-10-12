import React from 'react';
import { Link } from 'react-router-dom';

export default function Learn() {
  return (
    <div className="page">
      <h2>Lesson: Understanding Fractions</h2>
      <p>
        A fraction represents a part of a whole. It is written as one number over another, like ½ or ¾. 
        The top number (numerator) shows how many parts we have, while the bottom (denominator) shows 
        how many equal parts make up the whole.
      </p>
      <Link to="/quiz" className="btn">Take Quiz</Link>
    </div>
  );
}