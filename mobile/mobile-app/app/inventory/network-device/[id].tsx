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

export default function NetworkDeviceDetailScreen() {
  const { id } = useLocalSearchParams();
  const [device, setDevice] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { hasPermission } = usePermission();

  const canEdit = hasPermission(['admin', 'technician']); // Assuming permission checks are done this way
  const canDelete = hasPermission(['admin', 'technician']); // Assuming permission checks are done this way

  const fetchDeviceDetail = async () => {
    try {
      setIsLoading(true);
      const response = await api.get(`/assets/network-devices/${id}/`);
      setDevice(response.data);
    } catch (err) {
      console.error(`Error fetching network device ${id}:`, err);
      setError('No se pudo cargar el detalle del dispositivo de red.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchDeviceDetail();
    }
  }, [id]);

  const handleEdit = () => {
    router.push(`/inventory/network-device/form?id=${id}`);
  };

  const handleDelete = () => {
    Alert.alert(
      "Eliminar Dispositivo",
      "¿Estás seguro de que quieres eliminar este dispositivo de red?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Eliminar",
          onPress: async () => {
            try {
              await api.delete(`/assets/network-devices/${id}/`);
              Alert.alert("Éxito", "Dispositivo de red eliminado correctamente.");
              router.back();
            } catch (err) {
              console.error("Error deleting network device:", err.response?.data || err.message);
              Alert.alert("Error", "No se pudo eliminar el dispositivo de red.");
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

  if (!device) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.text}>Dispositivo de red no encontrado.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
import AppButton from '../../../components/ui/Button'; // Import AppButton

// ... (rest of the code)

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Stack.Screen options={{ title: `Dispositivo: ${device.asset_tag}` }} />
      
      <View style={styles.card}>
        <Text style={styles.title}>{device.brand} {device.model}</Text>
        <DetailField label="Etiqueta" value={device.asset_tag} />
        
        <View style={styles.separator} />

        <DetailField label="Tipo" value={device.device_type} />
        <DetailField label="Serie" value={device.serial_number} />
        <DetailField label="Estado" value={device.status} />

        <View style={styles.separator} />

        <Text style={styles.sectionTitle}>Conectividad:</Text>
        <DetailField label="Dirección IP" value={device.ip_address} />
        <DetailField label="Dirección MAC" value={device.mac_address} />
        <DetailField label="Ubicación" value={device.location} />

        <DetailField label="Asignado a Persona" value={device.assigned_to_person ? `${device.assigned_to_person.first_name} ${device.assigned_to_person.last_name}` : 'N/A'} />
        <DetailField label="Aula" value={device.assigned_to_classroom ? device.assigned_to_classroom.name : 'N/A'} />
        <DetailField label="Sede" value={device.site ? device.site.name : 'N/A'} />
        
        {device.notes && (
          <>
            <View style={styles.separator} />
            <Text style={styles.sectionTitle}>Notas:</Text>
            <Text style={styles.description}>{device.notes}</Text>
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