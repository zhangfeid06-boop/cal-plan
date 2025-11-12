import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Booking from "./pages/Booking";
import RoomEdit from "./pages/RoomEdit";
import MyMeetings from "./pages/MyMeetings";
import GuestInvite from "./pages/GuestInvite";
import GuestPass from "./pages/GuestPass";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/room-edit/:id" element={<RoomEdit />} />
          <Route path="/my-meetings" element={<MyMeetings />} />
          <Route path="/display" element={<MyMeetings />} />
          <Route path="/energy" element={<MyMeetings />} />
          <Route path="/announcements" element={<MyMeetings />} />
          <Route path="/guest-invite/:bookingId" element={<GuestInvite />} />
          <Route path="/guest-pass/:guestId" element={<GuestPass />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
