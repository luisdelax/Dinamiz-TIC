import React, { useContext, useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { useAuth } from '../../auth/AuthContext';
import { router } from 'expo-router';
import { jwtDecode } from 'jwt-decode';
import { FontAwesome } from '@expo/vector-icons';
import { AppColors } from '../../constants/Colors';
import AppButton from '../../components/ui/Button'; // Import the new AppButton

export default function ProfileScreen() {
  const { user, logout, token } = useAuth();
  const [sessionTimeLeft, setSessionTimeLeft] = useState('');

  useEffect(() => {
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const expirationTime = decodedToken.exp * 1000;

        const updateTimer = () => {
          const currentTime = Date.now();
          const timeLeft = expirationTime - currentTime;

          if (timeLeft <= 0) {
            setSessionTimeLeft('Sesión expirada');
            return;
          }

          const minutes = Math.floor(timeLeft / (1000 * 60));
          const seconds = Math.floor(((timeLeft % (1000 * 60)) / 1000));
          setSessionTimeLeft(`${minutes}m ${seconds}s`);
        };

        updateTimer();
        const intervalId = setInterval(updateTimer, 1000);

        return () => clearInterval(intervalId);
      } catch (error) {
        console.error("Error decoding token:", error);
        setSessionTimeLeft('Error al obtener tiempo de sesión');
      }
    } else {
      setSessionTimeLeft('No hay sesión activa');
    }
  }, [token, logout]);


  const handleLogout = async () => {
    Alert.alert(
      "Cerrar Sesión",
      "¿Estás seguro de que quieres cerrar tu sesión?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Cerrar Sesión",
          onPress: async () => {
            await logout();
            router.replace('/login');
          },
          style: "destructive",
        },
      ]
    );
  };

  const handleChangePassword = () => {
    router.push('/profile/change-password');
  };


  if (!user) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>No hay información de usuario disponible.</Text>
        <AppButton
          title="Ir a Login"
          onPress={() => router.replace('/login')}
          variant="primary"
        />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>


      <View style={styles.card}>
        <Text style={styles.title}>{user.first_name} {user.last_name}</Text>
        <Text style={styles.subtitle}>{user.username}</Text>

        <View style={styles.separator} />

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Email:</Text>
          <Text style={styles.infoValue}>{user.email || 'N/A'}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Rol:</Text>
          <Text style={styles.infoValue}>{user.role}</Text>
        </View>
        {user.site && (
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Sede:</Text>
            <Text style={styles.infoValue}>{user.site.name}</Text>
          </View>
        )}
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Activo:</Text>
          <Text style={styles.infoValue}>{user.is_active ? 'Sí' : 'No'}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Staff:</Text>
          <Text style={styles.infoValue}>{user.is_staff ? 'Sí' : 'No'}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Superusuario:</Text>
          <Text style={styles.infoValue}>{user.is_superuser ? 'Sí' : 'No'}</Text>
        </View>

        <View style={styles.separator} />

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Tiempo de Sesión:</Text>
          <Text style={styles.infoValue}>{sessionTimeLeft}</Text>
        </View>
      </View>

      <AppButton
        title="Cambiar Contraseña"
        onPress={handleChangePassword}
        variant="secondary"
        style={{ marginBottom: 16 }}
      />

      <AppButton
        title="Cerrar Sesión"
        onPress={handleLogout}
        variant="danger"
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.background,
  },
  contentContainer: {
    padding: 24,
  },
  header: {
    fontSize: 32,
    fontWeight: 'bold',
    color: AppColors.primaryDark,
    marginBottom: 24,
  },
  card: {
    backgroundColor: AppColors.cardBackground,
    borderRadius: 12,
    padding: 24,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: AppColors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: AppColors.subtleText,
    marginBottom: 20,
  },
  separator: {
    height: 1,
    backgroundColor: AppColors.lightGray,
    marginVertical: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  infoLabel: {
    fontSize: 16,
    color: AppColors.subtleText,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
    color: AppColors.text,
    textAlign: 'right',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: AppColors.background,
  },
  errorText: {
    color: AppColors.error,
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
  },
});
