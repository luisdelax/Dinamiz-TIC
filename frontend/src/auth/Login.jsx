import { useState } from "react";
import { useAuth } from "./AuthContext";
import axios from "../api/axios";
import Spinner from "../components/Spinner";
// Import necessary icons
import { FaGithub, FaTwitter, FaLinkedinIn, FaGoogle, FaFacebookF, FaLeaf } from 'react-icons/fa';

export default function Login() {
  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [shake, setShake] = useState(false);

  const { login } = useAuth();

  const handleChange = (e) => {
    setError("");
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axios.post("/auth/login/", form);
      login(res.data.access, res.data.refresh);
    } catch (err) {
      setError("Credenciales incorrectas");
      setShake(true);
      setTimeout(() => setShake(false), 400);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex lg:justify-end font-sans"> {/* Changed to lg:justify-end to push right column to end */}
      {/* Left Column (Visual) - Hidden on small screens */}
      <div className="hidden lg:flex lg:w-4/12 xl:w-3/12
                    flex-col justify-between p-8 relative
                    bg-gradient-to-br from-[#2ECC71] via-[#27AE60] to-[#A9DFBF]
                    rounded-r-[50px] shadow-lg"> {/* Added shadow-lg */}
        {/* 'Follow' Title */}
        <div className="text-white text-left">
          <h2 className="text-xl font-semibold mb-4">Follow</h2>
          <ul className="space-y-4">
            <li><a href="#" className="flex items-center text-white hover:text-gray-200 transition-colors duration-300">
                <FaGithub size={24} className="mr-3" /> GitHub
              </a></li>
            <li><a href="#" className="flex items-center text-white hover:text-gray-200 transition-colors duration-300">
                <FaTwitter size={24} className="mr-3" /> Twitter
              </a></li>
            <li><a href="#" className="flex items-center text-white hover:text-gray-200 transition-colors duration-300">
                <FaLinkedinIn size={24} className="mr-3" /> LinkedIn
              </a></li>
          </ul>
        </div>

        {/* Footer Text */}
        <p className="text-white/70 text-sm text-left">
          © 2026 IT Management System. All rights reserved.
        </p>
      </div>

      {/* Right Column (Login) */}
      <div className="w-full lg:w-8/12 xl:w-9/12
                    flex items-center justify-center min-h-screen bg-white">
        <div
          className={`relative w-full max-w-md p-8 bg-white rounded-lg shadow-xl
            ${shake ? "animate-shake" : ""}
          `}
        >
          {/* Logo and App Name */}
          <div className="flex flex-col items-center mb-8">
            <div className="bg-[#2ECC71] rounded-full p-3 mb-2">
              <FaLeaf size={32} className="text-white" /> {/* Leaf icon as placeholder */}
            </div>
            <h1 className="text-3xl font-semibold text-gray-800">
              IT Management
            </h1>
            <p className="text-gray-600 text-sm mt-1">
              Inicia sesión para continuar
            </p>
          </div>

          {/* ERROR */}
          {error && (
            <div className="mb-4 text-sm text-red-700 bg-red-100 p-3 rounded-lg text-center animate-fade-error">
              {error}
            </div>
          )}

          {/* FORMULARIO */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <input
                type="text"
                name="username"
                placeholder="Usuario"
                value={form.username}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg
                  focus:outline-none focus:ring-2 focus:ring-[#2ECC71] focus:border-transparent
                  transition duration-300 ease-in-out font-normal text-gray-700"
              />
              <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"></path>
              </svg>
            </div>


            <div className="relative">
              <input
                type="password"
                name="password"
                placeholder="Contraseña"
                value={form.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg
                  focus:outline-none focus:ring-2 focus:ring-[#2ECC71] focus:border-transparent
                  transition duration-300 ease-in-out font-normal text-gray-700"
              />
              <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"></path>
                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"></path>
              </svg>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-[#2ECC71] text-white
                font-medium flex items-center justify-center gap-2
                hover:bg-[#27AE60] transition-colors duration-300
                disabled:opacity-60 disabled:cursor-not-allowed text-lg"
            >
              {loading ? (
                <>
                  <Spinner />
                  <span>Ingresando...</span>
                </>
              ) : (
                "Iniciar sesión" // Changed text from "Ingresar"
              )}
            </button>
          </form>

          {/* Separador "or" */}
          <div className="flex items-center my-8">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="flex-shrink mx-4 text-gray-400 text-sm">o</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>

          {/* Botones sociales */}
          <div className="flex justify-center space-x-4">
            <button className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors duration-300">
              <FaGoogle size={20} />
            </button>
            <button className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors duration-300">
              <FaFacebookF size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
