import React, { useState } from 'react';
import { Avatar, Card } from "@nextui-org/react";
import NotesModal from './components/NotesModal';

interface Note {
  text: string;
  contributor: string;
  imageUrl: string;
}

interface Book {
  id: string;
  title: string;
  author: string;
  thumbnail: string;
  about: string;
}

interface InspirationNotesProps {
  notes: Note[];
  book: Book;
  isInCart: boolean;
  onAddToCart: (bookId: string) => void;
}

const InspirationNotes: React.FC<InspirationNotesProps> = ({ notes, book, isInCart, onAddToCart }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedContributor, setSelectedContributor] = useState<string>('');

  const handleNoteClick = (contributor: string) => {
    setSelectedContributor(contributor);
    setIsModalOpen(true);
  };

  if (notes.length === 0) {
    return null;
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {notes.slice(0, 4).map((note, index) => (
          <Card
            key={`${note.contributor}-${index}`}
            isPressable
            onPress={() => handleNoteClick(note.contributor)}
            classNames={{
              base: "bg-default-50 dark:bg-default-100 shadow-none w-full"
            }}
          >
            <div className="p-3 w-full">
              <div className="flex items-center gap-2 mb-2 w-full">
                <Avatar
                  src={note.imageUrl}
                  alt={note.contributor}
                  className="flex-shrink-0"
                  size="sm"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-left font-medium text-sm text-default-700 dark:text-default-500 truncate">
                    {note.contributor}
                  </p>
                </div>
              </div>
              <div className="min-w-0 w-full">
                <p className="text-left text-sm text-default-600 dark:text-default-400 truncate">
                  {note.text}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <NotesModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        notes={notes}
        book={book}
        isInCart={isInCart}
        onAddToCart={onAddToCart}
        initialContributor={selectedContributor}
      />
    </>
  );
};

export default InspirationNotes;
