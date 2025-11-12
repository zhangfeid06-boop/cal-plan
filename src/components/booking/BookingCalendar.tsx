import { useState } from 'react';
import { ViewMode, MeetingRoom, Booking } from '@/types/meeting-room';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { format, addDays, startOfWeek, addWeeks, subWeeks } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { cn } from '@/lib/utils';

interface BookingCalendarProps {
  rooms: MeetingRoom[];
  bookings: Booking[];
  viewMode: ViewMode;
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  onTimeSlotClick: (room: MeetingRoom, startTime: Date) => void;
  onBookingClick: (booking: Booking) => void;
}

export function BookingCalendar({
  rooms,
  bookings,
  viewMode,
  selectedDate,
  onDateChange,
  onTimeSlotClick,
  onBookingClick,
}: BookingCalendarProps) {
  const getTimeSlots = () => {
    const slots = [];
    for (let hour = 7; hour <= 22; hour++) {
      slots.push(hour);
    }
    return slots;
  };

  const getWeekDays = () => {
    const start = startOfWeek(selectedDate, { weekStartsOn: 1 });
    return Array.from({ length: 7 }, (_, i) => addDays(start, i));
  };

  const getBookingsForRoomAndTime = (roomId: string, date: Date, hour: number) => {
    return bookings.filter(booking => {
      const bookingDate = new Date(booking.startTime);
      const bookingHour = bookingDate.getHours();
      return (
        booking.roomId === roomId &&
        bookingDate.toDateString() === date.toDateString() &&
        bookingHour === hour
      );
    });
  };

  const handlePrevious = () => {
    if (viewMode === 'day') {
      onDateChange(addDays(selectedDate, -1));
    } else {
      onDateChange(subWeeks(selectedDate, 1));
    }
  };

  const handleNext = () => {
    if (viewMode === 'day') {
      onDateChange(addDays(selectedDate, 1));
    } else {
      onDateChange(addWeeks(selectedDate, 1));
    }
  };

  if (viewMode === 'day') {
    return (
      <div className="space-y-3">
        {rooms.map((room) => (
          <div key={room.id} className="bg-card rounded-lg border border-border overflow-hidden">
            <div className="flex items-center gap-3 p-3 border-b border-border">
              <img
                src={room.image}
                alt={room.name}
                className="h-16 w-20 rounded object-cover bg-muted shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="font-medium text-foreground">{room.name}</div>
                <div className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                  <span>{room.location}</span>
                  <span>·</span>
                  <span>{room.capacity}人</span>
                  <span>·</span>
                  <span>{room.facilities.join('/')}</span>
                </div>
              </div>
            </div>
            <div className="p-3">
              <div className="flex gap-1 overflow-x-auto">
                {getTimeSlots().map((hour) => {
                  const slotBookings = getBookingsForRoomAndTime(room.id, selectedDate, hour);
                  const hasBooking = slotBookings.length > 0;
                  const booking = slotBookings[0];

                  return (
                    <div
                      key={hour}
                      className={cn(
                        "flex-shrink-0 w-20 h-16 rounded border text-center text-xs cursor-pointer transition-colors",
                        !hasBooking && "bg-status-available hover:bg-accent border-border",
                        hasBooking && booking.isMyBooking && "bg-status-myBooking border-primary",
                        hasBooking && !booking.isMyBooking && "bg-status-booked border-warning"
                      )}
                      onClick={() => {
                        if (hasBooking) {
                          onBookingClick(booking);
                        } else {
                          const startTime = new Date(selectedDate);
                          startTime.setHours(hour, 0, 0, 0);
                          onTimeSlotClick(room, startTime);
                        }
                      }}
                    >
                      <div className="pt-2 text-muted-foreground font-medium">
                        {`${hour}:00`}
                      </div>
                      {hasBooking && (
                        <div className="px-1 mt-1 truncate text-foreground">
                          {booking.title}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Week view
  const weekDays = getWeekDays();

  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-muted/50">
              <th className="sticky left-0 z-10 bg-muted/50 w-48 p-3 text-left border-r border-border">
                <span className="text-sm font-semibold text-foreground">会议室</span>
              </th>
              {weekDays.map((day) => (
                <th key={day.toISOString()} className="p-3 border-r border-border last:border-r-0 min-w-[120px]">
                  <div className="text-center">
                    <div className="text-sm font-semibold text-foreground">
                      {format(day, 'EEEE', { locale: zhCN })}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {format(day, 'MM/dd')}
                    </div>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rooms.map((room) => (
              <tr key={room.id} className="border-t border-border">
                <td className="sticky left-0 z-10 bg-card border-r border-border p-3">
                  <div className="flex items-center gap-2">
                    <img
                      src={room.image}
                      alt={room.name}
                      className="h-12 w-14 rounded object-cover bg-muted shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-foreground truncate">{room.name}</div>
                      <div className="text-xs text-muted-foreground truncate">{room.capacity}人</div>
                    </div>
                  </div>
                </td>
                {weekDays.map((day) => {
                  const dayBookings = bookings.filter(b => 
                    b.roomId === room.id && 
                    new Date(b.startTime).toDateString() === day.toDateString()
                  );

                  return (
                    <td key={day.toISOString()} className="p-2 border-r border-border last:border-r-0 align-top">
                      <div className="space-y-1">
                        {dayBookings.map((booking) => (
                          <div
                            key={booking.id}
                            className={cn(
                              "text-xs p-1.5 rounded cursor-pointer hover:opacity-80 transition-opacity",
                              booking.isMyBooking ? "bg-status-myBooking text-primary border border-primary" : "bg-status-booked text-foreground border border-warning"
                            )}
                            onClick={() => onBookingClick(booking)}
                          >
                            <div className="font-medium truncate">{booking.title}</div>
                            <div className="text-xs opacity-75">
                              {format(new Date(booking.startTime), 'HH:mm')} - {format(new Date(booking.endTime), 'HH:mm')}
                            </div>
                          </div>
                        ))}
                        {dayBookings.length === 0 && (
                          <div
                            className="text-xs p-2 text-center text-muted-foreground bg-status-available hover:bg-accent rounded cursor-pointer transition-colors border border-border"
                            onClick={() => {
                              const startTime = new Date(day);
                              startTime.setHours(9, 0, 0, 0);
                              onTimeSlotClick(room, startTime);
                            }}
                          >
                            点击预约
                          </div>
                        )}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
