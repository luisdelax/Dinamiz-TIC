import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, ScrollView, ActivityIndicator, StyleSheet, TouchableOpacity, Alert, TextInput } from 'react-native';
import { router } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import api from '../../../../api/axios'; // Corrected path
import { Colors } from '../../../../constants/Colors';
import { Picker } from '@react-native-picker/picker'; // Import Picker

const ComputerInventoryScreen = () => {
  const [computers, setComputers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // State for search and filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [equipmentTypeFilter, setEquipmentTypeFilter] = useState('');
  // Add states for site, person, classroom filters here
  const [siteFilter, setSiteFilter] = useState('');
  const [personFilter, setPersonFilter] = useState('');
  const [classroomFilter, setClassroomFilter] = useState('');


  const [sites, setSites] = useState([]);
  const [persons, setPersons] = useState([]);
  const [classrooms, setClassrooms] = useState([]);

  const EQUIPMENT_TYPE_OPTIONS = [
    { value: "", label: "Todos los Tipos" },
    { value: "desktop", label: "PC Escritorio" },
    { value: "laptop", label: "Laptop" },
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

  const fetchComputers = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (statusFilter) params.append('status', statusFilter);
      if (equipmentTypeFilter) params.append('equipment_type', equipmentTypeFilter);
      // Add site, person, classroom filters to params
      if (siteFilter) params.append("site", siteFilter);
      if (personFilter) params.append("assigned_to_person", personFilter);
      if (classroomFilter) params.append("assigned_to_classroom", classroomFilter);

      const response = await api.get(`/assets/computers/?${params.toString()}`);
      setComputers(response.data);
    } catch (err) {
      setError('Failed to fetch computers.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, statusFilter, equipmentTypeFilter, siteFilter, personFilter, classroomFilter]);

  // Debounced fetch for computers
  useEffect(() => {
    const handler = setTimeout(() => {
      fetchComputers();
    }, 300); // Debounce for 300ms

    return () => {
      clearTimeout(handler);
    };
  }, [fetchComputers, searchTerm, statusFilter, equipmentTypeFilter, siteFilter, personFilter, classroomFilter]);


  const handleAddComputer = () => {
    router.push('/inventory/computer/form');
  };

  const handleEditComputer = (id) => {
    router.push(`/inventory/computer/${id}`);
  };

  const handleDeleteComputer = async (id) => {
    Alert.alert(
      "Confirmar Eliminación",
      "¿Estás seguro de que quieres eliminar esta computadora?",
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        {
          text: "Eliminar",
          onPress: async () => {
            try {
              await api.delete(`/assets/computers/${id}/`);
              fetchComputers();
            } catch (err) {
              setError("Failed to delete computer.");
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
        <Text style={styles.header}>Inventario de Computadoras</Text>
        <TouchableOpacity style={styles.addButton} onPress={handleAddComputer}>
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

        {/* Equipment Type Filter */}
        <Picker
          selectedValue={equipmentTypeFilter}
          onValueChange={(itemValue) => setEquipmentTypeFilter(itemValue)}
          style={styles.picker}
        >
          {EQUIPMENT_TYPE_OPTIONS.map((option) => (
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
      ) : computers.length === 0 ? (
        <Text style={styles.noDataText}>No se encontraron computadoras.</Text>
      ) : (
        <ScrollView style={styles.listContainer}>
          {computers.map((computer) => (
            <TouchableOpacity key={computer.id} style={styles.computerItem} onPress={() => handleEditComputer(computer.id)}>
              <View style={styles.itemDetails}>
                <Text style={styles.itemTitle}>{computer.asset_tag} - {computer.equipment_type}</Text>
                <Text style={styles.itemSubtitle}>{computer.brand} {computer.model} ({computer.serial_number})</Text>
                <Text style={[styles.itemStatus, computer.status === 'active' ? styles.statusActive : styles.statusInactive]}>
                  {computer.status}
                </Text>
              </View>
              <View style={styles.itemActions}>
                <TouchableOpacity onPress={() => handleEditComputer(computer.id)} style={styles.actionButton}>
                  <FontAwesome name="pencil" size={20} color={Colors.light.tint} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDeleteComputer(computer.id)} style={styles.actionButton}>
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
    // Add styling for grid layout if needed for multiple filters per row
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
  computerItem: {
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

export default ComputerInventoryScreen;
