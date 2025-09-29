import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import Profile from "./pages/Profile";
import VendorDashboard from "./pages/vendor/Dashboard";
import CreateEvent from "./pages/vendor/CreateEvent";
import MyEvents from "./pages/vendor/MyEvents";
import EditEvent from "./pages/vendor/EditEvent";
import EventBookings from "./pages/vendor/EventBookings";
import EventList from "./pages/user/EventList";
import EventDetail from "./pages/user/EventDetail";
import EventSchedule from "./pages/user/EventSchedule"
import TicketSummary from "./pages/user/TicketSummary";
import MyBookings from "./pages/user/MyBookings";

import AdminDashboard from "./pages/admin/Dashboard"
import AdminEventList from "./pages/admin/EventList";
import AdminCreateEvent from "./pages/admin/CreateEvent";
import AdminEventDetail from "./pages/admin/EventDetail";
import AdminEditEvent from "./pages/admin/EditEvent";
import AdminVendorEvents from "./pages/admin/VendorEvents";
import AdminUserEvents from "./pages/admin/UserEvents";
import AdminVendorList from "./pages/admin/VendorList";
import AdminVendorDetail from "./pages/admin/VendorDetail";
import AdminUserList from "./pages/admin/UserList";
import AdminUserDetail from "./pages/admin/UserDetail";


const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/auth/login" element={<Login />} />
      <Route path="/auth/register" element={<Register />} />
      <Route path="/auth/forgot-password" element={<ForgotPassword />} />
      <Route path="/auth/reset-password/:token" element={<ResetPassword />} />
      <Route path="/vendor/dashboard" element={<VendorDashboard />} />
      <Route path="/vendor/create-event" element={<CreateEvent />} />
      <Route path="/vendor/my-events" element={<MyEvents />} />
      <Route path="/vendor/edit-event/:eventId" element={<EditEvent />} />
      <Route path="/vendor/bookings/:eventId" element={<EventBookings />} />
      <Route path="/user/events" element={<EventList />} />
      <Route path="/user/events/:eventId/schedules" element={<EventSchedule />} />
      <Route path="/user/events/:eventId/schedule/:scheduleId" element={<EventDetail />} />
      <Route path="/user/ticket-summary" element={<TicketSummary />} />
      <Route path="/user/my-bookings" element={<MyBookings />} />

      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="/admin/events" element={<AdminEventList />} />
      <Route path="/admin/events/create" element={<AdminCreateEvent />} />
      <Route path="/admin/events/:eventId" element={<AdminEventDetail />} />
      <Route path="/admin/events/edit/:eventId" element={<AdminEditEvent />} />
      <Route path="/admin/events/vendor/:vendorId" element={<AdminVendorEvents />} />
      <Route path="/admin/events/user/:userId" element={<AdminUserEvents />} />

      <Route path="/admin/vendors" element={<AdminVendorList />} />
      <Route path="/admin/vendors/:vendorId" element={<AdminVendorDetail />} />

      <Route path="/admin/users" element={<AdminUserList />} />
      <Route path="/admin/users/:userId" element={<AdminUserDetail />} />
    </Routes>
  );
};

export default AppRoutes;