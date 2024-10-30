export interface Order {
  id: string;
  confirmationNumber: string;
  items: {
    productId: string;
    title: string;
    author: string;
    thumbnail: string;
  }[];
  status: string;
  createdAt: string;
  updatedAt: string;
}
