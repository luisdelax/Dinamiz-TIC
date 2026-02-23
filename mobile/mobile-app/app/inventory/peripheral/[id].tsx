import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, Pressable, Alert } from 'react-native';
import { useLocalSearchParams, Stack, router } from 'expo-router';
import api from '@/api/axios';
import { usePermission } from '../../../hooks/usePermission'; // Corrected path

import { AppColors } from '../../../constants/Colors';

const DetailField = ({ label, value }) => (
  <View style={styles.detailField}>
    <Text style={styles.detailLabel}>{label}:</Text>
    <Text style={styles.detailValue}>{value || 'N/A'}</Text>
  </View>
);

export default function PeripheralDetailScreen() {
  const { id } = useLocalSearchParams();
  const [peripheral, setPeripheral] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { hasPermission } = usePermission();

  const canEdit = hasPermission(['admin', 'technician']); // Assuming permission checks are done this way
  const canDelete = hasPermission(['admin', 'technician']); // Assuming permission checks are done this way

  const fetchPeripheralDetail = async () => {
    try {
      setIsLoading(true);
      const response = await api.get(`/assets/peripherals/${id}/`);
      setPeripheral(response.data);
    } catch (err) {
      console.error(`Error fetching peripheral ${id}:`, err);
      setError('No se pudo cargar el detalle del periférico.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchPeripheralDetail();
    }
  }, [id]);

  const handleEdit = () => {
    router.push(`/inventory/peripheral/form?id=${id}`);
  };

  const handleDelete = () => {
    Alert.alert(
      "Eliminar Periférico",
      "¿Estás seguro de que quieres eliminar este periférico?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Eliminar",
          onPress: async () => {
            try {
              await api.delete(`/assets/peripherals/${id}/`);
              Alert.alert("Éxito", "Periférico eliminado correctamente.");
              router.back();
            } catch (err) {
              console.error("Error deleting peripheral:", err.response?.data || err.message);
              Alert.alert("Error", "No se pudo eliminar el periférico.");
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

  if (!peripheral) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.text}>Periférico no encontrado.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Stack.Screen options={{ title: `Periférico: ${peripheral.asset_tag}` }} />
      
      <View style={styles.card}>
        <Text style={styles.title}>{peripheral.brand} {peripheral.model}</Text>
        <DetailField label="Etiqueta" value={peripheral.asset_tag} />
        
        <View style={styles.separator} />

        <DetailField label="Tipo" value={peripheral.peripheral_type} />
        <DetailField label="Serie" value={peripheral.serial_number} />
        <DetailField label="Estado" value={peripheral.status} />

        <View style={styles.separator} />

        <Text style={styles.sectionTitle}>Asignación:</Text>
        <DetailField label="Asignado a Persona" value={peripheral.assigned_to_person ? `${peripheral.assigned_to_person.first_name} ${peripheral.assigned_to_person.last_name}` : 'N/A'} />
        <DetailField label="Asignado a Ordenador" value={peripheral.assigned_to_computer ? peripheral.assigned_to_computer.asset_tag : 'N/A'} />
        <DetailField label="Sede" value={peripheral.site ? peripheral.site.name : 'N/A'} />
        
        {peripheral.notes && (
          <>
            <View style={styles.separator} />
            <Text style={styles.sectionTitle}>Notas:</Text>
            <Text style={styles.description}>{peripheral.notes}</Text>
          </>
        )}
      </View>

      {(canEdit || canDelete) && (
        <View style={styles.buttonContainer}>
          {canEdit && (
            <AppButton title="Editar" onPress={handleEdit} variant="primary" style={styles.singleButton} />
          )}
          {canDelete && (
            <AppButton title="Eliminar" onPress={handleDelete} variant="danger" style={styles.singleButton} />
          )}
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: AppColors.text,
    marginBottom: 12,
    marginTop: 8,
  },
  description: {
    fontSize: 16,
    color: AppColors.text,
    lineHeight: 24,
    marginBottom: 10,
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