import { Link } from "react-router-dom";

const Home = () => {
    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-gray-900 to-gray-800 text-white px-4">
        <h1 className="text-5xl font-extrabold mb-6 text-center">
            Welcome to <span className="text-yellow-500">TicketX</span>
        </h1>
        <p className="text-lg text-gray-300 mb-8 text-center max-w-xl">
            A universal ticket booking system for events, shows, and more. Book your tickets with ease and security.
        </p>

        <div className="flex gap-6">
            <Link
            to="/auth/register"
            className="bg-yellow-600 hover:bg-yellow-700 px-6 py-3 rounded-xl text-lg font-semibold shadow-md transition"
            >
            Register
            </Link>
            <Link
            to="/auth/login"
            className="bg-gray-700 hover:bg-gray-800 px-6 py-3 rounded-xl text-lg font-semibold shadow-md transition"
            >
            Login
            </Link>
        </div>
        </div>
    );
};

export default Home;
