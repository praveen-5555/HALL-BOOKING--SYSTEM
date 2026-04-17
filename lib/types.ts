export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'user';
}

export interface Hall {
  id: string;
  name: string;
  location: string;
  capacity: number;
  price: number;
  description: string;
  image: string;
  amenities: string[];
}

export interface Booking {
  id: string;
  userId: string;
  hallId: string;
  date: string;
  startTime: string;
  endTime: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  totalAmount: number;
}

export interface Payment {
  id: string;
  bookingId: string;
  amount: number;
  status: 'pending' | 'completed' | 'refunded';
  paymentMethod: string;
  transactionId?: string;
}

export interface Database {
  users: User[];
  halls: Hall[];
  bookings: Booking[];
  payments: Payment[];
}