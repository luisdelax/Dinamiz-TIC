import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, ScrollView, ActivityIndicator, StyleSheet, TouchableOpacity, Alert, TextInput } from 'react-native';
import { router } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import api from '../../../../api/axios'; // Corrected path
import { Colors } from '../../../../constants/Colors';
import { Picker } from '@react-native-picker/picker';

const TicketListScreen = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // State for search and filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');

  const STATUS_OPTIONS = [
    { value: "", label: "Todos los Estados" },
    { value: "open", label: "Abierto" },
    { value: "in_progress", label: "En Progreso" },
    { value: "resolved", label: "Resuelto" },
    { value: "closed", label: "Cerrado" },
  ];

  const PRIORITY_OPTIONS = [
    { value: "", label: "Todas las Prioridades" },
    { value: "low", label: "Baja" },
    { value: "medium", label: "Media" },
    { value: "high", label: "Alta" },
    { value: "critical", label: "Crítica" },
  ];

  const fetchTickets = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (statusFilter) params.append('status', statusFilter);
      if (priorityFilter) params.append('priority', priorityFilter);

      const response = await api.get(`/support/tickets/?${params.toString()}`);
      setTickets(response.data);
    } catch (err) {
      setError('Failed to fetch tickets.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, statusFilter, priorityFilter]);

  // Debounced fetch for tickets
  useEffect(() => {
    const handler = setTimeout(() => {
      fetchTickets();
    }, 300); // Debounce for 300ms

    return () => {
      clearTimeout(handler);
    };
  }, [fetchTickets, searchTerm, statusFilter, priorityFilter]);

  const handleAddTicket = () => {
    router.push('/ticket/form');
  };

  const handleEditTicket = (id) => {
    router.push(`/ticket/${id}`);
  };

  const handleCloseTicket = (id) => {
    // Implement close ticket logic, possibly navigating to a specific close modal/form
    Alert.alert("Cerrar Ticket", `Funcionalidad para cerrar ticket ${id} pendiente.`);
  };

  const handleDeleteTicket = async (id) => {
    Alert.alert(
      "Confirmar Eliminación",
      "¿Estás seguro de que quieres eliminar este ticket?",
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        {
          text: "Eliminar",
          onPress: async () => {
            try {
              await api.delete(`/support/tickets/${id}/`);
              fetchTickets();
            } catch (err) {
              setError("Failed to delete ticket.");
              console.error(err);
            }
          }
        }
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.light.tint} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Tickets de Soporte</Text>
        <TouchableOpacity style={styles.addButton} onPress={handleAddTicket}>
          <FontAwesome name="plus" size={20} color="#fff" />
          <Text style={styles.addButtonText}>Nuevo Ticket</Text>
        </TouchableOpacity>
      </View>

      {/* Search and Filter Section */}
      <View style={styles.filterSection}>
        {/* Search Input */}
        <View style={styles.searchInputContainer}>
          <FontAwesome name="search" size={16} color={Colors.light.text} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar por título, descripción..."
            placeholderTextColor={Colors.light.lightGray}
            value={searchTerm}
            onChangeText={setSearchTerm}
          />
        </View>

        {/* Status Filter */}
        <Picker
          selectedValue={statusFilter}
          onValueChange={(itemValue) => setStatusFilter(itemValue)}
          style={styles.picker}
        >
          {STATUS_OPTIONS.map((option) => (
            <Picker.Item key={option.value} label={option.label} value={option.value} />
          ))}
        </Picker>

        {/* Priority Filter */}
        <Picker
          selectedValue={priorityFilter}
          onValueChange={(itemValue) => setPriorityFilter(itemValue)}
          style={styles.picker}
        >
          {PRIORITY_OPTIONS.map((option) => (
            <Picker.Item key={option.value} label={option.label} value={option.value} />
          ))}
        </Picker>
      </View>

      {error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : tickets.length === 0 ? (
        <Text style={styles.noDataText}>No se encontraron tickets.</Text>
      ) : (
        <ScrollView style={styles.listContainer}>
          {tickets.map((ticket) => (
            <TouchableOpacity key={ticket.id} style={styles.ticketItem} onPress={() => handleEditTicket(ticket.id)}>
              <View style={styles.itemDetails}>
                <Text style={styles.itemTitle}>{ticket.title}</Text>
                <Text style={styles.itemSubtitle}>Prioridad: {ticket.priority}</Text>
                <Text style={[styles.itemStatus, 
                  ticket.status === 'open' ? styles.statusOpen : 
                  ticket.status === 'in_progress' ? styles.statusInProgress :
                  ticket.status === 'resolved' ? styles.statusResolved : styles.statusClosed]}>
                  {ticket.status}
                </Text>
              </View>
              <View style={styles.itemActions}>
                <TouchableOpacity onPress={() => handleEditTicket(ticket.id)} style={styles.actionButton}>
                  <FontAwesome name="pencil" size={20} color={Colors.light.tint} />
                </TouchableOpacity>
                {ticket.status !== 'closed' && (
                  <TouchableOpacity onPress={() => handleCloseTicket(ticket.id)} style={styles.actionButton}>
                    <FontAwesome name="times-circle" size={20} color="orange" />
                  </TouchableOpacity>
                )}
                <TouchableOpacity onPress={() => handleDeleteTicket(ticket.id)} style={styles.actionButton}>
                  <FontAwesome name="trash" size={20} color="red" />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: Colors.light.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.light.text,
  },
  addButton: {
    flexDirection: 'row',
    backgroundColor: Colors.light.tint,
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    marginLeft: 8,
    fontWeight: 'bold',
  },
  filterSection: {
    marginBottom: 20,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: Colors.light.lightGray,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    color: Colors.light.text,
  },
  picker: {
    height: 50,
    width: '100%',
    borderColor: Colors.light.lightGray,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    color: Colors.light.text,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
  noDataText: {
    textAlign: 'center',
    marginTop: 20,
    color: Colors.light.text,
  },
  listContainer: {
    flex: 1,
  },
  ticketItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.light.cardBackground,
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  itemDetails: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.light.text,
  },
  itemSubtitle: {
    fontSize: 14,
    color: Colors.light.lightGray,
    marginTop: 4,
  },
  itemStatus: {
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 8,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 5,
    alignSelf: 'flex-start',
  },
  statusOpen: {
    backgroundColor: '#DBEAFE', // blue-100
    color: '#1E40AF', // blue-700
  },
  statusInProgress: {
    backgroundColor: '#FEF3C7', // yellow-100
    color: '#92400E', // yellow-700
  },
  statusResolved: {
    backgroundColor: '#D1FAE5', // green-100
    color: '#065F46', // green-900
  },
  statusClosed: {
    backgroundColor: '#E5E7EB', // gray-200
    color: '#4B5563', // gray-700
  },
  itemActions: {
    flexDirection: 'row',
  },
  actionButton: {
    marginLeft: 15,
  },
});

export default TicketListScreen;
