import { useNavigate } from "react-router-dom";

const EventCard = ({
  _id,
  title,
  category,
  nextSchedule,
  price,
  buttonLabel = "Book Now",
  onButtonClick,
  buttonDisabled = false,
  children,
}) => {
  const navigate = useNavigate();
  const handleClick = onButtonClick || (() => navigate(`/user/events/${_id}/schedules`));

  return (
    <div className="border p-4 rounded shadow mb-5">
      <h2 className="text-xl font-semibold mb-1">{title}</h2>
      <p>Type: {category}</p>
      {nextSchedule && (
        <p className="font-semibold text-lg">
          {new Date(`${new Date(nextSchedule.date).toISOString().slice(0, 10)}T${nextSchedule.time}`).toLocaleString()}
        </p>
      )}
      {price !== undefined && <p>Price: ₹{price}</p>}

      {children ? (
        <div className="mt-2">{children}</div>
      ) : (
        <button
          onClick={handleClick}
          className="btn mt-2"
          disabled={buttonDisabled}
        >
          {buttonLabel}
        </button>
      )}
    </div>
  );
};


export default EventCard;
