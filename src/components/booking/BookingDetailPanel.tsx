import { useState } from 'react';
import { Booking } from '@/types/meeting-room';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Clock, 
  MapPin, 
  Users, 
  Bell, 
  Link as LinkIcon, 
  UserPlus,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Copy
} from 'lucide-react';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface BookingDetailPanelProps {
  booking: Booking;
  onEdit: () => void;
  onCancel: () => void;
  onClose: () => void;
}

export function BookingDetailPanel({ 
  booking, 
  onEdit, 
  onCancel,
  onClose 
}: BookingDetailPanelProps) {
  const [showExternalGuests, setShowExternalGuests] = useState(false);
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [guestName, setGuestName] = useState('');
  const [guestPhone, setGuestPhone] = useState('');

  const handleCopyInviteLink = () => {
    const link = `${window.location.origin}/guest-invite/${booking.id}`;
    navigator.clipboard.writeText(link);
    toast.success('邀约链接已复制');
  };

  const handleAddGuest = () => {
    if (!guestName || !guestPhone) {
      toast.error('请填写访客姓名和手机号');
      return;
    }
    
    // TODO: 实际调用API添加外部访客
    toast.success(`已邀请访客：${guestName}`);
    setGuestName('');
    setGuestPhone('');
    setShowInviteForm(false);
  };

  const getNotificationText = (minutes?: number) => {
    if (!minutes) return '会议开始前15分钟';
    if (minutes === 0) return '会议开始时';
    if (minutes < 60) return `会议开始前${minutes}分钟`;
    if (minutes < 1440) return `会议开始前${minutes / 60}小时`;
    return `会议开始前${minutes / 1440}天`;
  };

  return (
    <div className="w-96 h-full bg-background border-l border-border flex flex-col">
      {/* 头部 */}
      <div className="p-4 border-b border-border">
        <div className="flex items-start justify-between mb-2">
          <h2 className="text-lg font-semibold text-foreground flex-1 pr-2">
            {booking.title}
          </h2>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 -mt-1 -mr-1"
            onClick={onClose}
          >
            ×
          </Button>
        </div>
        
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>
              {format(new Date(booking.startTime), 'yyyy年MM月dd日 EEEE', { locale: zhCN })}
            </span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground pl-6">
            <span className="font-medium text-foreground">
              {format(new Date(booking.startTime), 'HH:mm')} - {format(new Date(booking.endTime), 'HH:mm')}
            </span>
            <span className="text-xs">(GMT+8)</span>
          </div>
        </div>
      </div>

      {/* 主体内容 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* 参会人 */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">
                {booking.organizer}邀请了{booking.participants.length}人，{booking.participants.length}人接受
              </span>
            </div>
            <Button variant="ghost" size="sm" className="h-8 text-primary">
              <UserPlus className="h-4 w-4 mr-1" />
              加人
            </Button>
          </div>
          
          <div className="flex flex-wrap gap-3">
            {/* 组织者 */}
            <div className="flex flex-col items-center gap-1">
              <Avatar className="h-10 w-10">
                <AvatarFallback>{booking.organizer[0]}</AvatarFallback>
              </Avatar>
              <span className="text-xs text-foreground">
                {booking.organizer}
                <Badge variant="outline" className="ml-1 text-xs">组织者</Badge>
              </span>
            </div>
            
            {/* 参会人 */}
            {booking.participants.map((participant, index) => (
              <div key={index} className="flex flex-col items-center gap-1">
                <Avatar className="h-10 w-10">
                  <AvatarFallback>{participant[0]}</AvatarFallback>
                </Avatar>
                <span className="text-xs text-foreground">{participant}</span>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* 会议室 */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium text-muted-foreground">会议室</span>
          </div>
          <div className="pl-6 text-sm text-foreground">{booking.roomName}</div>
        </div>

        {/* 通知设置 */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Bell className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium text-muted-foreground">通知</span>
          </div>
          <div className="pl-6 text-sm text-foreground">
            {getNotificationText(booking.notificationMinutes)}，应用弹窗提醒我
          </div>
        </div>

        <Separator />

        {/* 外部访客 */}
        <div>
          <div 
            className="flex items-center justify-between cursor-pointer hover:bg-accent/50 -mx-2 px-2 py-1 rounded"
            onClick={() => setShowExternalGuests(!showExternalGuests)}
          >
            <div className="flex items-center gap-2">
              <ExternalLink className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">外部访客</span>
              <Badge variant="secondary" className="text-xs">
                {booking.externalGuests?.length || 0}
              </Badge>
            </div>
            {showExternalGuests ? (
              <ChevronUp className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            )}
          </div>

          {showExternalGuests && (
            <div className="mt-3 pl-6 space-y-3">
              {booking.externalGuests && booking.externalGuests.length > 0 ? (
                booking.externalGuests.map((guest) => (
                  <div key={guest.id} className="flex items-center justify-between p-2 bg-muted rounded">
                    <div>
                      <div className="text-sm font-medium">{guest.name}</div>
                      <div className="text-xs text-muted-foreground">{guest.phone}</div>
                    </div>
                    <Badge variant={guest.passIssued ? 'default' : 'secondary'} className="text-xs">
                      {guest.passIssued ? '已登记' : '待登记'}
                    </Badge>
                  </div>
                ))
              ) : (
                <div className="text-sm text-muted-foreground">暂无外部访客</div>
              )}

              {!showInviteForm ? (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  onClick={() => setShowInviteForm(true)}
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  添加外部访客
                </Button>
              ) : (
                <div className="space-y-3 p-3 border border-border rounded">
                  <div className="space-y-2">
                    <Label htmlFor="guest-name">访客姓名*</Label>
                    <Input
                      id="guest-name"
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      placeholder="请输入访客姓名"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="guest-phone">手机号*</Label>
                    <Input
                      id="guest-phone"
                      value={guestPhone}
                      onChange={(e) => setGuestPhone(e.target.value)}
                      placeholder="请输入手机号"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      className="flex-1"
                      onClick={handleAddGuest}
                    >
                      确定
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => {
                        setShowInviteForm(false);
                        setGuestName('');
                        setGuestPhone('');
                      }}
                    >
                      取消
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* 复制邀约链接 */}
        {booking.isMyBooking && (
          <Button 
            variant="outline" 
            className="w-full justify-start"
            onClick={handleCopyInviteLink}
          >
            <Copy className="h-4 w-4 mr-2" />
            复制邀约链接
          </Button>
        )}
      </div>

      {/* 底部操作按钮 */}
      {booking.isMyBooking && (
        <div className="p-4 border-t border-border space-y-2">
          <Button 
            className="w-full"
            onClick={onEdit}
          >
            编辑会议
          </Button>
          <Button 
            variant="outline"
            className="w-full text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={onCancel}
          >
            取消会议
          </Button>
        </div>
      )}
    </div>
  );
}
