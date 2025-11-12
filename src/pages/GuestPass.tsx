import { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle2, 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  Phone,
  Car,
  Building2,
  QrCode,
  Download,
  Share2,
  Camera
} from 'lucide-react';
import { format, addHours } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { toast } from 'sonner';

export default function GuestPass() {
  const { guestId } = useParams();
  const location = useLocation();
  const { booking, guestInfo } = location.state || {};
  const [faceRecorded, setFaceRecorded] = useState(false);

  useEffect(() => {
    // 模拟发送通知给组织者
    if (booking && guestInfo) {
      console.log(`通知发送给 ${booking.organizer}: 您邀请的 ${guestInfo.name} 已登记参加 ${booking.title}`);
    }
  }, [booking, guestInfo]);

  if (!booking || !guestInfo) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-lg font-semibold text-foreground mb-2">通行证信息无效</p>
              <p className="text-muted-foreground">请重新登记</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // 计算有效期（会议开始前后各60分钟）
  const validFrom = addHours(new Date(booking.startTime), -1);
  const validUntil = addHours(new Date(booking.endTime), 1);

  const handleRecordFace = () => {
    // 模拟人脸录入
    toast.success('人脸信息录入成功');
    setFaceRecorded(true);
  };

  const handleDownload = () => {
    toast.success('通行证已保存到相册');
  };

  const handleShare = () => {
    toast.success('分享链接已复制');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* 成功提示 */}
        <div className="bg-success/10 border border-success/20 rounded-lg p-4 mb-6 flex items-center gap-3">
          <CheckCircle2 className="h-6 w-6 text-success flex-shrink-0" />
          <div>
            <p className="font-semibold text-success">登记成功！</p>
            <p className="text-sm text-success/80">您的通行证已生成，请凭此通行证入场</p>
          </div>
        </div>

        {/* 通行证卡片 */}
        <Card className="overflow-hidden">
          <CardHeader className="bg-primary text-primary-foreground pb-8">
            <div className="text-center">
              <Badge variant="secondary" className="mb-4 bg-white/20 text-white border-white/30">
                访客通行证
              </Badge>
              <h1 className="text-2xl font-bold mb-1">{guestInfo.name}</h1>
              <p className="text-primary-foreground/80">通行ID: {guestId}</p>
            </div>
          </CardHeader>

          <CardContent className="pt-6">
            {/* 二维码 */}
            <div className="flex justify-center mb-6">
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <div className="w-48 h-48 bg-muted flex items-center justify-center rounded">
                  <div className="text-center">
                    <QrCode className="h-24 w-24 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">二维码</p>
                    <p className="text-xs text-muted-foreground mt-1">{guestId?.substring(0, 12)}...</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 人脸录入 */}
            <div className="mb-6 p-4 bg-accent/50 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Camera className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium text-foreground">人脸识别</p>
                    <p className="text-sm text-muted-foreground">
                      {faceRecorded ? '已录入人脸信息' : '录入人脸信息可快速通行'}
                    </p>
                  </div>
                </div>
                {!faceRecorded && (
                  <Button size="sm" onClick={handleRecordFace}>
                    录入
                  </Button>
                )}
                {faceRecorded && (
                  <Badge variant="default" className="bg-success">
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    已录入
                  </Badge>
                )}
              </div>
            </div>

            <Separator className="my-6" />

            {/* 会议信息 */}
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground mb-3">会议信息</h3>
              
              <div className="grid gap-3">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Calendar className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">会议主题</p>
                    <p className="font-medium text-foreground">{booking.title}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Clock className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">会议时间</p>
                    <p className="font-medium text-foreground">
                      {format(new Date(booking.startTime), 'yyyy年MM月dd日 HH:mm', { locale: zhCN })}
                      {' - '}
                      {format(new Date(booking.endTime), 'HH:mm')}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <MapPin className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">会议室</p>
                    <p className="font-medium text-foreground">{booking.roomName}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <User className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">邀约人</p>
                    <p className="font-medium text-foreground">{booking.organizer}</p>
                  </div>
                </div>
              </div>
            </div>

            <Separator className="my-6" />

            {/* 访客信息 */}
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground mb-3">访客信息</h3>
              
              <div className="grid gap-3">
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground min-w-20">手机号</span>
                  <span className="font-medium text-foreground">{guestInfo.phone}</span>
                </div>

                {guestInfo.carPlate && (
                  <div className="flex items-center gap-3">
                    <Car className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground min-w-20">车牌号</span>
                    <span className="font-medium text-foreground">{guestInfo.carPlate}</span>
                  </div>
                )}

                {guestInfo.company && (
                  <div className="flex items-center gap-3">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground min-w-20">公司</span>
                    <span className="font-medium text-foreground">{guestInfo.company}</span>
                  </div>
                )}
              </div>
            </div>

            <Separator className="my-6" />

            {/* 有效期 */}
            <div className="bg-warning/10 border border-warning/20 rounded-lg p-4">
              <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                <Clock className="h-4 w-4" />
                通行证有效期
              </h3>
              <p className="text-sm text-muted-foreground">
                {format(validFrom, 'yyyy年MM月dd日 HH:mm', { locale: zhCN })}
                {' 至 '}
                {format(validUntil, 'MM月dd日 HH:mm', { locale: zhCN })}
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                * 通行证在会议开始前后各延长60分钟有效
              </p>
            </div>

            {/* 操作按钮 */}
            <div className="grid grid-cols-2 gap-3 mt-6">
              <Button variant="outline" onClick={handleDownload}>
                <Download className="h-4 w-4 mr-2" />
                保存通行证
              </Button>
              <Button variant="outline" onClick={handleShare}>
                <Share2 className="h-4 w-4 mr-2" />
                分享
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* 温馨提示 */}
        <div className="mt-6 p-4 bg-muted/50 rounded-lg">
          <h4 className="font-medium text-foreground mb-2">温馨提示</h4>
          <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
            <li>请在有效期内使用通行证入场</li>
            <li>建议提前录入人脸信息，可快速通过门禁</li>
            <li>请妥善保管通行证二维码，勿分享给他人</li>
            <li>如有疑问，请联系会议组织者</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
