import React, { useState } from 'react';
import './App.css';
import InspirationNotes from './InspirationNotes';
import extremeOwnership from './assets/extreme_ownership.jpg';
import infiniteGame from './assets/infinite_game.png';
import innovatorsDilemma from './assets/innovators_dilemma.jpg';
import moonshot from './assets/moonshot.jpg';
import thinkingFastSlow from './assets/thinking_fast_slow.jpg';
import unreasonable from './assets/unreasonable.jpg';
import kevinWatkins from './assets/kevin_watkins.png';
import rajeev from './assets/rajeev.jpeg';
import sharanGurunathan from './assets/sharan_gurunathan.png';
import sujithra from './assets/sujithra.jpeg';
import caitlin from './assets/caitlin.jpg';

const books = [
  { 
    title: 'Extreme Ownership', 
    author: 'Jocko Willink', 
    thumbnail: extremeOwnership,
    notes: [
      { text: "Discipline equals freedom.", contributor: "Kevin Watkins", imageUrl: kevinWatkins },
      { text: "Leadership is about taking responsibility.", contributor: "Kevin Watkins", imageUrl: kevinWatkins }
    ]
  },
  { 
    title: 'The Infinite Game', 
    author: 'Simon Sinek', 
    thumbnail: infiniteGame,
    notes: [
      { text: "Start with why.", contributor: "Rajeev Ramesh", imageUrl: rajeev },
      { text: "The goal is not to beat your competition, but to outlast them.", contributor: "Rajeev Ramesh", imageUrl: rajeev }
    ]
  },
  { 
    title: 'The Innovator\'s Dilemma', 
    author: 'Clayton Christensen', 
    thumbnail: innovatorsDilemma,
    notes: [
      { text: "Disrupt yourself before others do.", contributor: "Sharan Gurunathan", imageUrl: sharanGurunathan },
      { text: "Innovation is the only way to win.", contributor: "Sharan Gurunathan", imageUrl: sharanGurunathan }
    ]
  },
  { 
    title: 'Moonshot', 
    author: 'Richard Wiseman', 
    thumbnail: moonshot,
    notes: [
      { text: "Shoot for the moon. Even if you miss, you'll land among the stars.", contributor: "Sujithra Gunasekaran", imageUrl: sujithra },
      { text: "Dream big, start small.", contributor: "Sujithra Gunasekaran", imageUrl: sujithra }
    ]
  },
  { 
    title: 'Thinking, Fast and Slow', 
    author: 'Daniel Kahneman', 
    thumbnail: thinkingFastSlow,
    notes: [
      { text: "We are what we repeatedly do.", contributor: "Caitlin Schuman", imageUrl: caitlin },
      { text: "Thinking is the hardest work there is.", contributor: "Caitlin Schuman", imageUrl: caitlin }
    ]
  },
  { 
    title: 'Unreasonable Hospitality', 
    author: 'Will Guidara', 
    thumbnail: unreasonable,
    notes: [
      { text: "Hospitality is about making people feel good.", contributor: "Kevin Watkins", imageUrl: kevinWatkins },
      { text: "The unreasonable man adapts the world to himself.", contributor: "Kevin Watkins", imageUrl: kevinWatkins }
    ]
  }
];

const RecommendedBooks: React.FC = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div className="recommended-books">
      {books.map((book, index) => (
        <div
          key={index}
          className="book-card"
          onMouseEnter={() => setHoveredIndex(index)}
          onMouseLeave={() => setHoveredIndex(null)}
          onClick={() => setHoveredIndex(index)}
        >
          <img src={book.thumbnail} alt={`${book.title} cover`} className="book-thumbnail" />
          <div className="book-info">
            <h3 className="book-title">{book.title}</h3>
            <p className="book-author">{book.author}</p>
          </div>
          <InspirationNotes notes={book.notes} />
          {hoveredIndex === index && (
            <button className="add-to-cart-button">Add to Cart</button>
          )}
        </div>
      ))}
    </div>
  );
};

export default RecommendedBooks;
