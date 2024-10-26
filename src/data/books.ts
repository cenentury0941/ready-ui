import extremeOwnership from '../assets/extreme_ownership.jpg';
import infiniteGame from '../assets/infinite_game.png';
import innovatorsDilemma from '../assets/innovators_dilemma.jpg';
import moonshot from '../assets/moonshot.jpg';
import thinkingFastSlow from '../assets/thinking_fast_slow.jpg';
import unreasonable from '../assets/unreasonable.jpg';
import kevinWatkins from '../assets/kevin_watkins.png';
import rajeev from '../assets/rajeev.jpeg';
import sharanGurunathan from '../assets/sharan_gurunathan.png';
import sujithra from '../assets/sujithra.jpeg';
import caitlin from '../assets/caitlin.jpg';

export const books = [
  {
    id: '1e7b9f1e-8f3b-4c2a-9f1e-1e7b9f1e8f3b',
    title: 'Extreme Ownership',
    author: 'Jocko Willink',
    thumbnail: extremeOwnership,
    notes: [
      { text: "Discipline equals freedom.", contributor: "Kevin Watkins", imageUrl: kevinWatkins },
      { text: "Leadership is about taking responsibility.", contributor: "Kevin Watkins", imageUrl: kevinWatkins }
    ]
  },
  {
    id: '2f8c0a2f-9d4c-5b3a-8c2f-2f8c0a2f9d4c',
    title: 'The Infinite Game',
    author: 'Simon Sinek',
    thumbnail: infiniteGame,
    notes: [
      { text: "Start with why.", contributor: "Rajeev Ramesh", imageUrl: rajeev },
      { text: "The goal is not to beat your competition, but to outlast them.", contributor: "Rajeev Ramesh", imageUrl: rajeev }
    ]
  },
  {
    id: '3g9d1b3g-0e5d-6c4b-9d3g-3g9d1b3g0e5d',
    title: 'The Innovator\'s Dilemma',
    author: 'Clayton Christensen',
    thumbnail: innovatorsDilemma,
    notes: [
      { text: "Disrupt yourself before others do.", contributor: "Sharan Gurunathan", imageUrl: sharanGurunathan },
      { text: "Innovation is the only way to win.", contributor: "Sharan Gurunathan", imageUrl: sharanGurunathan }
    ]
  },
  {
    id: '4h0e2c4h-1f6e-7d5c-0e4h-4h0e2c4h1f6e',
    title: 'Moonshot',
    author: 'Richard Wiseman',
    thumbnail: moonshot,
    notes: [
      { text: "Shoot for the moon. Even if you miss, you'll land among the stars.", contributor: "Sujithra Gunasekaran", imageUrl: sujithra },
      { text: "Dream big, start small.", contributor: "Sujithra Gunasekaran", imageUrl: sujithra }
    ]
  },
  {
    id: '5i1f3d5i-2g7f-8e6d-1f5i-5i1f3d5i2g7f',
    title: 'Thinking, Fast and Slow',
    author: 'Daniel Kahneman',
    thumbnail: thinkingFastSlow,
    notes: [
      { text: "We are what we repeatedly do.", contributor: "Caitlin Schuman", imageUrl: caitlin },
      { text: "Thinking is the hardest work there is.", contributor: "Caitlin Schuman", imageUrl: caitlin }
    ]
  },
  {
    id: '6j2g4e6j-3h8g-9f7e-2g6j-6j2g4e6j3h8g',
    title: 'Unreasonable Hospitality',
    author: 'Will Guidara',
    thumbnail: unreasonable,
    notes: [
      { text: "Hospitality is about making people feel good.", contributor: "Kevin Watkins", imageUrl: kevinWatkins },
      { text: "The unreasonable man adapts the world to himself.", contributor: "Kevin Watkins", imageUrl: kevinWatkins }
    ]
  }
];
