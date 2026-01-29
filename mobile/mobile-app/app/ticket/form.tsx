import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { Stack, useLocalSearchParams, router } from 'expo-router';
import api from '../../api/axios';
import { Picker } from '@react-native-picker/picker';
import { AuthContext } from '../../auth/AuthContext';
import { AppColors } from '../../constants/Colors';
import AppButton from '../../components/ui/Button'; // Import AppButton

// Opciones para campos de selección
const STATUS_CHOICES = [
  { label: 'Abierto', value: 'open' },
  { label: 'En Progreso', value: 'in_progress' },
  { label: 'Resuelto', value: 'resolved' },
  { label: 'Cerrado', value: 'closed' },
];

const PRIORITY_CHOICES = [
  { label: 'Baja', value: 'low' },
  { label: 'Media', value: 'medium' },
  { label: 'Alta', value: 'high' },
  { label: 'Crítica', value: 'critical' },
];

const TICKET_TYPE_CHOICES = [
  { label: 'Incidencia', value: 'incident' },
  { label: 'Requerimiento', value: 'request' },
];

export default function TicketFormScreen() {
  const { id } = useLocalSearchParams();
  const isEditing = !!id;
  const { user } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    ticket_type: 'incident', // Added
    status: 'open',
    priority: 'medium',
    assigned_to_user: null,
    created_by_user: user ? user.id : null,
    computer: null, // Added
    network_device: null, // Added
    site: null, // Added
  });
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  // --- Fetch related data for dropdowns ---
  const [users, setUsers] = useState([]);
  const [computers, setComputers] = useState([]); // Added
  const [networkDevices, setNetworkDevices] = useState([]); // Added
  const [sites, setSites] = useState([]); // Added

  useEffect(() => {
    const fetchRelatedData = async () => { // Renamed from fetchUsers
      try {
        const [usersRes, computersRes, networkDevicesRes, sitesRes] = await Promise.all([
          api.get('/users/'),
          api.get('/assets/computers/'), // Fetched
          api.get('/assets/network-devices/'), // Fetched
          api.get('/organization/sites/'), // Fetched
        ]);
        setUsers(usersRes.data);
        setComputers(computersRes.data);
        setNetworkDevices(networkDevicesRes.data);
        setSites(sitesRes.data);
      } catch (err) {
        console.error("Error fetching related data:", err);
        Alert.alert("Error", "No se pudo cargar la información de usuarios, equipos o sedes.");
      }
    };
    fetchRelatedData();
  }, []);

  // --- Load ticket data if editing ---
  useEffect(() => {
    if (isEditing) {
      const fetchTicket = async () => {
        try {
          const response = await api.get(`/support/tickets/${id}/`);
          const ticketData = response.data;
          setFormData({
            title: ticketData.title || '',
            description: ticketData.description || '',
            ticket_type: ticketData.ticket_type || 'incident', // Added
            status: ticketData.status || 'open',
            priority: ticketData.priority || 'medium',
            assigned_to_user: ticketData.assigned_to_user?.id || null,
            created_by_user: ticketData.created_by_user?.id || (user ? user.id : null),
            computer: ticketData.computer || null, // Added
            network_device: ticketData.network_device || null, // Added
            site: ticketData.site || null, // Added
          });
        } catch (err) {
          console.error(`Error fetching ticket ${id}:`, err);
          Alert.alert("Error", "No se pudo cargar los datos del ticket.");
          router.back();
        } finally {
          setInitialLoading(false);
        }
      };
      fetchTicket();
    } else {
      setInitialLoading(false);
    }
  }, [id, isEditing, user]);

  const handleChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const dataToSend = {
        ...formData,
        assigned_to_user: formData.assigned_to_user || null,
        created_by_user: formData.created_by_user || (user ? user.id : null),
        computer: formData.computer || null, // Added
        network_device: formData.network_device || null, // Added
        site: formData.site || null, // Added
      };

      if (isEditing) {
        await api.put(`/support/tickets/${id}/`, dataToSend);
        Alert.alert("Éxito", "Ticket actualizado correctamente.");
      } else {
        await api.post('/support/tickets/', dataToSend);
        Alert.alert("Éxito", "Ticket creado correctamente.");
      }
      router.back();
    } catch (err) {
      console.error("Error submitting form:", err.response?.data || err.message);
      const errorMsg = err.response?.data ? JSON.stringify(err.response.data) : err.message;
      Alert.alert("Error", `No se pudo guardar el ticket: ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={AppColors.primary} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Stack.Screen options={{ title: isEditing ? 'Editar Ticket' : 'Añadir Ticket' }} />
      
      <Text style={styles.label}>Título</Text>
      <TextInput
        style={styles.input}
        value={formData.title}
        onChangeText={(val) => handleChange('title', val)}
        placeholder="Título del ticket"
        placeholderTextColor={AppColors.subtleText}
      />

      <Text style={styles.label}>Descripción</Text>
      <TextInput
        style={[styles.input, styles.descriptionInput]}
        value={formData.description}
        onChangeText={(val) => handleChange('description', val)}
        placeholder="Descripción detallada del problema"
        placeholderTextColor={AppColors.subtleText}
        multiline
      />

      {/* Ticket Type (Dropdown) */}
      <Text style={styles.label}>Tipo de Ticket</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={formData.ticket_type}
          onValueChange={(itemValue) => handleChange('ticket_type', itemValue)}
          style={styles.picker}
          itemStyle={{ color: AppColors.text }}
        >
          {TICKET_TYPE_CHOICES.map(choice => (
            <Picker.Item key={choice.value} label={choice.label} value={choice.value} />
          ))}
        </Picker>
      </View>
      
      {/* Status (Dropdown) */}
      <Text style={styles.label}>Estado</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={formData.status}
          onValueChange={(itemValue) => handleChange('status', itemValue)}
          style={styles.picker}
          itemStyle={{ color: AppColors.text }}
        >
          {STATUS_CHOICES.map(choice => (
            <Picker.Item key={choice.value} label={choice.label} value={choice.value} />
          ))}
        </Picker>
      </View>

      {/* Priority (Dropdown) */}
      <Text style={styles.label}>Prioridad</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={formData.priority}
          onValueChange={(itemValue) => handleChange('priority', itemValue)}
          style={styles.picker}
          itemStyle={{ color: AppColors.text }}
        >
          {PRIORITY_CHOICES.map(choice => (
            <Picker.Item key={choice.value} label={choice.label} value={choice.value} />
          ))}
        </Picker>
      </View>

      {/* Assigned To User (Dropdown FK) */}
      <Text style={styles.label}>Asignado a</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={formData.assigned_to_user}
          onValueChange={(itemValue) => handleChange('assigned_to_user', itemValue)}
          style={styles.picker}
          itemStyle={{ color: AppColors.text }}
        >
          <Picker.Item label="Sin asignar" value={null} />
          {users.map(u => (
            <Picker.Item key={u.id} label={`${u.first_name} ${u.last_name} (${u.username})`} value={u.id} />
          ))}
        </Picker>
      </View>

      {/* Computer (Dropdown FK) */}
      <Text style={styles.label}>Computadora Asociada</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={formData.computer}
          onValueChange={(itemValue) => handleChange('computer', itemValue)}
          style={styles.picker}
          itemStyle={{ color: AppColors.text }}
        >
          <Picker.Item label="Ninguna" value={null} />
          {computers.map(c => (
            <Picker.Item key={c.id} label={`${c.asset_tag} - ${c.brand} ${c.model}`} value={c.id} />
          ))}
        </Picker>
      </View>

      {/* Network Device (Dropdown FK) */}
      <Text style={styles.label}>Dispositivo de Red Asociado</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={formData.network_device}
          onValueChange={(itemValue) => handleChange('network_device', itemValue)}
          style={styles.picker}
          itemStyle={{ color: AppColors.text }}
        >
          <Picker.Item label="Ninguno" value={null} />
          {networkDevices.map(nd => (
            <Picker.Item key={nd.id} label={`${nd.asset_tag} - ${nd.brand} ${nd.model}`} value={nd.id} />
          ))}
        </Picker>
      </View>

      {/* Site (Dropdown FK) */}
      <Text style={styles.label}>Sede Asociada</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={formData.site}
          onValueChange={(itemValue) => handleChange('site', itemValue)}
          style={styles.picker}
          itemStyle={{ color: AppColors.text }}
        >
          <Picker.Item label="Ninguna" value={null} />
          {sites.map(s => (
            <Picker.Item key={s.id} label={s.name} value={s.id} />
          ))}
        </Picker>
      </View>

      <AppButton
        title={isEditing ? 'Guardar Cambios' : 'Crear Ticket'}
        onPress={handleSubmit}
        disabled={loading}
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
  formTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: AppColors.primaryDark,
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: AppColors.text,
    marginBottom: 8,
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
  descriptionInput: {
    height: 120,
    textAlignVertical: 'top',
    paddingVertical: 12,
  },
  button: {
    width: '100%',
    marginTop: 24,
  },
  errorText: {
    color: AppColors.error,
    fontSize: 16,
  },
  pickerContainer: {
    backgroundColor: AppColors.cardBackground,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: AppColors.lightGray,
    marginBottom: 16,
    overflow: 'hidden',
  },
  picker: {
    height: 52,
    width: '100%',
    color: AppColors.text,
  },
});