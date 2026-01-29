import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, Pressable, Alert } from 'react-native';
import { useLocalSearchParams, Stack, router } from 'expo-router';
import api from '../../api/axios';
import { usePermission } from '../../hooks/usePermission';

import { AppColors } from '../../constants/Colors';

const DetailField = ({ label, value }) => (
  <View style={styles.detailField}>
    <Text style={styles.detailLabel}>{label}:</Text>
    <Text style={styles.detailValue}>{value || 'N/A'}</Text>
  </View>
);

export default function UserDetailScreen() {
  const { id } = useLocalSearchParams();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { hasPermission } = usePermission();

  const canManageUsers = hasPermission(['admin']); // Only admin can manage users

  const fetchUserDetail = async () => {
    try {
      setIsLoading(true);
      const response = await api.get(`/users/${id}/`);
      setUser(response.data);
    } catch (err) {
      console.error(`Error fetching user ${id}:`, err);
      setError('No se pudo cargar el detalle del usuario.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchUserDetail();
    }
  }, [id]);

  const handleEdit = () => {
    router.push(`/users/form?id=${id}`);
  };

  const handleDelete = () => {
    Alert.alert(
      "Eliminar Usuario",
      "¿Estás seguro de que quieres eliminar este usuario?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Eliminar",
          onPress: async () => {
            try {
              await api.delete(`/users/${id}/`);
              Alert.alert("Éxito", "Usuario eliminado correctamente.");
              router.back();
            } catch (err) {
              console.error("Error deleting user:", err.response?.data || err.message);
              Alert.alert("Error", "No se pudo eliminar el usuario.");
            }
          },
          style: "destructive",
        },
      ]
    );
  };

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={AppColors.primary} />
        <Text style={{ marginTop: 10, color: AppColors.subtleText }}>Cargando...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.text}>Usuario no encontrado.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
import AppButton from '../../components/ui/Button'; // Import AppButton

// ... (rest of the code)

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Stack.Screen options={{ title: `Usuario: ${user.username}` }} />
      
      <View style={styles.card}>
        <Text style={styles.title}>{user.first_name} {user.last_name}</Text>
        <DetailField label="Usuario" value={user.username} />
        
        <View style={styles.separator} />

        <DetailField label="Email" value={user.email} />
        <DetailField label="Rol" value={user.role} />
        <DetailField label="Estado" value={user.is_active ? 'Activo' : 'Inactivo'} />
        <DetailField label="Staff" value={user.is_staff ? 'Sí' : 'No'} />
        <DetailField label="Superusuario" value={user.is_superuser ? 'Sí' : 'No'} />
        <DetailField label="Fecha de alta" value={new Date(user.date_joined).toLocaleDateString()} />

        {user.site && (
          <DetailField label="Sede" value={user.site.name} />
        )}
      </View>

      {canManageUsers && (
        <View style={styles.buttonContainer}>
          <AppButton title="Editar" onPress={handleEdit} variant="primary" style={styles.singleButton} />
          <AppButton title="Eliminar" onPress={handleDelete} variant="danger" style={styles.singleButton} />
        </View>
      )}
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
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: AppColors.background,
    padding: 24,
  },
  card: {
    backgroundColor: AppColors.cardBackground,
    borderRadius: 12,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    marginBottom: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: AppColors.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  detailField: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: AppColors.lightGray,
  },
  detailLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: AppColors.text,
    flex: 1,
  },
  detailValue: {
    fontSize: 16,
    color: AppColors.subtleText,
    flex: 2,
    textAlign: 'right',
  },
  separator: {
    height: 1,
    backgroundColor: AppColors.lightGray,
    marginVertical: 16,
  },
  errorText: {
    color: AppColors.error,
    fontSize: 16,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
    paddingHorizontal: 0,
  },
  singleButton: {
    flex: 1,
    marginHorizontal: 8,
  },
});