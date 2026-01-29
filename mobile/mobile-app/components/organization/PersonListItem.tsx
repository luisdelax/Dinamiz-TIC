import React from 'react';
import { View, Text, StyleSheet, Pressable, Alert } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/api/axios';

import { AppColors } from '../../constants/Colors';

const PersonListItem = ({ person }) => {
  const queryClient = useQueryClient();
  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/organization/persons/${id}/`),
    onSuccess: () => {
      queryClient.invalidateQueries(['persons']);
      Alert.alert('Éxito', 'Persona eliminada correctamente.');
    },
    onError: (error) => {
      console.error('Error deleting person:', error);
      Alert.alert('Error', 'No se pudo eliminar la persona.');
    },
  });

  const handleDelete = (id) => {
    Alert.alert(
      'Confirmar Eliminación',
      '¿Estás seguro de que quieres eliminar a esta persona?',
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
    <Pressable
      style={({ pressed }) => [styles.item, pressed && styles.itemPressed]}
      onPress={() => router.push(`/organization/person/form?id=${person.id}`)}
    >
      <View style={styles.itemContent}>
        <Text style={styles.itemTitle}>{person?.first_name} {person?.last_name}</Text>
        <Text style={styles.itemDetail}>Email: {person?.email || 'N/A'}</Text>
        <Text style={styles.itemDetail}>Cédula: {person?.identification_number || 'N/A'}</Text>
        {/* Add more person details as needed */}
      </View>
      <Pressable
        style={({ pressed }) => [styles.deleteButton, pressed && styles.deleteButtonPressed]}
        onPress={() => handleDelete(person.id)}
      >
        <Ionicons name="trash" size={24} color={AppColors.cardBackground} />
      </Pressable>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: AppColors.cardBackground,
    padding: 15,
    marginBottom: 10,
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
    fontWeight: '600',
    color: AppColors.text,
    marginBottom: 4,
  },
  itemDetail: {
    fontSize: 12,
    color: AppColors.subtleText,
    marginBottom: 2,
  },
  deleteButton: {
    padding: 8,
    borderRadius: 5,
    marginLeft: 10,
  },
  deleteButtonPressed: {
    opacity: 0.6,
  },
});

export default PersonListItem;
