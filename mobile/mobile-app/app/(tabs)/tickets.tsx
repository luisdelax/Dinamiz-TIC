import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, RefreshControl, Platform, Pressable } from 'react-native';
import api from '../../api/axios';
import { Link, router } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { usePermission } from '../../hooks/usePermission';

import { AppColors } from '../../constants/Colors';

import TicketItem from '../../components/ui/TicketItem';

export default function TicketsScreen() {
  const [tickets, setTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const { hasPermission } = usePermission();

  const canManageTickets = hasPermission('canManageTickets');

  const fetchTickets = async () => {
    try {
      setError(null);
      const response = await api.get('/support/tickets/');
      setTickets(response.data);
    } catch (err) {
      console.error("Error fetching tickets:", err);
      setError('No se pudieron cargar los tickets. Desliza hacia abajo para reintentar.');
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchTickets();
  }, []);

  const handleAddTicket = () => {
    router.push('/ticket/form');
  };

  if (isLoading) {
    return (
      <View style={[styles.centerContainer, { backgroundColor: AppColors.background }]}>
        <ActivityIndicator size="large" color={AppColors.primary} />
        <Text style={{ marginTop: 10, color: AppColors.subtleText }}>Cargando tickets...</Text>
      </View>
    );
  }
  
  return (
    <View style={styles.container}>


      <FlatList
        data={tickets}
        renderItem={({ item }) => <TicketItem item={item} />}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.listContentContainer}
        ListEmptyComponent={
          <View style={styles.centerContainer}>
            <Text style={{ color: AppColors.subtleText }}>{error ? error : "No hay tickets disponibles."}</Text>
          </View>
        }
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={AppColors.primary} />
        }
      />

      {/* Botón de Acción Flotante (FAB) */}
      {canManageTickets && (
        <Pressable style={styles.fab} onPress={handleAddTicket}>
            <FontAwesome name="plus" size={24} color={AppColors.cardBackground} />
          </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.background,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  listContentContainer: {
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  header: {
    fontSize: 32,
    fontWeight: 'bold',
    color: AppColors.primaryDark,
    paddingHorizontal: 24,
    marginBottom: 16,
    marginTop: 16,
  },
  itemCard: {
    backgroundColor: AppColors.cardBackground,
    padding: 20,
    marginBottom: 16,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  itemTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: AppColors.text,
  },
  itemDate: {
    fontSize: 13,
    color: AppColors.subtleText,
    marginTop: 4,
  },
  statusBadge: {
    backgroundColor: AppColors.lightGray,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: AppColors.subtleText,
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
});
