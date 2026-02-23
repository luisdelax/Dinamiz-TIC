import React from 'react';
import { View, Text, StyleSheet, Pressable, Alert } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/api/axios';

import { AppColors } from '../../constants/Colors';

const UserListItem = ({ user }) => {
  const queryClient = useQueryClient();
  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/users/${id}/`),
    onSuccess: () => {
      queryClient.invalidateQueries(['users']);
      Alert.alert('Éxito', 'Usuario eliminado correctamente.');
    },
    onError: (error) => {
      console.error('Error deleting user:', error);
      Alert.alert('Error', 'No se pudo eliminar el usuario.');
    },
  });

  const handleDelete = (id) => {
    Alert.alert(
      'Confirmar Eliminación',
      '¿Estás seguro de que quieres eliminar a este usuario?',
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
      onPress={() => router.push(`/users/form?id=${user.id}`)}
    >
      <View style={styles.itemContent}>
        <Text style={styles.itemTitle}>{user?.first_name} {user?.last_name}</Text>
        <Text style={styles.itemDetail}>@{user?.username}</Text>
        <Text style={styles.itemDetail}>Rol: {user?.role}</Text>
        {/* Add more user details as needed */}
      </View>
      <Pressable
        style={({ pressed }) => [styles.deleteButton, pressed && styles.deleteButtonPressed]}
        onPress={() => handleDelete(user.id)}
      >
        <Ionicons name="trash" size={24} color={AppColors.cardBackground} />
      </Pressable>
    </Pressable>
  );
};

const styles = StyleSheet.create({
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

export default UserListItem;
