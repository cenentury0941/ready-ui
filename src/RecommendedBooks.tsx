import React, { useState, useRef, useEffect } from 'react';
import { useCart } from './context/CartContext';
import InspirationNotes from './InspirationNotes';
import { books } from './data/books';
import { Card, Button, Input } from "@nextui-org/react";
import { SearchIcon } from './icons/SearchIcon';
import { CartIcon } from './icons/CartIcon';

const RecommendedBooks: React.FC = () => {
  const { cartItems, addToCart } = useCart();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
  const suggestionsRef = useRef<HTMLUListElement>(null);

  const filteredBooks = books.filter(book => 
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      setSelectedSuggestionIndex(prev => Math.min(prev + 1, filteredBooks.length - 1));
    } else if (e.key === 'ArrowUp') {
      setSelectedSuggestionIndex(prev => Math.max(prev - 1, -1));
    } else if (e.key === 'Enter' && selectedSuggestionIndex !== -1) {
      const selectedBook = filteredBooks[selectedSuggestionIndex];
      setSearchTerm(`${selectedBook.title} - ${selectedBook.author}`);
      setSelectedSuggestionIndex(-1);
    }
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setSelectedSuggestionIndex(-1);
  };

  const handleSuggestionClick = (book: typeof books[0]) => {
    setSearchTerm(`${book.title} - ${book.author}`);
    setSelectedSuggestionIndex(-1);
  };

  useEffect(() => {
    if (suggestionsRef.current && selectedSuggestionIndex !== -1) {
      const selectedElement = suggestionsRef.current.children[selectedSuggestionIndex] as HTMLElement;
      selectedElement.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  }, [selectedSuggestionIndex]);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold mb-4 text-gray-800 dark:text-gray-100">Welcome to ReadY</h1>
          <p className="text-xl mb-6 text-gray-600 dark:text-gray-300">Discover your next favorite book</p>
          <div className="relative max-w-md mx-auto">
            <Input
              classNames={{
                base: "max-w-full h-10",
                mainWrapper: "h-full",
                input: "text-small",
                inputWrapper: "h-full font-normal text-default-500 bg-default-400/20 dark:bg-default-500/20",
              }}
              placeholder="Search books by title or author"
              size="sm"
              startContent={<SearchIcon size={18} />}
              type="search"
              value={searchTerm}
              onValueChange={handleSearchChange}
              onKeyDown={handleKeyDown}
            />
            {searchTerm && (
              <ul ref={suggestionsRef} className="absolute z-10 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md mt-1 shadow-lg max-h-60 overflow-y-auto">
                {filteredBooks.map((book, index) => (
                  <li
                    key={book.id}
                    className={`px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer ${index === selectedSuggestionIndex ? 'bg-gray-100 dark:bg-gray-700' : ''}`}
                    onClick={() => handleSuggestionClick(book)}
                  >
                    {book.title} - {book.author}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {filteredBooks.map((book) => (
            <Card key={book.id} className="overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 dark:bg-gray-800">
              <div className="flex flex-col h-full">
                <div className="flex flex-col md:flex-row p-6 flex-grow">
                  <div className="md:w-[100px] flex-shrink-0 mb-4 md:mb-0">
                    <img
                      src={book.thumbnail}
                      alt={`${book.title} cover`}
                      className="w-full h-auto object-contain rounded"
                      style={{ aspectRatio: '2/3' }}
                    />
                  </div>
                  <div className="md:ml-6 flex-grow flex flex-col justify-between">
                    <div>
                      <h3 className="text-base font-semibold mb-2 text-gray-800 dark:text-gray-100">{book.title}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">{book.author}</p>
                      <p className="text-sm text-gray-700 dark:text-gray-400 mb-4">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                    </div>
                    <button 
                      className={`self-start flex items-center text-sm font-medium ${cartItems.includes(book.id) ? 'text-green-500' : 'text-blue-500'}`}
                      onClick={() => addToCart(book.id)}
                      disabled={cartItems.includes(book.id)}
                    >
                      <CartIcon size={16} className='mr-2' />
                      {cartItems.includes(book.id) ? 'Added' : 'Add to Cart'}
                    </button>
                  </div>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-700 p-6">
                  <InspirationNotes notes={book.notes} />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecommendedBooks;
