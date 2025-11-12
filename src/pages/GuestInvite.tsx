import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Calendar, Clock, MapPin, User, Phone, Car, Building2, Users } from 'lucide-react';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { toast } from 'sonner';
import { mockBookings } from '@/lib/mock-data';

export default function GuestInvite() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // 表单状态
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    attendeeCount: '',
    carPlate: '',
    company: '',
  });
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    // 模拟加载会议信息
    const foundBooking = mockBookings.find(b => b.id === bookingId);
    if (foundBooking) {
      setBooking(foundBooking);
    }
    setLoading(false);
  }, [bookingId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.phone) {
      toast.error('请填写必填项');
      return;
    }

    if (!agreedToTerms) {
      toast.error('请同意隐私条款');
      return;
    }

    // 验证手机号格式
    const phoneRegex = /^1[3-9]\d{9}$/;
    if (!phoneRegex.test(formData.phone)) {
      toast.error('请输入正确的手机号码');
      return;
    }

    setSubmitting(true);

    try {
      // 模拟提交登记
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 生成访客ID并跳转到通行证页面
      const guestId = `guest_${Date.now()}`;
      toast.success('登记成功！正在生成通行证...');
      
      setTimeout(() => {
        navigate(`/guest-pass/${guestId}`, {
          state: {
            booking,
            guestInfo: formData
          }
        });
      }, 500);
    } catch (error) {
      toast.error('登记失败，请重试');
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">加载中...</p>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-lg font-semibold text-foreground mb-2">邀约链接无效</p>
              <p className="text-muted-foreground">该会议不存在或已取消</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* 会议信息卡片 */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-xl">会议邀请</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">{booking.title}</h2>
            </div>

            <div className="grid gap-3">
              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium text-foreground">
                    {format(new Date(booking.startTime), 'yyyy年MM月dd日 EEEE', { locale: zhCN })}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-foreground">
                    {format(new Date(booking.startTime), 'HH:mm')} - {format(new Date(booking.endTime), 'HH:mm')}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-foreground">{booking.roomName}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-muted-foreground">邀约人</p>
                  <p className="text-foreground font-medium">{booking.organizer}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 访客登记表单 */}
        <Card>
          <CardHeader>
            <CardTitle>访客登记</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              请填写您的基本信息以完成登记
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    姓名 <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="请输入您的姓名"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="flex items-center gap-1">
                    <Phone className="h-4 w-4" />
                    手机号 <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="请输入手机号"
                    maxLength={11}
                    required
                  />
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label htmlFor="attendeeCount" className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    参会人数
                  </Label>
                  <Input
                    id="attendeeCount"
                    type="number"
                    min="1"
                    value={formData.attendeeCount}
                    onChange={(e) => setFormData({ ...formData, attendeeCount: e.target.value })}
                    placeholder="请输入参会人数（可选）"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="carPlate" className="flex items-center gap-1">
                    <Car className="h-4 w-4" />
                    车牌号
                  </Label>
                  <Input
                    id="carPlate"
                    value={formData.carPlate}
                    onChange={(e) => setFormData({ ...formData, carPlate: e.target.value.toUpperCase() })}
                    placeholder="请输入车牌号（可选）"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="company" className="flex items-center gap-1">
                    <Building2 className="h-4 w-4" />
                    公司/备注
                  </Label>
                  <Textarea
                    id="company"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder="请输入公司名称或其他备注信息（可选）"
                    rows={3}
                  />
                </div>
              </div>

              <Separator />

              <div className="flex items-start gap-2">
                <Checkbox
                  id="terms"
                  checked={agreedToTerms}
                  onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
                />
                <Label 
                  htmlFor="terms" 
                  className="text-sm font-normal leading-relaxed cursor-pointer"
                >
                  我已阅读并同意
                  <a href="#" className="text-primary hover:underline mx-1">《隐私条款》</a>
                  和
                  <a href="#" className="text-primary hover:underline mx-1">《访客管理规定》</a>
                </Label>
              </div>

              <Button 
                type="submit" 
                className="w-full h-12 text-base"
                disabled={submitting}
              >
                {submitting ? '提交中...' : '提交登记'}
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-muted-foreground mt-6">
          登记信息仅用于会议签到和门禁管理，我们将严格保护您的隐私
        </p>
      </div>
    </div>
  );
}
