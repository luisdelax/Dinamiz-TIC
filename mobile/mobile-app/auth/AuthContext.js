import React, { createContext, useState, useEffect, useContext } from 'react';
import { getItemAsync, setItemAsync, deleteItemAsync } from 'expo-secure-store'; // Importaciones directas
import api from '../api/axios'; // Importamos nuestra instancia de axios

// 1. Crear el Contexto
const AuthContext = createContext();

// 2. Crear el Proveedor del Contexto
const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    token: null,
    isAuthenticated: false,
    isLoading: true, // Para saber si estamos verificando el token inicial
    user: null, // Aquí almacenaremos la información del usuario, incluyendo el rol
  });

  // useEffect para verificar si ya existe un token al iniciar la app
  useEffect(() => {
    const loadTokenAndUser = async () => {
      const token = await getItemAsync('access'); // Usar getItemAsync directamente
      if (token) {
        try {
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          const userRes = await api.get('/users/me/');
          setAuthState({
            token: token,
            isAuthenticated: true,
            isLoading: false,
            user: userRes.data,
          });
        } catch (error) {
          console.error("Error al cargar perfil de usuario:", error);
          await deleteItemAsync('access'); // Usar deleteItemAsync directamente
          await deleteItemAsync('refresh'); // Usar deleteItemAsync directamente
          setAuthState({
            token: null,
            isAuthenticated: false,
            isLoading: false,
            user: null,
          });
        }
      } else {
        setAuthState({
          token: null,
          isAuthenticated: false,
          isLoading: false,
          user: null,
        });
      }
    };
    loadTokenAndUser();
  }, []);

  const login = async (username, password) => {
    try {
      const response = await api.post('/auth/login/', { username, password });
      const { access, refresh } = response.data;
      
      api.defaults.headers.common['Authorization'] = `Bearer ${access}`;
      const userRes = await api.get('/users/me/');

      await setItemAsync('access', access); // Usar setItemAsync directamente
      await setItemAsync('refresh', refresh); // Usar setItemAsync directamente
      
      setAuthState({
        token: access,
        isAuthenticated: true,
        isLoading: false,
        user: userRes.data,
      });

      return { success: true };
    } catch (error) {
      if (error.response) {
        console.error('Error de servidor:', error.response.data);
      } else if (error.request) {
        console.error('Error de red: No se pudo conectar al servidor. Revisa la IP en axios.js y la conexión de red.');
      } else {
        console.error('Error de configuración:', error.message);
      }
      return { success: false, error: 'Credenciales inválidas' };
    }
  };

  const logout = async () => {
    await deleteItemAsync('access'); // Usar deleteItemAsync directamente
    await deleteItemAsync('refresh'); // Usar deleteItemAsync directamente
    setAuthState({
      token: null,
      isAuthenticated: false,
      isLoading: false,
      user: null,
    });
  };

  const value = {
    ...authState,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personalizado para usar el contexto de autenticación más fácilmente
const useAuth = () => {
  return useContext(AuthContext);
};

export { AuthContext, AuthProvider, useAuth };
