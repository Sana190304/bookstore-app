import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AuthLayout from "../components/AuthLayout";
import GoogleButton from "../components/GoogleButton";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <AuthLayout>
      <h1 className="font-display text-3xl mb-1">Welcome back!</h1>
      <p className="text-gray-500 mb-8">Login to continue shopping</p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border rounded-lg px-4 py-3 focus:ring-2 focus:ring-amber-400 outline-none"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border rounded-lg px-4 py-3 focus:ring-2 focus:ring-amber-400 outline-none"
          required
        />

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <button
          type="submit"
          className="bg-gradient-to-r from-amber-500 to-amber-600 text-white py-3 rounded-full hover:shadow-lg hover:scale-[1.02] active:scale-95 transition-transform mt-2"
        >
          Login
        </button>
      </form>

      <GoogleButton />

      <p className="text-sm text-gray-500 mt-6 text-center">
        Don't have an account?{" "}
        <Link to="/register" className="text-amber-700 font-medium hover:underline">
          Register
        </Link>
      </p>
    </AuthLayout>
  );
}
