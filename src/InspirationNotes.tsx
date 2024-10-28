import React, { useState, useEffect } from 'react';
import { Avatar } from "@nextui-org/react";

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
    return null;
  }

  const currentNote = notes[currentNoteIndex];

  return (
    <div className="rounded-lg">
      <div className="flex items-start">
        <Avatar
          src={currentNote.imageUrl}
          alt={currentNote.contributor}
          className="mr-3 flex-shrink-0"
          size="sm"
        />
        <div className="flex-grow">
          <p className="font-semibold text-sm text-gray-700 dark:text-gray-300 mb-1">{currentNote.contributor}</p>
          <p className="italic text-sm text-gray-600 dark:text-gray-400">"{currentNote.text}"</p>
        </div>
      </div>
    </div>
  );
};

export default InspirationNotes;
