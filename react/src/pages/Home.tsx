import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-4">Welcome to QuickNotes</h1>
      <p className="text-xl mb-8">Your personal note-taking app</p>
      <div className="space-x-4">
        <a href="/login" className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600">Login</a>
        <a href="/register" className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600">Register</a>
      </div>
    </div>
  );
};

export default Home;
