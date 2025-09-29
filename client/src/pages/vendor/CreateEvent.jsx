import { useState } from "react";
import axios from "../../services/api";
import { useNavigate } from "react-router-dom";
import BackButton from "../../components/BackButton";

const CreateEvent = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    category: "movie",
    description: "",
    location: "",
    source: "",
    destination: "",
    price: ""
  });

  const [schedules, setSchedules] = useState([
    { date: "", time: "", totalSeats: "" }
  ]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleScheduleChange = (index, e) => {
    const newSchedules = [...schedules];
    newSchedules[index][e.target.name] = e.target.value;
    setSchedules(newSchedules);
  };

  const addSchedule = () => {
    setSchedules([...schedules, { date: "", time: "", totalSeats: "" }]);
  };

  const removeSchedule = (index) => {
    const newSchedules = schedules.filter((_, i) => i !== index);
    setSchedules(newSchedules);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        schedules
      };
      const res = await axios.post("/api/vendors/events/create", payload);
      alert(res.data.message || "Event created successfully!");
      navigate("/vendor/my-events");
    } catch (err) {
      console.error(err);
      alert("Failed to create event.");
    }
  };

  const isTrain = formData.category === "train";
  const isMovieOrConcert = ["movie", "concert"].includes(formData.category);

  return (
    <div className="p-6 mx-auto min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <div className="flex justify-start">
        <BackButton label="Go Back"></BackButton>
      </div>
      <div className="max-w-2xl mx-auto p-4 ">
        <h1 className="text-2xl font-bold mb-4">Create New Event</h1>
        <form onSubmit={handleSubmit} className="space-y-4">

          <input name="title" placeholder="Title" required className="input" onChange={handleChange} />

          <select name="category" value={formData.category} onChange={handleChange} className="input">
            <option value="movie">Movie</option>
            <option value="concert">Concert</option>
            <option value="train">Train</option>
          </select>

          <textarea name="description" placeholder="Description" className="input" onChange={handleChange} />

          {isMovieOrConcert && (
            <input name="location" placeholder="Location" className="input" onChange={handleChange} />
          )}

          {isTrain && (
            <>
              <input name="source" placeholder="Source" className="input" onChange={handleChange} />
              <input name="destination" placeholder="Destination" className="input" onChange={handleChange} />
            </>
          )}

          <input type="number" name="price" placeholder="Price per seat" required className="input" onChange={handleChange} />

          {/* Schedule Fields */}
          {schedules.map((schedule, index) => (
            <div key={index} className="space-y-2">
              <input
                type="date"
                name="date"
                required
                className="input"
                value={schedule.date}
                onChange={(e) => handleScheduleChange(index, e)}
              />
              <input
                type="time"
                name="time"
                required
                className="input"
                value={schedule.time}
                onChange={(e) => handleScheduleChange(index, e)}
              />
              <input
                type="number"
                name="totalSeats"
                placeholder="Total seats"
                required
                className="input"
                value={schedule.totalSeats}
                onChange={(e) => handleScheduleChange(index, e)}
              />
              {schedules.length > 1 && (
                <button type="button" className="btn text-sm bg-red-500" onClick={() => removeSchedule(index)}>
                  Remove Slot
                </button>
              )}
            </div>
          ))}

          <div className="space-x-4">
          <button type="button" className="btn" onClick={addSchedule}>
            + Add Another Slot
          </button>

          <button type="submit" className="btn">Create Event</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEvent;
