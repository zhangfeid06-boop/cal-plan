import { useState } from 'react';
import { AppSidebar } from '@/components/layout/AppSidebar';
import { PageHeader } from '@/components/layout/PageHeader';
import { RoomManagementTable } from '@/components/rooms/RoomManagementTable';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Search } from 'lucide-react';
import { mockRooms } from '@/lib/mock-data';
import { MeetingRoom } from '@/types/meeting-room';
import { toast } from 'sonner';

const Index = () => {
  const [rooms, setRooms] = useState<MeetingRoom[]>(mockRooms);
  const [searchQuery, setSearchQuery] = useState('');
  const [groupFilter, setGroupFilter] = useState('all');
  const [facilityFilter, setFacilityFilter] = useState('all');

  const handleEdit = (room: MeetingRoom) => {
    toast.info(`编辑会议室：${room.name}`);
    // In real app, navigate to edit page
  };

  const handleDelete = (roomId: string) => {
    setRooms(rooms.filter(r => r.id !== roomId));
    toast.success('会议室已删除');
  };

  const filteredRooms = rooms.filter(room => {
    const matchesSearch = room.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         room.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGroup = groupFilter === 'all' || room.group === groupFilter;
    const matchesFacility = facilityFilter === 'all' || room.facilities.includes(facilityFilter);
    return matchesSearch && matchesGroup && matchesFacility;
  });

  const groups = Array.from(new Set(rooms.map(r => r.group)));
  const allFacilities = Array.from(new Set(rooms.flatMap(r => r.facilities)));

  return (
    <div className="flex h-screen bg-background">
      <AppSidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <PageHeader
          title="会议室管理"
          action={
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              新增会议室
            </Button>
          }
        >
          <div className="flex gap-3 mt-4">
            <Select value={groupFilter} onValueChange={setGroupFilter}>
              <SelectTrigger className="w-[200px] bg-card">
                <SelectValue placeholder="会议室位置" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部位置</SelectItem>
                {groups.map(group => (
                  <SelectItem key={group} value={group}>{group}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={facilityFilter} onValueChange={setFacilityFilter}>
              <SelectTrigger className="w-[200px] bg-card">
                <SelectValue placeholder="配套设施" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部设施</SelectItem>
                {allFacilities.map(facility => (
                  <SelectItem key={facility} value={facility}>{facility}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="搜索会议室名称/位置"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 bg-card"
              />
            </div>
          </div>
        </PageHeader>

        <div className="flex-1 overflow-auto p-8">
          <RoomManagementTable
            rooms={filteredRooms}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />

          <div className="mt-6 flex items-center justify-between text-sm text-muted-foreground">
            <div>共计 {filteredRooms.length} 条</div>
            <div className="flex items-center gap-2">
              <span>20条/页</span>
              <div className="flex items-center gap-1">
                <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                  1
                </Button>
                <span className="px-2">跳至</span>
                <Input className="h-8 w-12 text-center" defaultValue="1" />
                <span className="px-2">页</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
