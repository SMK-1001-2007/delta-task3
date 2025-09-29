import { useEffect, useState } from "react";
import axios from "../../services/api";
import { useParams, useNavigate } from "react-router-dom";
import BackButton from "../../components/BackButton";

const EditEvent = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(null);
  const [newSchedules, setNewSchedules] = useState([]);
  const [hasBookings, setHasBookings] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await axios.get(`/api/vendors/events/${eventId}`);
        setFormData(res.data.event);

        // Check if any seat is booked across schedules
        const booked = res.data.event.schedules.some(sch =>
          sch.seats.some(seat => seat.status === "booked")
        );
        setHasBookings(booked);
      } catch (err) {
        console.error(err);
        alert("Failed to load event.");
        navigate("/vendor/my-events");
      }
    };
    fetchEvent();
  }, [eventId, navigate]);

  const handleChange = (e) => {
    if (!hasBookings) {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleNewScheduleChange = (index, e) => {
    const updated = [...newSchedules];
    updated[index][e.target.name] = e.target.value;
    setNewSchedules(updated);
  };

  const addScheduleField = () => {
    setNewSchedules([...newSchedules, { date: "", time: "", totalSeats: "" }]);
  };

  const removeScheduleField = (index) => {
    const updated = [...newSchedules];
    updated.splice(index, 1);
    setNewSchedules(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = hasBookings
        ? { schedules: newSchedules }
        : { ...formData, schedules: [...formData.schedules, ...newSchedules] };

      await axios.put(`/api/vendors/events/update/${eventId}`, payload);
      alert("Event updated successfully!");
      navigate("/vendor/my-events");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to update event.");
    }
  };

  if (!formData) return <p>Loading...</p>;

  const isMovieOrConcert = ["movie", "concert"].includes(formData.category);

  return (
    <div className="p-6 mx-auto min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <div className="flex justify-start">
        <BackButton label="Go Back" />
      </div>
      <div className="max-w-2xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Edit Event</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="input"
            required
            disabled={hasBookings}
          />

          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="input"
            disabled
          >
            <option value="movie">Movie</option>
            <option value="concert">Concert</option>
            <option value="train">Train</option>
          </select>

          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="input"
            disabled={hasBookings}
          />

          {isMovieOrConcert && (
            <input
              name="location"
              value={formData.location || ""}
              onChange={handleChange}
              className="input"
              placeholder="Location"
              disabled={hasBookings}
            />
          )}

          {formData.category === "train" && (
            <>
              <input
                name="source"
                value={formData.source || ""}
                onChange={handleChange}
                className="input"
                placeholder="Source"
                disabled={hasBookings}
              />
              <input
                name="destination"
                value={formData.destination || ""}
                onChange={handleChange}
                className="input"
                placeholder="Destination"
                disabled={hasBookings}
              />
            </>
          )}

          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            className="input"
            required
            disabled={hasBookings}
          />

          {/* Existing Schedules (read-only) */}
          {formData.schedules.map((sch, idx) => (
            <div key={idx}>
              <input
                type="date"
                className="input"
                name="date"
                value={sch.date?.split("T")[0]}
                onChange={(e) => {
                  if (!hasBookings) {
                    const updated = [...formData.schedules];
                    updated[idx].date = e.target.value;
                    setFormData({ ...formData, schedules: updated });
                  }
                }}
                disabled={hasBookings}
                required
              />
              <input
                type="time"
                className="input"
                name="time"
                value={sch.time}
                onChange={(e) => {
                  if (!hasBookings) {
                    const updated = [...formData.schedules];
                    updated[idx].time = e.target.value;
                    setFormData({ ...formData, schedules: updated });
                  }
                }}
                disabled={hasBookings}
                required
              />
              <input
                type="number"
                className="input"
                name="totalSeats"
                value={sch.totalSeats}
                onChange={(e) => {
                  if (!hasBookings) {
                    const updated = [...formData.schedules];
                    updated[idx].totalSeats = e.target.value;
                    setFormData({ ...formData, schedules: updated });
                  }
                }}
                disabled={hasBookings}
                required
              />
              {!hasBookings && formData.schedules.length > 1 && (
                <button
                  type="button"
                  onClick={() => {
                    const updated = [...formData.schedules];
                    updated.splice(idx, 1);
                    setFormData({ ...formData, schedules: updated });
                  }}
                  className="btn bg-red-600 text-sm mt-1"
                >
                  Remove Slot
                </button>
              )}
            </div>
          ))}


          {/* New Schedules (editable only if you want to add) */}
          {newSchedules.map((sch, idx) => (
            <div key={idx}>
              <input
                type="date"
                name="date"
                value={sch.date}
                onChange={(e) => handleNewScheduleChange(idx, e)}
                className="input"
                required
              />
              <input
                type="time"
                name="time"
                value={sch.time}
                onChange={(e) => handleNewScheduleChange(idx, e)}
                className="input"
                required
              />
              <input
                type="number"
                name="totalSeats"
                value={sch.totalSeats}
                onChange={(e) => handleNewScheduleChange(idx, e)}
                className="input"
                placeholder="Total Seats"
                required
              />
              {newSchedules.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeScheduleField(idx)}
                  className="btn bg-red-600 text-sm mt-1"
                >
                  Remove Slot
                </button>
              )}
            </div>
          ))}

          <button
            type="button"
            onClick={addScheduleField}
            className="btn bg-blue-600"
          >
            + Add Another Slot
          </button>

          <div className="space-y-4">
            <button type="submit" className="btn">
              Update Event
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditEvent;
