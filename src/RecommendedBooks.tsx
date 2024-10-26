import React, { useState } from 'react';
import { useCart } from './context/CartContext';
import './App.css';
import InspirationNotes from './InspirationNotes';
import { books } from './data/books';

const RecommendedBooks: React.FC = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const { cartItems, addToCart } = useCart();

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
          {cartItems.includes(book.id) ? (
            <span className="added-to-cart">Added to Cart ✔️</span>
          ) : (
            hoveredIndex === index && (
              <button className="add-to-cart-button" onClick={() => addToCart(book.id)}>
                Add to Cart
              </button>
            )
          )}
        </div>
      ))}
    </div>
  );
};

export default RecommendedBooks;
