import React, { useContext, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SplashScreen } from 'expo-router';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { ActivityIndicator, View } from 'react-native';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors, AppColors } from '@/constants/Colors'; // Import both Colors and AppColors
import { AuthProvider, AuthContext } from '../auth/AuthContext'; // Ajusta la ruta si es necesario

// Previene que la pantalla de splash se oculte automáticamente
SplashScreen.preventAutoHideAsync();

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const { isAuthenticated, isLoading } = useContext(AuthContext);

  useEffect(() => {
    if (!isLoading) {
      // Oculta la pantalla de splash una vez que el estado de autenticación se ha cargado
      SplashScreen.hideAsync();

      if (isAuthenticated) {
        // Redirige a la ruta principal si el usuario está autenticado
        router.replace('/(tabs)'); // Asumiendo que (tabs) es tu ruta principal protegida
      } else {
        // Redirige a la pantalla de login si no está autenticado
        router.replace('/login');
      }
    }
  }, [isAuthenticated, isLoading]);

  // Si aún estamos cargando el estado de autenticación, muestra un indicador
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // Create custom themes based on the new Colors constant
  const MyLightTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: AppColors.primary,
      background: AppColors.background,
      card: AppColors.cardBackground,
      text: AppColors.text,
      border: AppColors.lightGray,
      notification: AppColors.accent,
    },
  };

  const MyDarkTheme = {
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
      // Use Colors.dark for dark theme properties as AppColors is primarily light
      primary: Colors.dark.tint,
      background: Colors.dark.background,
      card: Colors.dark.cardBackground,
      text: Colors.dark.text,
      border: Colors.dark.lightGray,
      notification: Colors.dark.accent,
    },
  };

  return (
    <ThemeProvider value={colorScheme === 'dark' ? MyDarkTheme : MyLightTheme}>
      <Stack>
        {/* Aquí definimos las rutas principales */}
        {isAuthenticated ? (
          // Rutas para usuarios autenticados (ej. tabs principales)
          <Stack.Screen name="(tabs)" options={{ title: 'Dinamizador TIC' }} />
        ) : (
          // Rutas para usuarios no autenticados (ej. pantalla de login)
          <Stack.Screen name="login" options={{ headerShown: false }} />
        )}
        {/* Si necesitas un modal u otras rutas globales que no se vean afectadas por la autenticación */}
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <RootLayoutNav />
      </QueryClientProvider>
    </AuthProvider>
  );
}