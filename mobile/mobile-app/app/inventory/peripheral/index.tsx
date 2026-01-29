import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, ScrollView, ActivityIndicator, StyleSheet, TouchableOpacity, Alert, TextInput } from 'react-native';
import { router } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import api from '../../../../api/axios'; // Corrected path
import { Colors } from '../../../../constants/Colors';
import { Picker } from '@react-native-picker/picker';

const PeripheralInventoryScreen = () => {
  const [peripherals, setPeripherals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // State for search and filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [peripheralTypeFilter, setPeripheralTypeFilter] = useState('');
  const [siteFilter, setSiteFilter] = useState('');
  const [personFilter, setPersonFilter] = useState('');
  const [classroomFilter, setClassroomFilter] = useState('');

  // Options for filters (fetched or hardcoded)
  const [sites, setSites] = useState([]);
  const [persons, setPersons] = useState([]);
  const [classrooms, setClassrooms] = useState([]);

  const PERIPHERAL_TYPE_OPTIONS = [
    { value: "", label: "Todos los Tipos" },
    { value: "keyboard", label: "Teclado" },
    { value: "mouse", label: "Ratón" },
    { value: "monitor", label: "Monitor" },
    { value: "printer", label: "Impresora" },
    { value: "scanner", label: "Escáner" },
    { value: "webcam", label: "Webcam" },
    { value: "headset", label: "Auriculares" },
    { value: "ups", label: "UPS" },
    { value: "other", label: "Otro" },
  ];

  const STATUS_OPTIONS = [
    { value: "", label: "Todos los Estados" },
    { value: "active", label: "Activo" },
    { value: "maintenance", label: "En mantenimiento" },
    { value: "retired", label: "Retirado" },
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

  const fetchPeripherals = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (statusFilter) params.append('status', statusFilter);
      if (peripheralTypeFilter) params.append('peripheral_type', peripheralTypeFilter);
      if (siteFilter) params.append("site", siteFilter);
      if (personFilter) params.append("assigned_to_person", personFilter);
      if (classroomFilter) params.append("assigned_to_classroom", classroomFilter);

      const response = await api.get(`/assets/peripherals/?${params.toString()}`);
      setPeripherals(response.data);
    } catch (err) {
      setError('Failed to fetch peripherals.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, statusFilter, peripheralTypeFilter, siteFilter, personFilter, classroomFilter]);

  // Debounced fetch for peripherals
  useEffect(() => {
    const handler = setTimeout(() => {
      fetchPeripherals();
    }, 300); // Debounce for 300ms

    return () => {
      clearTimeout(handler);
    };
  }, [fetchPeripherals, searchTerm, statusFilter, peripheralTypeFilter, siteFilter, personFilter, classroomFilter]);


  const handleAddPeripheral = () => {
    router.push('/inventory/peripheral/form');
  };

  const handleEditPeripheral = (id) => {
    router.push(`/inventory/peripheral/${id}`);
  };

  const handleDeletePeripheral = async (id) => {
    Alert.alert(
      "Confirmar Eliminación",
      "¿Estás seguro de que quieres eliminar este periférico?",
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        {
          text: "Eliminar",
          onPress: async () => {
            try {
              await api.delete(`/assets/peripherals/${id}/`);
              fetchPeripherals();
            } catch (err) {
              setError("Failed to delete peripheral.");
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
        <Text style={styles.header}>Inventario de Periféricos</Text>
        <TouchableOpacity style={styles.addButton} onPress={handleAddPeripheral}>
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

        {/* Peripheral Type Filter */}
        <Picker
          selectedValue={peripheralTypeFilter}
          onValueChange={(itemValue) => setPeripheralTypeFilter(itemValue)}
          style={styles.picker}
        >
          {PERIPHERAL_TYPE_OPTIONS.map((option) => (
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
      ) : peripherals.length === 0 ? (
        <Text style={styles.noDataText}>No se encontraron periféricos.</Text>
      ) : (
        <ScrollView style={styles.listContainer}>
          {peripherals.map((peripheral) => (
            <TouchableOpacity key={peripheral.id} style={styles.peripheralItem} onPress={() => handleEditPeripheral(peripheral.id)}>
              <View style={styles.itemDetails}>
                <Text style={styles.itemTitle}>{peripheral.asset_tag} - {peripheral.peripheral_type}</Text>
                <Text style={styles.itemSubtitle}>{peripheral.brand} {peripheral.model} ({peripheral.serial_number})</Text>
                <Text style={[styles.itemStatus, peripheral.status === 'active' ? styles.statusActive : styles.statusInactive]}>
                  {peripheral.status}
                </Text>
              </View>
              <View style={styles.itemActions}>
                <TouchableOpacity onPress={() => handleEditPeripheral(peripheral.id)} style={styles.actionButton}>
                  <FontAwesome name="pencil" size={20} color={Colors.light.tint} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDeletePeripheral(peripheral.id)} style={styles.actionButton}>
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
  peripheralItem: {
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

export default PeripheralInventoryScreen;