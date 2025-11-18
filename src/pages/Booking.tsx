import { useState } from 'react';
import { AppSidebar } from '@/components/layout/AppSidebar';
import { PageHeader } from '@/components/layout/PageHeader';
import { BookingCalendar } from '@/components/booking/BookingCalendar';
import { BookingModal } from '@/components/booking/BookingModal';
import { BookingDetailPanel } from '@/components/booking/BookingDetailPanel';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Search, Settings } from 'lucide-react';
import { format, addDays, subDays } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { mockRooms, mockBookings } from '@/lib/mock-data';
import { ViewMode, MeetingRoom, Booking as BookingType } from '@/types/meeting-room';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

const Booking = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('day');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [rooms] = useState<MeetingRoom[]>(mockRooms);
  const [bookings, setBookings] = useState<BookingType[]>(mockBookings);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<MeetingRoom | null>(null);
  const [selectedStartTime, setSelectedStartTime] = useState<Date>();
  const [selectedBooking, setSelectedBooking] = useState<BookingType | null>(null);
  const [showBookingDetail, setShowBookingDetail] = useState(false);

  const handleTimeSlotClick = (room: MeetingRoom, startTime: Date) => {
    setSelectedRoom(room);
    setSelectedStartTime(startTime);
    const endTime = new Date(startTime);
    endTime.setHours(startTime.getHours() + 1);
    setIsModalOpen(true);
  };

  const handleBookingClick = (booking: BookingType) => {
    setSelectedBooking(booking);
    setShowBookingDetail(true);
  };

  const handleSaveBooking = async (booking: Partial<BookingType>) => {
    const newBooking = booking as BookingType;
    
    try {
      // 保存到数据库
      const { error } = await supabase
        .from('bookings')
        .insert({
          id: newBooking.id,
          room_id: newBooking.roomId,
          room_name: newBooking.roomName,
          title: newBooking.title,
          organizer: newBooking.organizer,
          start_time: newBooking.startTime.toISOString(),
          end_time: newBooking.endTime.toISOString(),
          participants: newBooking.participants,
          description: newBooking.description,
          notification_minutes: newBooking.notificationMinutes,
          status: newBooking.status
        });

      if (error) {
        console.error('Error saving booking:', error);
        toast.error('保存会议失败，请重试');
        return;
      }

      // 更新本地状态
      setBookings([...bookings, newBooking]);
      toast.success('会议已创建');
    } catch (error) {
      console.error('Error saving booking:', error);
      toast.error('保存会议失败，请重试');
    }
  };

  const handleCancelBooking = () => {
    if (selectedBooking) {
      setBookings(bookings.filter(b => b.id !== selectedBooking.id));
      setShowBookingDetail(false);
      setSelectedBooking(null);
      toast.success('会议已取消');
    }
  };

  const handleEditBooking = () => {
    if (selectedBooking) {
      const room = rooms.find(r => r.id === selectedBooking.roomId);
      if (room) {
        setSelectedRoom(room);
        setSelectedStartTime(new Date(selectedBooking.startTime));
        setShowBookingDetail(false);
        setIsModalOpen(true);
      }
    }
  };

  const handleDateChange = (days: number) => {
    setSelectedDate(days > 0 ? addDays(selectedDate, days) : subDays(selectedDate, Math.abs(days)));
  };

  return (
    <div className="flex h-screen bg-background">
      <AppSidebar />
      
      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 flex flex-col overflow-hidden">
          <PageHeader title="预约会议室">
          <div className="flex gap-3 mt-4 items-center justify-between">
            <div className="flex gap-3 flex-1">
              <div className="flex items-center gap-2 bg-card rounded-lg border border-border px-3 py-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDateChange(-1)}
                  className="h-7 w-7 p-0"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="text-sm font-medium min-w-[120px] text-center">
                  {format(selectedDate, 'yyyy-MM-dd')}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDateChange(1)}
                  className="h-7 w-7 p-0"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex items-center bg-card rounded-lg border border-border">
                <Button
                  variant={viewMode === 'day' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('day')}
                  className={cn(
                    "rounded-r-none",
                    viewMode === 'day' && "bg-primary text-primary-foreground hover:bg-primary/90"
                  )}
                >
                  日
                </Button>
                <Button
                  variant={viewMode === 'week' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('week')}
                  className={cn(
                    "rounded-l-none border-l",
                    viewMode === 'week' && "bg-primary text-primary-foreground hover:bg-primary/90"
                  )}
                >
                  周
                </Button>
              </div>

              <Select defaultValue="all">
                <SelectTrigger className="w-[180px] bg-card">
                  <SelectValue placeholder="会议室位置" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部位置</SelectItem>
                  <SelectItem value="building-1">建筑-楼层</SelectItem>
                </SelectContent>
              </Select>

              <Select defaultValue="all">
                <SelectTrigger className="w-[180px] bg-card">
                  <SelectValue placeholder="配套设施" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部设施</SelectItem>
                  <SelectItem value="tv">电视</SelectItem>
                  <SelectItem value="projector">投影仪</SelectItem>
                </SelectContent>
              </Select>

              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="搜索会议室名称/位置"
                  className="pl-9 bg-card"
                />
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5">
                <div className="w-4 h-4 rounded bg-status-available border border-border" />
                <span className="text-muted-foreground">空闲</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-4 h-4 rounded bg-status-booked border border-warning" />
                <span className="text-muted-foreground">已被他人预定</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-4 h-4 rounded bg-status-myBooking border border-primary" />
                <span className="text-muted-foreground">我的预定</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-4 h-4 rounded bg-status-unavailable" />
                <span className="text-muted-foreground">不可预定</span>
              </div>
            </div>
          </div>
        </PageHeader>

        <div className="flex-1 overflow-auto p-8">
          <BookingCalendar
            rooms={rooms}
            bookings={bookings}
            viewMode={viewMode}
            selectedDate={selectedDate}
            onDateChange={setSelectedDate}
            onTimeSlotClick={handleTimeSlotClick}
            onBookingClick={handleBookingClick}
          />
          </div>
        </div>

        {/* 右侧详情面板 */}
        {showBookingDetail && selectedBooking && (
          <BookingDetailPanel
            booking={selectedBooking}
            onEdit={handleEditBooking}
            onCancel={handleCancelBooking}
            onClose={() => {
              setShowBookingDetail(false);
              setSelectedBooking(null);
            }}
          />
        )}
      </div>

      <BookingModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        room={selectedRoom}
        initialStartTime={selectedStartTime}
        initialEndTime={selectedStartTime ? new Date(selectedStartTime.getTime() + 60 * 60 * 1000) : undefined}
        onSave={handleSaveBooking}
        existingBooking={selectedBooking || undefined}
        mode={selectedBooking ? 'edit' : 'create'}
      />

    </div>
  );
};

export default Booking;
