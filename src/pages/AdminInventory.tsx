import React, { useEffect, useState } from 'react';
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell
} from '@nextui-org/react';
import { useMsal } from '@azure/msal-react';
import { getUserIdToken } from '../utils/authUtils';

interface Book {
  id: string;
  title: string;
  author: string;
  qty: number;
}

const AdminInventory: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const { instance } = useMsal();

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const idToken = await getUserIdToken(instance);
        const apiUrl = process.env.REACT_APP_API_URL;
        if (!apiUrl) {
          console.error('API URL is not configured');
          return;
        }
        const response = await fetch(`${apiUrl}/books`, {
          headers: {
            'Authorization': `Bearer ${idToken}`,
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch books');
        }
        const data = await response.json();
        setBooks(data);
      } catch (error) {
        console.error('Error fetching books:', error);
      }
    };

    fetchBooks();
  }, [instance]);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-6 text-gray-800 dark:text-gray-100 text-center">
          Inventory
        </h1>
        <Table
          aria-label="Inventory Table"
          selectionMode="none"
        >
          <TableHeader>
            <TableColumn>Title</TableColumn>
            <TableColumn>Author</TableColumn>
            <TableColumn>Quantity</TableColumn>
          </TableHeader>
          <TableBody>
            {books.map((book) => (
              <TableRow key={book.id}>
                <TableCell>{book.title}</TableCell>
                <TableCell>{book.author}</TableCell>
                <TableCell>{book.qty}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AdminInventory;
