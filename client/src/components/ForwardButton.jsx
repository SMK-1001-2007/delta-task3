import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const ForwardButton = ({ label = "Back", page}) => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(page)}
      className="flex items-center gap-2 text-white hover:text-yellow-400 transition px-3 py-2 rounded-lg"
    >
      <span className="text-base font-medium">{label}</span>
    </button>
  );
};

export default ForwardButton;