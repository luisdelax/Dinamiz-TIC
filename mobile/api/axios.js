import axios from "axios";
import * as SecureStore from "expo-secure-store";

// ------------------------------------------------------------------
// 🛑 IMPORTANTE: Cambia esta URL por la dirección IP de tu máquina.
// No uses 'localhost' o '127.0.0.1'.
// En Windows, usa 'ipconfig'. En macOS/Linux, usa 'ifconfig' o 'ip a'.
// Debe ser algo como: 'http://192.168.1.100:8000'
// ------------------------------------------------------------------
const API_URL = "http://192.168.1.34:8000/api";

const api = axios.create({
  baseURL: API_URL,
});

// Interceptor para inyectar el token de acceso en las cabeceras
api.interceptors.request.use(
  async (config) => {
    const token = await SecureStore.getItemAsync("access");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor de respuesta para refrescar el token si ha expirado
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Comprueba si el error es 401 y no es un reintento
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = await SecureStore.getItemAsync("refresh");
      if (refreshToken) {
        try {
          // Usa una nueva instancia de axios para el refresh para evitar un bucle de interceptores
          const response = await axios.post(`${API_URL}/auth/refresh/`, {
            refresh: refreshToken,
          });
          const { access } = response.data;

          await SecureStore.setItemAsync("access", access);

          // Actualiza la cabecera de la petición original
          originalRequest.headers.Authorization = `Bearer ${access}`;

          return axios(originalRequest);
        } catch (refreshError) {
          console.error("Fallo al refrescar el token", refreshError);
          // Limpia los tokens viejos
          await SecureStore.deleteItemAsync("access");
          await SecureStore.deleteItemAsync("refresh");
          
          // AQUÍ: Deberías redirigir al usuario a la pantalla de Login.
          // Esto normalmente se gestiona con el estado de navegación global.
          // Por ejemplo: navigation.navigate('Login');

          return Promise.reject(refreshError);
        }
      } else {
        console.error("No hay refresh token disponible");
        // AQUÍ: También se debería redirigir al Login.
      }
    }

    return Promise.reject(error);
  }
);

export default api;
