import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, Pressable, Alert } from 'react-native';
import { useLocalSearchParams, Stack, router } from 'expo-router';
import api from '../../../api/axios';
import { usePermission } from '../../../hooks/usePermission';

import { AppColors } from '../../../constants/Colors';

const DetailField = ({ label, value }) => (
  <View style={styles.detailField}>
    <Text style={styles.detailLabel}>{label}:</Text>
    <Text style={styles.detailValue}>{value || 'N/A'}</Text>
  </View>
);

export default function PersonDetailScreen() {
  const { id } = useLocalSearchParams();
  const [person, setPerson] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { hasPermission } = usePermission();

  const canManageOrganization = hasPermission(['admin', 'technician']);


  const fetchPersonDetail = async () => {
    try {
      setIsLoading(true);
      const response = await api.get(`/organization/persons/${id}/`);
      setPerson(response.data);
    } catch (err) {
      console.error(`Error fetching person ${id}:`, err);
      setError('No se pudo cargar el detalle de la persona.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchPersonDetail();
    }
  }, [id]);

  const handleEdit = () => {
    router.push(`/organization/person/form?id=${id}`);
  };

  const handleDelete = () => {
    Alert.alert(
      "Eliminar Persona",
      "¿Estás seguro de que quieres eliminar a esta persona? Esto puede afectar a los activos asignados.",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Eliminar",
          onPress: async () => {
            try {
              await api.delete(`/organization/persons/${id}/`);
              Alert.alert("Éxito", "Persona eliminada correctamente.");
              router.back();
            } catch (err) {
              console.error("Error deleting person:", err.response?.data || err.message);
              Alert.alert("Error", "No se pudo eliminar a la persona.");
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

  if (!person) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.text}>Persona no encontrada.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
import AppButton from '../../../components/ui/Button'; // Import AppButton

// ... (rest of the code)

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Stack.Screen options={{ title: `Persona: ${person.first_name} ${person.last_name}` }} />
      
      <View style={styles.card}>
        <Text style={styles.title}>{person.first_name} {person.last_name}</Text>
        <DetailField label="Email" value={person.email} />
        
        <View style={styles.separator} />

        <DetailField label="Teléfono" value={person.phone_number} />
        
        {person.site && (
          <DetailField label="Sede" value={person.site.name} />
        )}
        {person.classroom && (
          <DetailField label="Aula" value={person.classroom.name} />
        )}
      </View>

      {canManageOrganization && (
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