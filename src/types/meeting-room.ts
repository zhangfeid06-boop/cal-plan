export interface MeetingRoom {
  id: string;
  name: string;
  group: string;
  location: string;
  capacity: number;
  facilities: string[];
  image: string;
  notes?: string;
  isOpen: boolean;
  waterSign?: string;
  devices?: string[];
}

export interface Booking {
  id: string;
  roomId: string;
  roomName: string;
  title: string;
  startTime: Date;
  endTime: Date;
  participants: string[];
  organizer: string;
  description?: string;
  notificationTime?: string;
  notificationMinutes?: number;
  isMyBooking: boolean;
  status: BookingStatus;
  externalGuests?: ExternalGuest[];
}

export interface Hold {
  id: string;
  roomId: string;
  roomName: string;
  startTime: Date;
  endTime: Date;
  assignedTo: string;
  createdBy: string;
  autoReleaseTime: Date;
  notes?: string;
}

export interface ExternalGuest {
  id: string;
  bookingId: string;
  name: string;
  phone: string;
  company?: string;
  carPlate?: string;
  passCode?: string;
  passIssued?: boolean;
  status: 'pending' | 'registered' | 'checked-in';
}

export type ViewMode = 'day' | 'week';

export type BookingStatus = 'available' | 'booked' | 'my-booking' | 'unavailable' | 'reserved';
