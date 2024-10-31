import React, { useState, useRef, useEffect } from 'react';
import { useCart } from './context/CartContext';
import InspirationNotes from './InspirationNotes';
import { books } from './data/books';
import { Card, Input } from "@nextui-org/react";
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
                input: [
                  "bg-transparent",
                  "text-black/90 dark:text-white/90",
                  "placeholder:text-default-700/50 dark:placeholder:text-white/60",
                ],
                inputWrapper: [
                  "h-full",
                  "bg-default-200/50",
                  "dark:bg-default/60",
                  "backdrop-blur-xl",
                  "backdrop-saturate-200",
                  "hover:bg-default-200/70",
                  "dark:hover:bg-default/70",
                  "group-data-[focused=true]:bg-default-200/50",
                  "dark:group-data-[focused=true]:bg-default/60",
                  "!cursor-text",
                ],
              }}
              placeholder="Search books by title or author"
              size="sm"
              startContent={<SearchIcon size={18} />}
              value={searchTerm}
              onValueChange={handleSearchChange}
              onKeyDown={handleKeyDown}
              isClearable
            />
            {searchTerm && (
              <ul ref={suggestionsRef} className="absolute z-10 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md mt-1 max-h-60 overflow-y-auto">
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
            <Card key={book.id} className="overflow-hidden dark:bg-gray-800 shadow-none" radius="sm">
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
                  <div className="md:ml-6 flex-grow flex flex-col justify-between min-w-0">
                    <div>
                      <h3 className="text-base font-semibold mb-2 text-gray-800 dark:text-gray-100 truncate">{book.title}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 truncate">{book.author}</p>
                      <p className="text-sm text-gray-700 dark:text-gray-400 mb-4 line-clamp-3">{book.about}</p>
                    </div>
                    <button 
                      className={`self-start flex items-center text-sm font-medium ${cartItems.includes(book.id) ? 'text-success' : 'text-primary'}`}
                      onClick={() => addToCart(book.id)}
                      disabled={cartItems.includes(book.id)}
                    >
                      <CartIcon size={16} className='mr-2' />
                      {cartItems.includes(book.id) ? 'Added' : 'Add to Cart'}
                    </button>
                  </div>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-700 p-6">
                  <InspirationNotes 
                    notes={book.notes} 
                    book={book}
                    isInCart={cartItems.includes(book.id)}
                    onAddToCart={addToCart}
                  />
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
