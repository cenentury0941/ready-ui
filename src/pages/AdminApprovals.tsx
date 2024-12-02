import React, { useEffect, useState } from 'react';
import {
  Card,
  Spinner,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Button,
  Avatar
} from '@nextui-org/react';
import { TrashIcon } from '../icons/TrashIcon';
import { getUserIdToken } from '../utils/authUtils';
import { useMsal } from '@azure/msal-react';
import { Book } from '../types';
import CheckIcon from '../icons/CheckIcon';

const AdminApprovals: React.FC = () => {
  const { instance } = useMsal();
  const apiUrl = process.env.REACT_APP_API_URL;
  const [books, setBooks] = useState<Book[]>([]);
  const [isBookLoading, setIsBookLoading] = useState<boolean>(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [modalAction, setModalAction] = useState<'approve' | 'deny' | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    const fetchBooks = async () => {
      setIsBookLoading(true);
      if (!apiUrl) {
        console.error('API URL is not configured');
        return;
      }
      try {
        const idToken = await getUserIdToken(instance);
        const response = await fetch(`${apiUrl}/books/pending-approvals`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${idToken}`
          }
        });

        if (response.ok) {
          const data: Book[] = await response.json();
          setBooks(data);
        } else {
          console.error(`Failed to fetch books: ${response.statusText}`);
        }
      } catch (error) {
        console.error('Error fetching books:', error);
      } finally {
        setIsBookLoading(false);
      }
    };
    fetchBooks();
  }, [instance, apiUrl]);

  const handleApprove = async (bookId: string) => {
    if (!apiUrl) {
      console.error('API URL is not configured');
      return;
    }

    try {
      setIsSubmitting(true);
      const idToken = await getUserIdToken(instance);
      const response = await fetch(`${apiUrl}/books/${bookId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`
        },
        body: JSON.stringify({ isApproved: true })
      });

      if (response.ok) {
        setBooks(books.filter((book) => book.id !== bookId));
      } else {
        console.error(`Failed to approve book: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error approving book:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeny = async (bookId: string) => {
    if (!apiUrl) {
      console.error('API URL is not configured');
      return;
    }

    try {
      setIsSubmitting(true);
      const idToken = await getUserIdToken(instance);
      const response = await fetch(`${apiUrl}/books/${bookId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`
        }
      });

      if (response.ok) {
        setBooks(books.filter((book) => book.id !== bookId));
      } else {
        console.error(`Failed to deny book: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error denying book:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const openModal = (action: 'approve' | 'deny', book: Book) => {
    setSelectedBook(book);
    setModalAction(action);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedBook(null);
    setModalAction(null);
    setIsModalOpen(false);
  };

  const confirmAction = async () => {
    if (!selectedBook || !modalAction) return;

    if (modalAction === 'approve') {
      await handleApprove(selectedBook.id);
    } else if (modalAction === 'deny') {
      await handleDeny(selectedBook.id);
    }

    closeModal();
  };

  return (
    <div className='min-h-screen py-8'>
      <div className='max-w-4xl mx-auto p-4'>
        <div className='flex justify-center items-center mb-2'>
          <h1 className='text-2xl font-bold text-gray-900 dark:text-white'>
            Pending Approvals
          </h1>
        </div>
      </div>
      {isBookLoading ? (
        <div className='flex justify-center mt-24'>
          <Spinner size='lg' color='primary' labelColor='primary' />
        </div>
      ) : books.length > 0 ? (
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 px-4'>
          {books.map((book) => (
            <Card
              key={book.id}
              className='overflow-hidden dark:bg-gray-800 shadow-none'
              radius='sm'
            >
              <div className='flex flex-col h-full text-left'>
                <div className='flex flex-col md:flex-row p-6 flex-grow'>
                  <div className='md:w-[100px] flex-shrink-0 mb-4 md:mb-0'>
                    <img
                      src={book.thumbnail}
                      alt={`${book.title} cover`}
                      className='w-full h-auto object-contain rounded'
                      style={{ aspectRatio: '2/3' }}
                    />
                  </div>
                  <div className='md:ml-6 flex-grow flex flex-col justify-between min-w-0'>
                    <div>
                      <h3 className='text-base font-semibold mb-2 text-gray-800 dark:text-gray-100 truncate'>
                        {book.title}
                      </h3>
                      <p className='text-sm text-gray-600 dark:text-gray-300 mb-4 truncate'>
                        {book.author}
                      </p>
                      <p className='text-sm text-gray-700 dark:text-gray-400 mb-4 line-clamp-3'>
                        {book.about}
                      </p>
                    </div>
                  </div>
                </div>
                <hr className='border-t border-gray-300 dark:border-gray-600 mb-6' />
                <div className='flex flex-col md:flex-row items-center gap-4 px-6 pb-6'>
                  <div className='flex items-center flex-col md:flex-row gap-5 md:gap-0'>
                    <Avatar
                      src={book.userImageUrl || undefined}
                      className='flex-shrink-0 w-16 h-16 md:w-12 md:h-12'
                    />
                    <p className='ml-3 text-sm flex flex-col text-center md:text-left gap-1'>
                      <span className='text-gray-700 dark:text-gray-400'>
                        Recommended By
                      </span>
                      <span className='text-gray-700 dark:text-gray-200'>
                        {book.addedBy}
                      </span>
                    </p>
                  </div>
                  <div className='flex gap-4 md:ml-auto md:mt-0 mt-4 w-full md:w-auto justify-center md:justify-end'>
                    <Button
                      className='px-4 py-2 rounded text-white font-semibold bg-blue-500'
                      onClick={() => openModal('approve', book)}
                    >
                      <span>Approve</span>
                    </Button>
                    <Button
                      variant='bordered'
                      onClick={() => openModal('deny', book)}
                      className='rounded'
                    >
                      <span>Deny</span>
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className='flex justify-center items-center mt-24'>
          <p className='text-lg font-medium text-gray-600 dark:text-gray-400'>
            No pending approvals.
          </p>
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <ModalContent>
          <ModalHeader>
            {modalAction === 'approve' ? 'Approve Book' : 'Deny Book'}
          </ModalHeader>
          <ModalBody>
            <p className='text-gray-600 dark:text-gray-400'>
              Are you sure you want to {modalAction} the book{' '}
              <strong>{selectedBook?.title}</strong> by{' '}
              <strong>{selectedBook?.author}</strong>?
            </p>
            <div className='flex justify-end gap-4 mt-6 mb-4'>
              <Button
                onClick={confirmAction}
                className='w-24 bg-blue-500 rounded'
              >
                {isSubmitting ? <Spinner size='sm' color='white' /> : 'Confirm'}
              </Button>
              <Button
                variant='bordered'
                onClick={closeModal}
                className='rounded'
              >
                Cancel
              </Button>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default AdminApprovals;
