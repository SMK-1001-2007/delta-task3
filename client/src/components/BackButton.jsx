import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const BackButton = ({ label = "Back" }) => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(-1)}
      className="flex items-center gap-2 text-white hover:text-yellow-400 transition py-2 rounded-lg"
    >
      <ArrowLeft className="w-5 h-5" />
      <span className="text-base font-medium">{label}</span>
    </button>
  );
};

export default BackButton;
