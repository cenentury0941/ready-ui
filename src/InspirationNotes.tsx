import React, { useState, useEffect } from 'react';

interface Note {
  text: string;
  contributor: string;
  imageUrl: string;
}



interface InspirationNotesProps {
  notes: Note[];
}

const InspirationNotes: React.FC<InspirationNotesProps> = ({ notes }) => {
  const [currentNoteIndex, setCurrentNoteIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentNoteIndex((prevIndex) => (prevIndex + 1) % notes.length);
    }, Math.floor(Math.random() * (20000 - 5000 + 1)) + 5000);

    return () => clearInterval(interval);
  }, [notes.length]);

  if (notes.length === 0) {
    return <div className="inspiration-notes">No inspiration notes available.</div>;
  }

  return (
    <div className="inspiration-notes">
      <img src={notes[currentNoteIndex].imageUrl} alt={notes[currentNoteIndex].contributor} className="note-image" />
      <p className="note-text">"{notes[currentNoteIndex].text}"</p>
      <p className="note-contributor">- {notes[currentNoteIndex].contributor}</p>
    </div>
  );
};

export default InspirationNotes;
