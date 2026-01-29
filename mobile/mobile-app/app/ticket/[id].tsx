import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, Alert } from 'react-native';
import { useLocalSearchParams, Stack, router } from 'expo-router';
import api from '../../api/axios';
import { usePermission } from '../../hooks/usePermission'; // Ensure ROLES is imported if used
import { AppColors } from '../../constants/Colors';
import AppButton from '../../components/ui/Button'; // Import AppButton

export default function TicketDetailScreen() {
  const { id } = useLocalSearchParams();
  const [ticket, setTicket] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { hasPermission } = usePermission();

  const canEditTicket = hasPermission('canEditAnyTicket');
  const canDeleteTicket = hasPermission('canDeleteAnyTicket');
  const canCloseTicket = hasPermission('canCloseAnyTicket'); // New permission check


  const fetchTicketDetail = async () => {
    try {
      setIsLoading(true);
      const response = await api.get(`/support/tickets/${id}/`);
      setTicket(response.data);
    } catch (err) {
      console.error(`Error fetching ticket ${id}:`, err);
      setError('No se pudo cargar el detalle del ticket.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchTicketDetail();
    }
  }, [id]);

  const handleEdit = () => {
    router.push(`/ticket/form?id=${id}`);
  };

  const handleClose = () => {
    router.push(`/ticket/close?id=${id}`);
  };

  const handleDelete = () => {
    Alert.alert(
      "Eliminar Ticket",
      "¿Estás seguro de que quieres eliminar este ticket?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Eliminar",
          onPress: async () => {
            try {
              await api.delete(`/support/tickets/${id}/`);
              Alert.alert("Éxito", "Ticket eliminado correctamente.");
              router.back();
            } catch (err) {
              console.error("Error deleting ticket:", err.response?.data || err.message);
              Alert.alert("Error", "No se pudo eliminar el ticket.");
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

  if (!ticket) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.text}>Ticket no encontrado.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Stack.Screen options={{ title: `Ticket #${ticket.id}` }} />
      
      <View style={styles.card}>
        <Text style={styles.title}>{ticket.title}</Text>
        <Text style={styles.date}>Creado: {new Date(ticket.created_at).toLocaleString()}</Text>
        
        <View style={styles.separator} />

        <Text style={styles.description}>{ticket.description}</Text>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Estado:</Text>
          <Text style={styles.infoValue}>{ticket.status}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Prioridad:</Text>
          <Text style={styles.infoValue}>{ticket.priority}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Asignado a:</Text>
          <Text style={styles.infoValue}>{ticket.assigned_to_user?.username || 'N/A'}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Creado por:</Text>
          <Text style={styles.infoValue}>{ticket.created_by_user?.username || 'N/A'}</Text>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        {canEditTicket && (
          <AppButton title="Editar" onPress={handleEdit} variant="primary" style={styles.singleButton} />
        )}
        {ticket.status !== 'closed' && canCloseTicket && (
          <AppButton title="Cerrar Ticket" onPress={handleClose} variant="secondary" style={styles.singleButton} />
        )}
        {canDeleteTicket && (
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
  },
  date: {
    fontSize: 14,
    color: AppColors.subtleText,
    marginBottom: 16,
  },
  separator: {
    height: 1,
    backgroundColor: AppColors.lightGray,
    marginVertical: 16,
  },
  description: {
    fontSize: 16,
    color: AppColors.text,
    lineHeight: 24,
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: AppColors.lightGray,
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: AppColors.text,
    flex: 1,
  },
  infoValue: {
    fontSize: 16,
    color: AppColors.subtleText,
    flex: 2,
    textAlign: 'right',
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
