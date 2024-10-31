import React, { useState, useEffect } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Avatar, Card } from "@nextui-org/react";
import { CartIcon } from '../icons/CartIcon';

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
  const [selectedContributor, setSelectedContributor] = useState(initialContributor);

  // Update selected contributor when modal opens or initialContributor changes
  useEffect(() => {
    if (isOpen && initialContributor) {
      setSelectedContributor(initialContributor);
    }
  }, [isOpen, initialContributor]);

  const selectedNote = notes.find(note => note.contributor === selectedContributor);

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      size="3xl"
      scrollBehavior="outside"
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
                {/* Left sidebar - Contributors */}
                <Card className="w-1/3 rounded-none border-r border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 shadow-none">
                  {notes.map(note => (
                    <Button
                      key={note.contributor}
                      className={`flex justify-start items-center h-16 px-4 rounded-none ${
                        selectedContributor === note.contributor
                          ? 'bg-default-100 dark:bg-default-50'
                          : 'bg-transparent hover:bg-default-50 dark:hover:bg-default-100'
                      }`}
                      onClick={() => setSelectedContributor(note.contributor)}
                      variant="light"
                    >
                      <Avatar
                        src={note.imageUrl}
                        alt={note.contributor}
                        className="mr-3"
                        size="sm"
                      />
                      <span className={`text-sm font-medium ${
                        selectedContributor === note.contributor
                          ? 'text-primary'
                          : 'text-default-700 dark:text-default-500'
                      }`}>
                        {note.contributor}
                      </span>
                    </Button>
                  ))}
                </Card>

                {/* Right content - Notes */}
                <div className="flex-1 overflow-y-auto">
                  {selectedNote && (
                    <div className="p-6">
                      <div className="flex items-center mb-4">
                        <Avatar
                          src={selectedNote.imageUrl}
                          alt={selectedNote.contributor}
                          className="mr-3"
                          size="lg"
                        />
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                          {selectedNote.contributor}
                        </h3>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                        {selectedNote.text}
                      </p>
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
