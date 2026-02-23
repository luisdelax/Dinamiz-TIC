import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, ScrollView, ActivityIndicator, StyleSheet, TouchableOpacity, Alert, TextInput } from 'react-native';
import { router } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import api from '../../../../api/axios'; // Corrected path
import { Colors } from '../../../../constants/Colors';
import { Picker } from '@react-native-picker/picker';

const NetworkDeviceInventoryScreen = () => {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // State for search and filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [deviceTypeFilter, setDeviceTypeFilter] = useState('');
  const [siteFilter, setSiteFilter] = useState('');
  const [personFilter, setPersonFilter] = useState('');
  const [classroomFilter, setClassroomFilter] = useState('');

  // Options for filters (fetched or hardcoded)
  const [sites, setSites] = useState([]);
  const [persons, setPersons] = useState([]);
  const [classrooms, setClassrooms] = useState([]);

  const DEVICE_TYPE_OPTIONS = [
    { value: "", label: "Todos los Tipos" },
    { value: "router", label: "Router" },
    { value: "switch", label: "Switch" },
    { value: "ap", label: "Access Point" },
    { value: "patchpanel", label: "Patch Panel" },
    { value: "firewall", label: "Firewall" },
  ];

  const STATUS_OPTIONS = [
    { value: "", label: "Todos los Estados" },
    { value: "active", label: "Activo" },
    { value: "maintenance", label: "En mantenimiento" },
    { value: "down", label: "Fuera de servicio" },
  ];

  // Fetch initial data for filters (sites, persons, classrooms)
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [sitesRes, personsRes, classroomsRes] = await Promise.all([
          api.get("/organization/sites/"),
          api.get("/organization/persons/"),
          api.get("/organization/classrooms/"),
        ]);
        setSites(sitesRes.data);
        setPersons(personsRes.data);
        setClassrooms(classroomsRes.data);
      } catch (err) {
        console.error("Error fetching initial data for filters:", err);
      }
    };
    fetchInitialData();
  }, []);

  const fetchDevices = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (statusFilter) params.append('status', statusFilter);
      if (deviceTypeFilter) params.append('device_type', deviceTypeFilter);
      if (siteFilter) params.append("site", siteFilter);
      if (personFilter) params.append("assigned_to_person", personFilter);
      if (classroomFilter) params.append("assigned_to_classroom", classroomFilter);

      const response = await api.get(`/assets/network-devices/?${params.toString()}`);
      setDevices(response.data);
    } catch (err) {
      setError('Failed to fetch network devices.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, statusFilter, deviceTypeFilter, siteFilter, personFilter, classroomFilter]);

  // Debounced fetch for network devices
  useEffect(() => {
    const handler = setTimeout(() => {
      fetchDevices();
    }, 300); // Debounce for 300ms

    return () => {
      clearTimeout(handler);
    };
  }, [fetchDevices, searchTerm, statusFilter, deviceTypeFilter, siteFilter, personFilter, classroomFilter]);


  const handleAddDevice = () => {
    router.push('/inventory/network-device/form');
  };

  const handleEditDevice = (id) => {
    router.push(`/inventory/network-device/${id}`);
  };

  const handleDeleteDevice = async (id) => {
    Alert.alert(
      "Confirmar Eliminación",
      "¿Estás seguro de que quieres eliminar este equipo de red?",
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        {
          text: "Eliminar",
          onPress: async () => {
            try {
              await api.delete(`/assets/network-devices/${id}/`);
              fetchDevices();
            } catch (err) {
              setError("Failed to delete network device.");
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
        <Text style={styles.header}>Inventario de Equipos de Red</Text>
        <TouchableOpacity style={styles.addButton} onPress={handleAddDevice}>
          <FontAwesome name="plus" size={20} color="#fff" />
          <Text style={styles.addButtonText}>Agregar</Text>
        </TouchableOpacity>
      </View>

      {/* Search and Filter Section */}
      <View style={styles.filterSection}>
        {/* Search Input */}
        <View style={styles.searchInputContainer}>
          <FontAwesome name="search" size={16} color={Colors.light.text} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar..."
            placeholderTextColor={Colors.light.lightGray}
            value={searchTerm}
            onChangeText={setSearchTerm}
          />
        </View>

        {/* Filters (implement as Picker components) */}
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

        {/* Device Type Filter */}
        <Picker
          selectedValue={deviceTypeFilter}
          onValueChange={(itemValue) => setDeviceTypeFilter(itemValue)}
          style={styles.picker}
        >
          {DEVICE_TYPE_OPTIONS.map((option) => (
            <Picker.Item key={option.value} label={option.label} value={option.value} />
          ))}
        </Picker>

        {/* Site Filter */}
        <Picker
          selectedValue={siteFilter}
          onValueChange={(itemValue) => setSiteFilter(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Todas las Sedes" value="" />
          {sites.map((site) => (
            <Picker.Item key={site.id} label={site.name} value={site.id} />
          ))}
        </Picker>

        {/* Person Filter */}
        <Picker
          selectedValue={personFilter}
          onValueChange={(itemValue) => setPersonFilter(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Todas las Personas" value="" />
          {persons.map((person) => (
            <Picker.Item key={person.id} label={`${person.first_name} ${person.last_name}`} value={person.id} />
          ))}
        </Picker>

        {/* Classroom Filter */}
        <Picker
          selectedValue={classroomFilter}
          onValueChange={(itemValue) => setClassroomFilter(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Todas las Aulas" value="" />
          {classrooms.map((classroom) => (
            <Picker.Item key={classroom.id} label={classroom.name} value={classroom.id} />
          ))}
        </Picker>
      </View>

      {error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : devices.length === 0 ? (
        <Text style={styles.noDataText}>No se encontraron equipos de red.</Text>
      ) : (
        <ScrollView style={styles.listContainer}>
          {devices.map((device) => (
            <TouchableOpacity key={device.id} style={styles.deviceItem} onPress={() => handleEditDevice(device.id)}>
              <View style={styles.itemDetails}>
                <Text style={styles.itemTitle}>{device.asset_tag} - {device.device_type}</Text>
                <Text style={styles.itemSubtitle}>{device.brand} {device.model} ({device.ip_address})</Text>
                <Text style={[styles.itemStatus, device.status === 'active' ? styles.statusActive : styles.statusInactive]}>
                  {device.status}
                </Text>
              </View>
              <View style={styles.itemActions}>
                <TouchableOpacity onPress={() => handleEditDevice(device.id)} style={styles.actionButton}>
                  <FontAwesome name="pencil" size={20} color={Colors.light.tint} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDeleteDevice(device.id)} style={styles.actionButton}>
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
  deviceItem: {
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
  statusActive: {
    backgroundColor: '#D1FAE5', // green-100
    color: '#065F46', // green-900
  },
  statusInactive: {
    backgroundColor: '#FEE2E2', // red-100
    color: '#991B1B', // red-900
  },
  itemActions: {
    flexDirection: 'row',
  },
  actionButton: {
    marginLeft: 15,
  },
});

export default NetworkDeviceInventoryScreen;
