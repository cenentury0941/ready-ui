import React, { useState, useEffect } from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Avatar,
  Card,
  Input
} from "@nextui-org/react";
import { CartIcon } from '../icons/CartIcon';
import { useMsal } from '@azure/msal-react';
import { getUserIdToken } from '../utils/authUtils';

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

interface NotesModalProps {
  isOpen: boolean;
  onClose: () => void;
  notes: Note[];
  book: Book;
  isInCart: boolean;
  onAddToCart: (bookId: string) => void;
  initialContributor: string;
}

const NotesModal: React.FC<NotesModalProps> = ({
  isOpen,
  onClose,
  notes,
  book,
  isInCart,
  onAddToCart,
  initialContributor
}) => {
  const [selectedNoteIndex, setSelectedNoteIndex] = useState<number | null>(null);
  const [noteText, setNoteText] = useState('');
  const [notesList, setNotesList] = useState<Note[]>(notes);
  const { instance, accounts } = useMsal();
  const [isAddingNote, setIsAddingNote] = useState<boolean>(true);

  useEffect(() => {
    if (isOpen) {
      setIsAddingNote(true);
      setSelectedNoteIndex(null);
    }
  }, [isOpen]);

  const handleNoteSubmit = async () => {
    try {
      const idToken = await getUserIdToken(instance);
      const apiUrl = process.env.REACT_APP_API_URL;
      if (!apiUrl) {
        console.error('API URL is not configured');
        return;
      }
      const newNote: Note = {
        text: noteText,
        contributor: accounts[0]?.name || 'Anonymous',
        imageUrl: '', // Adjust as needed to fetch the user's image URL
      };
      const response = await fetch(`${apiUrl}/books/${book.id}/notes`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${idToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newNote),
      });
      if (!response.ok) {
        throw new Error('Failed to add note');
      }
      setNotesList(prevNotes => [...prevNotes, newNote]);
      setNoteText('');
      setIsAddingNote(false);
    } catch (error) {
      console.error('Error submitting note:', error);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="3xl"
      scrollBehavior="outside"
      backdrop="blur"
      classNames={{
        base: "bg-white dark:bg-gray-900",
        header: "border-b border-gray-200 dark:border-gray-800",
        body: "p-0",
        footer: "border-t border-gray-200 dark:border-gray-800",
        closeButton: "hover:bg-default-100 active:bg-default-200"
      }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex gap-4 items-start">
              <img
                src={book.thumbnail}
                alt={book.title}
                className="w-16 h-auto object-contain rounded"
              />
              <div className="flex-grow">
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-1">{book.title}</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{book.author}</p>
                <button
                  className={`self-start flex items-center text-sm font-medium ${
                    isInCart
                      ? 'text-red-500 hover:text-red-600'
                      : 'text-blue-500 hover:text-blue-600'
                  }`}
                  onClick={() => onAddToCart(book.id)}
                >
                  <CartIcon size={16} className='mr-2' />
                  {isInCart ? 'Remove from Cart' : 'Add to Cart'}
                </button>
              </div>
            </ModalHeader>
            <ModalBody>
              <div className="flex h-[400px]">
                <Card className="w-1/3 rounded-none border-r border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 shadow-none">
                  {notesList.map((note, index) => (
                    <Button
                      key={`${note.contributor}-${index}`}
                      className={`flex justify-start items-center h-16 px-4 rounded-none ${
                        selectedNoteIndex === index && !isAddingNote
                          ? 'bg-default-100 dark:bg-default-50'
                          : 'bg-transparent hover:bg-default-50 dark:hover:bg-default-100'
                      }`}
                      onClick={() => {
                        setSelectedNoteIndex(index);
                        setIsAddingNote(false);
                      }}
                      variant="light"
                    >
                      <Avatar
                        src={note.imageUrl}
                        alt={note.contributor}
                        className="mr-3"
                        size="sm"
                      />
                      <span className={`text-sm font-medium ${
                        selectedNoteIndex === index && !isAddingNote
                          ? 'text-primary'
                          : 'text-default-700 dark:text-default-500'
                      }`}>
                        {note.contributor}
                      </span>
                    </Button>
                  ))}
                  <Button
                    className={`flex justify-start items-center h-16 px-4 rounded-none ${
                      isAddingNote
                        ? 'bg-default-100 dark:bg-default-50'
                        : 'bg-transparent hover:bg-default-50 dark:hover:bg-default-100'
                    }`}
                    onClick={() => {
                      setIsAddingNote(true);
                      setSelectedNoteIndex(null);
                    }}
                    variant="light"
                  >
                    <span className="text-sm font-medium text-default-700 dark:text-default-500">
                      Add Note
                    </span>
                  </Button>
                </Card>

                <div className="flex-1 overflow-y-auto">
                  {isAddingNote ? (
                    <div className="p-6">
                      <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100">Add Your Note</h3>
                      <Input
                        placeholder="Write your note here..."
                        value={noteText}
                        onChange={(e) => setNoteText(e.target.value)}
                        fullWidth
                        className="mb-4"
                      />
                      <Button onClick={handleNoteSubmit} disabled={!noteText}>
                        Submit Note
                      </Button>
                    </div>
                  ) : selectedNoteIndex !== null ? (
                    <div className="p-6">
                      <div className="flex items-center mb-4">
                        <Avatar
                          src={notesList[selectedNoteIndex].imageUrl}
                          alt={notesList[selectedNoteIndex].contributor}
                          className="mr-3"
                          size="lg"
                        />
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                          {notesList[selectedNoteIndex].contributor}
                        </h3>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap mb-8">
                        {notesList[selectedNoteIndex].text}
                      </p>
                    </div>
                  ) : (
                    <div className="p-6">
                      <p className="text-gray-700 dark:text-gray-300">Select a note or add a new one.</p>
                    </div>
                  )}
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button
                color="default"
                variant="light"
                onPress={onClose}
              >
                Close
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default NotesModal;
