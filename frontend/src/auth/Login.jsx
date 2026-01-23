import { useState } from "react";
import { useAuth } from "./AuthContext";
import axios from "../api/axios";
import Spinner from "../components/Spinner";

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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 animate-gradient">
      <div
        className={`relative w-full max-w-md p-8 rounded-2xl
          bg-white/10 backdrop-blur-xl shadow-2xl
          border border-white/20
          animate-fade-in
          ${shake ? "animate-shake" : ""}
        `}
      >
        {/* TÍTULO */}
        <h1 className="text-3xl font-bold text-white text-center mb-2">
          IT Management
        </h1>

        <p className="text-center text-white/70 mb-6">
          Inicia sesión para continuar
        </p>

        {/* ERROR */}
        {error && (
          <div className="mb-4 text-sm text-red-200 bg-red-500/20 p-2 rounded-lg text-center animate-fade-error">
            {error}
          </div>
        )}

        {/* FORMULARIO */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="username"
            placeholder="Usuario"
            value={form.username}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-xl bg-white/20
              text-white placeholder-white/60
              outline-none focus:ring-2 focus:ring-white
              transition"
          />

          <input
            type="password"
            name="password"
            placeholder="Contraseña"
            value={form.password}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-xl bg-white/20
              text-white placeholder-white/60
              outline-none focus:ring-2 focus:ring-white
              transition"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-white text-indigo-700
              font-semibold flex items-center justify-center gap-2
              hover:bg-indigo-100 transition-all duration-300
              disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Spinner />
                <span>Ingresando...</span>
              </>
            ) : (
              "Ingresar"
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-white/60">
          © 2026 IT Management System
        </p>
      </div>
    </div>
  );
}
