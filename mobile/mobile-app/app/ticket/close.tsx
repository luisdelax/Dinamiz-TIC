import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, ActivityIndicator, ScrollView, Alert } from 'react-native';
import { useLocalSearchParams, Stack, router } from 'expo-router';
import api from '../../api/axios';
import { AppColors } from '../../constants/Colors';
import AppButton from '../../components/ui/Button';

export default function CloseTicketScreen() {
  const { id } = useLocalSearchParams();
  const [ticket, setTicket] = useState(null);
  const [resolutionNote, setResolutionNote] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
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
    if (id) {
      fetchTicketDetail();
    }
  }, [id]);

  const handleCloseTicket = async () => {
    if (!resolutionNote.trim()) {
      Alert.alert('Error', 'Por favor, introduce una nota de resolución.');
      return;
    }

    setIsSubmitting(true);
    try {
      await api.put(`/support/tickets/${id}/`, {
        status: 'closed',
        resolution_notes: resolutionNote,
      });
      Alert.alert('Éxito', 'Ticket cerrado correctamente.');
      router.back(); // Go back to ticket detail or list
    } catch (err) {
      console.error('Error closing ticket:', err.response?.data || err.message);
      Alert.alert('Error', 'No se pudo cerrar el ticket.');
    } finally {
      setIsSubmitting(false);
    }
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
      <Stack.Screen options={{ title: `Cerrar Ticket #${ticket.id}` }} />

      <Text style={styles.label}>Título del Ticket:</Text>
      <Text style={styles.ticketTitle}>{ticket.title}</Text>

      <Text style={styles.label}>Descripción:</Text>
      <Text style={styles.ticketDescription}>{ticket.description}</Text>

      <Text style={styles.label}>Nota de Resolución:</Text>
      <TextInput
        style={[styles.input, styles.resolutionInput]}
        value={resolutionNote}
        onChangeText={setResolutionNote}
        placeholder="Introduce la nota de resolución aquí"
        placeholderTextColor={AppColors.subtleText}
        multiline
      />

      <AppButton
        title={isSubmitting ? 'Cerrando...' : 'Cerrar Ticket'}
        onPress={handleCloseTicket}
        disabled={isSubmitting}
        variant="primary"
      />
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
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: AppColors.text,
    marginBottom: 8,
    marginTop: 16,
  },
  ticketTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: AppColors.primary,
    marginBottom: 8,
  },
  ticketDescription: {
    fontSize: 16,
    color: AppColors.text,
    lineHeight: 24,
    marginBottom: 16,
  },
  input: {
    backgroundColor: AppColors.cardBackground,
    height: 52,
    paddingHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: AppColors.lightGray,
    color: AppColors.text,
  },
  resolutionInput: {
    height: 120,
    textAlignVertical: 'top',
    paddingVertical: 12,
  },
  errorText: {
    color: AppColors.error,
    fontSize: 16,
    textAlign: 'center',
  },
  text: {
    color: AppColors.text,
    fontSize: 16,
  }
});
