import { useState } from 'react';
import { MeetingRoom } from '@/types/meeting-room';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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
import { Pencil, Trash2 } from 'lucide-react';

interface RoomManagementTableProps {
  rooms: MeetingRoom[];
  onEdit: (room: MeetingRoom) => void;
  onDelete: (roomId: string) => void;
}

export function RoomManagementTable({ rooms, onEdit, onDelete }: RoomManagementTableProps) {
  const [deleteRoom, setDeleteRoom] = useState<MeetingRoom | null>(null);

  const handleDeleteConfirm = () => {
    if (deleteRoom) {
      onDelete(deleteRoom.id);
      setDeleteRoom(null);
    }
  };

  return (
    <>
      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              <TableHead className="font-semibold">会议室</TableHead>
              <TableHead className="font-semibold">所属分组</TableHead>
              <TableHead className="font-semibold">可容纳人数</TableHead>
              <TableHead className="font-semibold">配套设施</TableHead>
              <TableHead className="font-semibold">会议水牌</TableHead>
              <TableHead className="font-semibold">开放状态</TableHead>
              <TableHead className="font-semibold text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rooms.map((room) => (
              <TableRow key={room.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <img
                      src={room.image}
                      alt={room.name}
                      className="h-12 w-16 rounded object-cover bg-muted"
                    />
                    <div>
                      <div className="font-medium">{room.name}</div>
                      <div className="text-sm text-muted-foreground">{room.location}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">{room.group}</TableCell>
                <TableCell className="text-muted-foreground">
                  {room.capacity > 0 ? `${room.capacity}人` : '未完善'}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {room.facilities.length > 0 ? room.facilities.join('、') : '无'}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {room.waterSign || '未关联'}
                </TableCell>
                <TableCell>
                  <Badge variant={room.isOpen ? 'default' : 'secondary'} className={room.isOpen ? 'bg-success' : 'bg-warning'}>
                    {room.isOpen ? '启用' : '停用'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(room)}
                      className="text-primary hover:text-primary hover:bg-accent"
                    >
                      <Pencil className="h-4 w-4 mr-1" />
                      编辑
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setDeleteRoom(room)}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      删除
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={!!deleteRoom} onOpenChange={() => setDeleteRoom(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>请确认</AlertDialogTitle>
            <AlertDialogDescription>
              您确定要删除会议室【{deleteRoom?.name}】吗？删除后不可恢复且历史预定失效，设备将从组织解绑。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive hover:bg-destructive/90">
              确定
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
