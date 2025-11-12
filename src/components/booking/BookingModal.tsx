import { useState } from 'react';
import { MeetingRoom, Booking } from '@/types/meeting-room';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format } from 'date-fns';
import { Clock, MapPin, Users as UsersIcon } from 'lucide-react';
import { toast } from 'sonner';

interface BookingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  room: MeetingRoom | null;
  initialStartTime?: Date;
  initialEndTime?: Date;
  onSave: (booking: Partial<Booking>) => void;
  mode?: 'create' | 'edit';
  existingBooking?: Booking;
}

export function BookingModal({
  open,
  onOpenChange,
  room,
  initialStartTime,
  initialEndTime,
  onSave,
  mode = 'create',
  existingBooking,
}: BookingModalProps) {
  const [title, setTitle] = useState(existingBooking?.title || '');
  const [startTime, setStartTime] = useState(
    initialStartTime ? format(initialStartTime, "HH:mm") : '09:00'
  );
  const [endTime, setEndTime] = useState(
    initialEndTime ? format(initialEndTime, "HH:mm") : '10:00'
  );
  const [participants, setParticipants] = useState(existingBooking?.participants.join(', ') || '');
  const [description, setDescription] = useState(existingBooking?.description || '');
  const [notificationTime, setNotificationTime] = useState(existingBooking?.notificationTime || '15');
  const [activeTab, setActiveTab] = useState('booking');

  const handleSave = () => {
    if (!title.trim()) {
      toast.error('请输入会议名称');
      return;
    }

    if (!room) return;

    const booking: Partial<Booking> = {
      id: existingBooking?.id || `b${Date.now()}`,
      roomId: room.id,
      roomName: room.name,
      title: title.trim(),
      startTime: initialStartTime || new Date(),
      endTime: initialEndTime || new Date(),
      participants: participants.split(',').map(p => p.trim()).filter(Boolean),
      description,
      notificationTime,
      organizer: '当前用户',
      isMyBooking: true,
    };

    onSave(booking);
    onOpenChange(false);
    toast.success(mode === 'create' ? '预订成功！' : '修改成功！');
    
    // Reset form
    setTitle('');
    setParticipants('');
    setDescription('');
    setNotificationTime('15');
  };

  if (!room) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {mode === 'create' ? '预约' : '编辑'}：{room.name}
          </DialogTitle>
          <DialogDescription>
            {initialStartTime && format(initialStartTime, 'yyyy年MM月dd日 HH:mm')}
            {initialEndTime && ` - ${format(initialEndTime, 'HH:mm')}`}
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="booking">立即预订</TabsTrigger>
            <TabsTrigger value="hold">预留时段</TabsTrigger>
          </TabsList>

          <TabsContent value="booking" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="title">会议名称 *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="请输入会议名称"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startTime">开始时间 *</Label>
                <Input
                  id="startTime"
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endTime">结束时间 *</Label>
                <Input
                  id="endTime"
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="participants">参会人</Label>
              <Input
                id="participants"
                value={participants}
                onChange={(e) => setParticipants(e.target.value)}
                placeholder="多个参会人用逗号分隔"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">会议概要</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="请输入会议概要（可选）"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notification">通知设置</Label>
              <Select value={notificationTime} onValueChange={setNotificationTime}>
                <SelectTrigger id="notification">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">会议开始时</SelectItem>
                  <SelectItem value="5">会议开始前5分钟</SelectItem>
                  <SelectItem value="15">会议开始前15分钟</SelectItem>
                  <SelectItem value="30">会议开始前30分钟</SelectItem>
                  <SelectItem value="60">会议开始前1小时</SelectItem>
                  <SelectItem value="1440">会议开始前1天</SelectItem>
                  <SelectItem value="none">不通知</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="rounded-lg bg-muted p-4">
              <div className="text-sm font-medium mb-2">会议室信息</div>
              <div className="space-y-1 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>{room.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <UsersIcon className="h-4 w-4" />
                  <span>容纳 {room.capacity} 人</span>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  {room.facilities.map((facility) => (
                    <span key={facility} className="px-2 py-0.5 bg-background rounded text-xs">
                      {facility}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="hold" className="space-y-4 mt-4">
            <div className="rounded-lg bg-muted p-4 text-sm text-muted-foreground">
              预留功能允许管理员为他人预留会议室时段。此功能仅对具有预留权限的用户开放。
            </div>

            <div className="space-y-2">
              <Label>指派给（负责人）*</Label>
              <Input placeholder="选择负责人" />
            </div>

            <div className="space-y-2">
              <Label>自动释放于 *</Label>
              <Select defaultValue="60">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="60">预留开始前 1 小时</SelectItem>
                  <SelectItem value="120">预留开始前 2 小时</SelectItem>
                  <SelectItem value="240">预留开始前 4 小时</SelectItem>
                  <SelectItem value="1440">预留开始前 24 小时</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>预留备注</Label>
              <Textarea placeholder="例如：CEO 预留，主题待定" rows={3} />
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            取消
          </Button>
          <Button onClick={handleSave}>
            {mode === 'create' ? '确认预订' : '保存修改'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
