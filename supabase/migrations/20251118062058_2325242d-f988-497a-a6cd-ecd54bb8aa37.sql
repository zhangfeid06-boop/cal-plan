-- 创建会议室表
CREATE TABLE public.meeting_rooms (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  floor TEXT NOT NULL,
  capacity INTEGER NOT NULL,
  equipment TEXT[] DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'available',
  image_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 创建会议预约表
CREATE TABLE public.bookings (
  id TEXT PRIMARY KEY,
  room_id TEXT NOT NULL REFERENCES public.meeting_rooms(id) ON DELETE CASCADE,
  room_name TEXT NOT NULL,
  title TEXT NOT NULL,
  organizer TEXT NOT NULL,
  organizer_id TEXT,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  participants TEXT[] DEFAULT '{}',
  description TEXT,
  notification_minutes INTEGER DEFAULT 15,
  status TEXT NOT NULL DEFAULT 'confirmed',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 创建设备表
CREATE TABLE public.devices (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  model TEXT NOT NULL,
  room_id TEXT REFERENCES public.meeting_rooms(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'idle',
  firmware_version TEXT,
  app_version TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 创建访客登记表
CREATE TABLE public.guest_registrations (
  id TEXT PRIMARY KEY,
  booking_id TEXT NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  attendee_count INTEGER,
  car_plate TEXT,
  company TEXT,
  agreed_to_terms BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 启用 RLS
ALTER TABLE public.meeting_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guest_registrations ENABLE ROW LEVEL SECURITY;

-- 会议室表 RLS 策略（公开可读）
CREATE POLICY "Anyone can view meeting rooms"
ON public.meeting_rooms FOR SELECT
USING (true);

-- 预约表 RLS 策略（公开可读，方便访客查看）
CREATE POLICY "Anyone can view bookings"
ON public.bookings FOR SELECT
USING (true);

CREATE POLICY "Anyone can create bookings"
ON public.bookings FOR INSERT
WITH CHECK (true);

-- 设备表 RLS 策略（公开可读）
CREATE POLICY "Anyone can view devices"
ON public.devices FOR SELECT
USING (true);

-- 访客登记表 RLS 策略（公开可创建，方便访客登记）
CREATE POLICY "Anyone can register as guest"
ON public.guest_registrations FOR INSERT
WITH CHECK (true);

CREATE POLICY "Anyone can view their registration"
ON public.guest_registrations FOR SELECT
USING (true);

-- 创建更新时间触发器函数
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 为相关表添加更新时间触发器
CREATE TRIGGER update_meeting_rooms_updated_at
  BEFORE UPDATE ON public.meeting_rooms
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at
  BEFORE UPDATE ON public.bookings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_devices_updated_at
  BEFORE UPDATE ON public.devices
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- 创建索引以提升查询性能
CREATE INDEX idx_bookings_room_id ON public.bookings(room_id);
CREATE INDEX idx_bookings_start_time ON public.bookings(start_time);
CREATE INDEX idx_devices_room_id ON public.devices(room_id);
CREATE INDEX idx_guest_registrations_booking_id ON public.guest_registrations(booking_id);