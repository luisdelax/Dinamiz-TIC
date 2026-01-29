import React from 'react';
import { View, Text, StyleSheet, Pressable, Alert } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/api/axios';

import { AppColors } from '../../constants/Colors';

const PeripheralList = ({ peripherals }) => {
  const queryClient = useQueryClient();
  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/assets/peripherals/${id}/`),
    onSuccess: () => {
      queryClient.invalidateQueries(['peripherals']);
      Alert.alert('Éxito', 'Periférico eliminado correctamente.');
    },
    onError: (error) => {
      console.error('Error deleting peripheral:', error);
      Alert.alert('Error', 'No se pudo eliminar el periférico.');
    },
  });

  const handleDelete = (id) => {
    Alert.alert(
      'Confirmar Eliminación',
      '¿Estás seguro de que quieres eliminar este periférico?',
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
      <Text style={styles.title}>Peripheral List</Text>
      {peripherals && peripherals.length > 0 ? (
        peripherals.map(peripheral => (
          <Pressable
            key={peripheral.id}
            style={({ pressed }) => [styles.item, pressed && styles.itemPressed]}
            onPress={() => router.push(`/inventory/peripheral/form?id=${peripheral.id}`)}
          >
            <View style={styles.itemContent}>
              <Text style={styles.itemTitle}>{peripheral.asset_tag || 'N/A'}</Text>
              <Text style={styles.itemDetail}>{peripheral.brand} - {peripheral.model}</Text>
              <Text style={styles.itemDetail}>Serial: {peripheral.serial_number}</Text>
              {/* Add more details as needed */}
            </View>
            <Pressable
              style={({ pressed }) => [styles.deleteButton, pressed && styles.deleteButtonPressed]}
              onPress={() => handleDelete(peripheral.id)}
            >
              <Ionicons name="trash" size={24} color={AppColors.cardBackground} />
            </Pressable>
          </Pressable>
        ))
      ) : (
        <Text style={styles.noItemsText}>No peripherals found.</Text>
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

export default PeripheralList;
