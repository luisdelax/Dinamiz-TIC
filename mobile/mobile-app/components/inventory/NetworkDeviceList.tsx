import React from 'react';
import { View, Text, StyleSheet, Pressable, Alert } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/api/axios';

import { AppColors } from '../../constants/Colors';

const NetworkDeviceList = ({ networkDevices }) => {
  const queryClient = useQueryClient();
  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/assets/network-devices/${id}/`),
    onSuccess: () => {
      queryClient.invalidateQueries(['network-devices']);
      Alert.alert('Éxito', 'Dispositivo de red eliminado correctamente.');
    },
    onError: (error) => {
      console.error('Error deleting network device:', error);
      Alert.alert('Error', 'No se pudo eliminar el dispositivo de red.');
    },
  });

  const handleDelete = (id) => {
    Alert.alert(
      'Confirmar Eliminación',
      '¿Estás seguro de que quieres eliminar este dispositivo de red?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Eliminar',
          onPress: () => deleteMutation.mutate(id),
          style: 'destructive',
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Network Device List</Text>
      {networkDevices && networkDevices.length > 0 ? (
        networkDevices.map(device => (
          <Pressable
            key={device.id}
            style={({ pressed }) => [styles.item, pressed && styles.itemPressed]}
            onPress={() => router.push(`/inventory/network-device/form?id=${device.id}`)}
          >
            <View style={styles.itemContent}>
              <Text style={styles.itemTitle}>{device.asset_tag || 'N/A'}</Text>
              <Text style={styles.itemDetail}>{device.brand} - {device.model}</Text>
              <Text style={styles.itemDetail}>IP: {device.ip_address || 'N/A'}</Text>
              <Text style={styles.itemDetail}>MAC: {device.mac_address || 'N/A'}</Text>
              {/* Add more details as needed */}
            </View>
            <Pressable
              style={({ pressed }) => [styles.deleteButton, pressed && styles.deleteButtonPressed]}
              onPress={() => handleDelete(device.id)}
            >
              <Ionicons name="trash" size={24} color={AppColors.cardBackground} />
            </Pressable>
          </Pressable>
        ))
      ) : (
        <Text style={styles.noItemsText}>No network devices found.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    color: AppColors.text,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: AppColors.cardBackground,
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  itemPressed: {
    opacity: 0.8,
  },
  itemContent: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: AppColors.text,
  },
  itemDetail: {
    fontSize: 14,
    color: AppColors.subtleText,
    marginTop: 4,
  },
  noItemsText: {
    fontSize: 16,
    color: AppColors.subtleText,
    textAlign: 'center',
    marginTop: 32,
  },
  deleteButton: {
    padding: 10,
    borderRadius: 20,
    backgroundColor: AppColors.error,
    marginLeft: 16,
  },
  deleteButtonPressed: {
    opacity: 0.8,
  },
});

export default NetworkDeviceList;
