import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Alert, RefreshControl, Pressable } from 'react-native';
import { Stack, router } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import api from '../../api/axios'; // Adjust path
import UserListItem from '../../components/users/UserListItem';
import { usePermission } from '../../hooks/usePermission'; // Adjust path
import { Ionicons } from '@expo/vector-icons';

import { AppColors } from '../../constants/Colors';

const fetchUsers = async () => {
  const { data } = await api.get('/users/');
  return data;
};

export default function UsersScreen() {
  const { data: users, isLoading, error, refetch } = useQuery({ queryKey: ['users'], queryFn: fetchUsers });
  const [refreshing, setRefreshing] = useState(false);
  const { hasPermission, hasAnyRole } = usePermission();

  const canCreateUser = hasAnyRole(['admin']);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, []);

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={AppColors.primary} />
        <Text style={{ marginTop: 10, color: AppColors.subtleText }}>Cargando...</Text>
      </View>
    );
  }

  return (
    <View style={styles.fullContainer}>
      <Stack.Screen options={{ title: 'Usuarios' }} />
      <FlatList
        data={users}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <UserListItem user={item} />}
        contentContainerStyle={styles.listContentContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[AppColors.primary]} />
        }
      />

      {canCreateUser && (
        <Pressable
          style={({ pressed }) => [styles.fab, pressed && styles.fabPressed]}
          onPress={() => router.push('/users/form')}
        >
          <Ionicons name="add" size={30} color={AppColors.cardBackground} />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  fullContainer: {
    flex: 1,
    backgroundColor: AppColors.background,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: AppColors.background,
    padding: 24,
  },
  listContentContainer: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    paddingBottom: 96, // Add padding for FAB
  },
  errorText: {
    color: AppColors.error,
    fontSize: 16,
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    right: 24,
    bottom: 24,
    backgroundColor: AppColors.primary,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  fabPressed: {
    opacity: 0.8,
  },
});