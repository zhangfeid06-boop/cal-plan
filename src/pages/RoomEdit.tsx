import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AppSidebar } from '@/components/layout/AppSidebar';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { mockRooms, mockDevices } from '@/lib/mock-data';
import { Device } from '@/types/meeting-room';
import { toast } from 'sonner';
import { Info, Upload, ExternalLink } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const RoomEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  
  // 模拟从数据中获取会议室信息
  const room = mockRooms.find(r => r.id === id);
  
  const [formData, setFormData] = useState({
    name: room?.name || '',
    group: room?.group || '',
    location: room?.location || '',
    capacity: room?.capacity || 0,
    facilities: room?.facilities || [],
    image: room?.image || '',
    notes: '',
    isOpen: room?.isOpen ?? true,
    visibleToAll: true as boolean,
    requireApproval: false as boolean,
    allowRecurring: true as boolean,
  });

  const [showCloseConfirm, setShowCloseConfirm] = useState(false);
  const [showUnbindConfirm, setShowUnbindConfirm] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  
  // 获取当前会议室的设备列表
  const roomDevices = mockDevices.filter(device => device.roomId === id);

  const handleSave = () => {
    // TODO: 实际保存逻辑
    toast.success('保存成功');
    navigate('/');
  };

  const handleCancel = () => {
    navigate('/');
  };

  const handleOpenStatusChange = (checked: boolean) => {
    if (!checked && formData.isOpen) {
      setShowCloseConfirm(true);
    } else {
      setFormData({ ...formData, isOpen: checked });
    }
  };

  const confirmCloseBooking = () => {
    setFormData({ ...formData, isOpen: false });
    setShowCloseConfirm(false);
  };

  const handleUnbindDevice = (device: Device) => {
    setSelectedDevice(device);
    setShowUnbindConfirm(true);
  };

  const confirmUnbind = () => {
    // TODO: 实际解绑逻辑
    toast.success(`设备 ${selectedDevice?.name} 已解绑`);
    setShowUnbindConfirm(false);
    setSelectedDevice(null);
  };

  const handleViewDeviceDetail = (deviceId: string) => {
    // TODO: 跳转到设备详情页
    toast.info('跳转到设备详情页');
  };

  const getDeviceStatusColor = (status: Device['status']) => {
    switch (status) {
      case '空闲':
        return 'bg-status-available text-status-available-foreground';
      case '使用中':
        return 'bg-status-booked text-status-booked-foreground';
      case '离线':
        return 'bg-muted text-muted-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const facilityOptions = [
    { id: 'tv', label: '电视' },
    { id: 'projector', label: '投影仪' },
    { id: 'whiteboard', label: '白板' },
    { id: 'phone', label: '电话会议' },
    { id: 'video', label: '视频会议' },
  ];

  return (
    <div className="flex h-screen bg-background">
      <AppSidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <PageHeader title={`编辑会议室 - ${room?.name}`}>
          <div className="flex gap-3 mt-4">
            <Button onClick={handleSave}>保存</Button>
            <Button variant="outline" onClick={handleCancel}>取消</Button>
          </div>
        </PageHeader>

        <div className="flex-1 overflow-auto p-8">
          <div className="max-w-4xl mx-auto">
            <Tabs defaultValue="basic" className="space-y-6">
              <TabsList>
                <TabsTrigger value="basic">基本信息</TabsTrigger>
                <TabsTrigger value="settings">会议室设置</TabsTrigger>
                <TabsTrigger value="devices">设备列表</TabsTrigger>
              </TabsList>

              {/* 基本信息 */}
              <TabsContent value="basic" className="space-y-6">
                <div className="bg-card rounded-lg border border-border p-6 space-y-6">
                  <div className="grid gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">会议室名称*</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="请输入会议室名称"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="group">所属分组*</Label>
                      <Select 
                        value={formData.group} 
                        onValueChange={(value) => setFormData({ ...formData, group: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="请选择所属分组" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="建筑-楼层">建筑-楼层</SelectItem>
                          <SelectItem value="部门">部门</SelectItem>
                          <SelectItem value="功能">功能</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="location">地址*</Label>
                      <Input
                        id="location"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        placeholder="例如：A栋3楼"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="capacity">容纳人数</Label>
                      <Input
                        id="capacity"
                        type="number"
                        value={formData.capacity}
                        onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) || 0 })}
                        placeholder="请输入容纳人数"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>会议室设施</Label>
                      <div className="grid grid-cols-2 gap-4">
                        {facilityOptions.map((facility) => (
                          <div key={facility.id} className="flex items-center space-x-2">
                            <Checkbox
                              id={facility.id}
                              checked={formData.facilities.includes(facility.label)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setFormData({
                                    ...formData,
                                    facilities: [...formData.facilities, facility.label]
                                  });
                                } else {
                                  setFormData({
                                    ...formData,
                                    facilities: formData.facilities.filter(f => f !== facility.label)
                                  });
                                }
                              }}
                            />
                            <Label htmlFor={facility.id} className="font-normal cursor-pointer">
                              {facility.label}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>会议室图片</Label>
                      <div className="flex items-center gap-4">
                        {formData.image && (
                          <img 
                            src={formData.image} 
                            alt="会议室" 
                            className="h-24 w-32 rounded object-cover border border-border"
                          />
                        )}
                        <Button variant="outline">
                          <Upload className="h-4 w-4 mr-2" />
                          上传图片
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="notes">备注</Label>
                      <Textarea
                        id="notes"
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        placeholder="请输入备注信息"
                        rows={4}
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* 会议室设置 */}
              <TabsContent value="settings" className="space-y-6">
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    【会议室审批】与【会议室预定规则】的相关配置暂未开放接口，当前仅做展示。如需修改，请前往
                    <a 
                      href="https://oa.dingtalk.com/meeting_oa#/room_manage/room/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary hover:underline mx-1"
                    >
                      钉钉管理后台
                    </a>
                    进行修改。
                  </AlertDescription>
                </Alert>

                <div className="bg-card rounded-lg border border-border p-6 space-y-8">
                  {/* 预定权限 */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">预定权限</h3>
                    
                    <div className="flex items-center justify-between py-3 border-b border-border">
                      <div>
                        <div className="font-medium">开放预定状态</div>
                        <div className="text-sm text-muted-foreground">关闭后，用户将无法预定此会议室</div>
                      </div>
                      <Switch 
                        checked={formData.isOpen}
                        onCheckedChange={handleOpenStatusChange}
                      />
                    </div>

                    <div className="flex items-center justify-between py-3">
                      <div>
                        <div className="font-medium">会议室可见范围</div>
                        <div className="text-sm text-muted-foreground">设置哪些人可以看到并预定此会议室</div>
                      </div>
                      <Switch 
                        checked={formData.visibleToAll}
                        onCheckedChange={(checked) => setFormData({ ...formData, visibleToAll: checked })}
                      />
                    </div>
                  </div>

                  {/* 会议室审批 - 只读 */}
                  <div className="space-y-4 opacity-60">
                    <h3 className="text-lg font-semibold">会议室审批</h3>
                    
                    <div className="flex items-center justify-between py-3 border-b border-border">
                      <div>
                        <div className="font-medium">预定是否需要审批</div>
                        <div className="text-sm text-muted-foreground">开启后，预定需要审批人同意</div>
                      </div>
                      <Switch 
                        checked={formData.requireApproval}
                        disabled
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>审批范围</Label>
                      <Select disabled>
                        <SelectTrigger>
                          <SelectValue placeholder="全部预定需要审批" />
                        </SelectTrigger>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>审批类型</Label>
                      <Select disabled>
                        <SelectTrigger>
                          <SelectValue placeholder="指定审批人" />
                        </SelectTrigger>
                      </Select>
                    </div>
                  </div>

                  {/* 会议室预定规则 - 部分只读 */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">会议室预定规则</h3>
                    
                    <div className="flex items-center justify-between py-3 border-b border-border">
                      <div>
                        <div className="font-medium">允许周期预定</div>
                        <div className="text-sm text-muted-foreground">开启后，用户可以创建重复会议</div>
                      </div>
                      <Switch 
                        checked={formData.allowRecurring}
                        onCheckedChange={(checked) => setFormData({ ...formData, allowRecurring: checked })}
                      />
                    </div>

                    <div className="space-y-4 opacity-60">
                      <div className="space-y-2">
                        <Label>会议室开放时间</Label>
                        <div className="flex items-center gap-2">
                          <Input value="09:00" disabled />
                          <span>至</span>
                          <Input value="22:00" disabled />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>可提前预定时间</Label>
                        <Select disabled>
                          <SelectTrigger>
                            <SelectValue placeholder="7天" />
                          </SelectTrigger>
                        </Select>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>单次最小时长</Label>
                          <Select disabled>
                            <SelectTrigger>
                              <SelectValue placeholder="30分钟" />
                            </SelectTrigger>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>单次最长时长</Label>
                          <Select disabled>
                            <SelectTrigger>
                              <SelectValue placeholder="4小时" />
                            </SelectTrigger>
                          </Select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* 设备列表 */}
              <TabsContent value="devices" className="space-y-6">
                <div className="bg-card rounded-lg border border-border p-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold">设备列表</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        管理绑定到此会议室的所有设备
                      </p>
                    </div>

                    {roomDevices.length === 0 ? (
                      <div className="text-center py-12 text-muted-foreground">
                        暂无绑定设备
                      </div>
                    ) : (
                      <div className="border rounded-lg">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>设备名称</TableHead>
                              <TableHead>类型</TableHead>
                              <TableHead>设备型号</TableHead>
                              <TableHead>所属会议室</TableHead>
                              <TableHead>状态</TableHead>
                              <TableHead>固件版本</TableHead>
                              <TableHead>应用版本</TableHead>
                              <TableHead className="text-right">操作</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {roomDevices.map((device) => (
                              <TableRow key={device.id}>
                                <TableCell className="font-medium">{device.name}</TableCell>
                                <TableCell>{device.type}</TableCell>
                                <TableCell>{device.model}</TableCell>
                                <TableCell>{room?.name}</TableCell>
                                <TableCell>
                                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getDeviceStatusColor(device.status)}`}>
                                    {device.status}
                                  </span>
                                </TableCell>
                                <TableCell className="text-muted-foreground">{device.firmwareVersion}</TableCell>
                                <TableCell className="text-muted-foreground">{device.appVersion}</TableCell>
                                <TableCell className="text-right">
                                  <div className="flex gap-2 justify-end">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => handleViewDeviceDetail(device.id)}
                                    >
                                      <ExternalLink className="h-4 w-4 mr-1" />
                                      详情
                                    </Button>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => handleUnbindDevice(device)}
                                    >
                                      解绑
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      {/* 关闭预定确认弹窗 */}
      <AlertDialog open={showCloseConfirm} onOpenChange={setShowCloseConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>请确认</AlertDialogTitle>
            <AlertDialogDescription>
              一旦关闭预定，所有在关闭时间内的会议室预定将被释放。确定要执行此操作吗？
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction onClick={confirmCloseBooking}>确定</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* 解绑设备确认弹窗 */}
      <AlertDialog open={showUnbindConfirm} onOpenChange={setShowUnbindConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认解绑</AlertDialogTitle>
            <AlertDialogDescription>
              您确定要将设备 "{selectedDevice?.name}" 从会议室 "{room?.name}" 解绑吗？解绑后，会议室的预约和控制功能可能受影响。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmUnbind}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              确认解绑
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default RoomEdit;
