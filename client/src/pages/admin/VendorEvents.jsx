
// AdminVendorEvents.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../../services/api";
import EventCard from "../../components/EventCard";
import ForwardButton from "../../components/ForwardButton";

const AdminVendorEvents = () => {
  const { vendorId } = useParams();
  const [events, setEvents] = useState([]);

  useEffect(() => {
      const fetchEvents = async () => {
    try {
      const res = await axios.get(`/api/admin/events/vendor/${vendorId}`);
      setEvents(res.data.events);
    } catch (err) {
        console.log(err)
      alert("Error loading vendor events");
    }
  };
    fetchEvents();
  }, [vendorId]);


  return (
    <div className="p-8 text-white min-h-screen bg-gray-900">
      <div className="flex justify-end">
        <ForwardButton label="All Vendors" page="/admin/vendors" />
      </div>
      <h1 className="text-2xl font-bold mb-4">Vendor's Events</h1>
      {events.length === 0 ? (
        <p>No events found for this vendor.</p>
      ) : (
        events.map(event => (
          <EventCard key={event._id} {...event} />
        ))
      )}
    </div>
  );
};

export default AdminVendorEvents;
