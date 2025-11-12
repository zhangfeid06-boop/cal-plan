import { AppSidebar } from '@/components/layout/AppSidebar';
import { PageHeader } from '@/components/layout/PageHeader';

const MyMeetings = () => {
  return (
    <div className="flex h-screen bg-background">
      <AppSidebar />
      <div className="flex-1 flex flex-col">
        <PageHeader title="我的会议" />
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center text-muted-foreground">
            <p>我的会议功能开发中...</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyMeetings;
