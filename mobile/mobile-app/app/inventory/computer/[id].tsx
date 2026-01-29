import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Alert, Pressable } from 'react-native';
import { useLocalSearchParams, Stack, router } from 'expo-router';
import api from '@/api/axios';
import { usePermission } from '../../../hooks/usePermission'; // Adjusted path

import { AppColors } from '../../../constants/Colors';

const DetailField = ({ label, value }) => (
  <View style={styles.detailField}>
    <Text style={styles.detailLabel}>{label}:</Text>
    <Text style={styles.detailValue}>{value || 'N/A'}</Text>
  </View>
);

export default function ComputerDetailScreen() {
  const { id } = useLocalSearchParams();
  const [computer, setComputer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { hasPermission } = usePermission();

  useEffect(() => {
    const fetchComputer = async () => {
      try {
        const response = await api.get(`/assets/computers/${id}/`);
        setComputer(response.data);
      } catch (err) {
        console.error(`Error fetching computer ${id}:`, err);
        setError("No se pudo cargar la información del ordenador.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchComputer();
    }
  }, [id]);

  const handleDelete = async () => {
    Alert.alert(
      "Confirmar Eliminación",
      "¿Estás seguro de que quieres eliminar este ordenador?",
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        {
          text: "Eliminar",
          onPress: async () => {
            try {
              await api.delete(`/assets/computers/${id}/`);
              Alert.alert("Éxito", "Ordenador eliminado correctamente.");
              router.back(); // Volver a la pantalla anterior
            } catch (err) {
              console.error(`Error deleting computer ${id}:`, err);
              Alert.alert("Error", "No se pudo eliminar el ordenador.");
            }
          },
          style: "destructive"
        }
      ]
    );
  };

  if (loading) {
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

  if (!computer) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Ordenador no encontrado.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
import AppButton from '../../../components/ui/Button'; // Import AppButton

// ... (rest of the code)

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Stack.Screen options={{ title: computer.asset_tag || 'Detalle del Ordenador' }} />
      
      <View style={styles.card}>
        <DetailField label="Tipo de Equipo" value={computer.equipment_type} />
        <DetailField label="Número de Serie" value={computer.serial_number} />
        <DetailField label="Procesador" value={computer.processor} />
        <DetailField label="RAM" value={computer.ram} />
        <DetailField label="Almacenamiento" value={computer.storage} />
        <DetailField label="Sistema Operativo" value={computer.operating_system} />
        <DetailField label="Estado" value={computer.status} />
        <DetailField label="Asignado a Persona" value={computer.assigned_to_person_name} />
        <DetailField label="Asignado a Aula" value={computer.assigned_to_classroom_name} />
        <DetailField label="Sede" value={computer.site_name} />
        <DetailField label="Fecha de Compra" value={computer.purchase_date} />
        <DetailField label="Notas" value={computer.notes} />
      </View>

      <View style={styles.buttonContainer}>
        {hasPermission(['admin', 'technician']) && (
          <AppButton title="Editar" onPress={() => router.push(`/inventory/computer/form?id=${id}`)} variant="primary" style={styles.singleButton} />
        )}
        {hasPermission(['admin', 'technician']) && (
          <AppButton title="Eliminar" onPress={handleDelete} variant="danger" style={styles.singleButton} />
        )}
      </View>
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
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
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
  errorText: {
    color: AppColors.error,
    fontSize: 16,
    textAlign: 'center',
  },
});