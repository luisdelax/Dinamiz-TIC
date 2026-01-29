import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { Stack, useLocalSearchParams, router } from 'expo-router';
import api from '@/api/axios';
import { Picker } from '@react-native-picker/picker';
import { AppColors } from '@/constants/Colors'; // Import the new AppColors constant
import AppButton from '../../../components/ui/Button'; // Import AppButton

const PERIPHERAL_TYPE_CHOICES = [
  { label: 'Monitor', value: 'monitor' },
  { label: 'Teclado', value: 'keyboard' },
  { label: 'Mouse', value: 'mouse' },
  { label: 'Impresora', value: 'printer' },
  { label: 'Otro', value: 'other' },
];

const STATUS_CHOICES = [
  { label: 'Activo', value: 'active' },
  { label: 'En mantenimiento', value: 'maintenance' },
  { label: 'Retirado', value: 'retired' },
];

export default function PeripheralFormScreen() {
  const { id } = useLocalSearchParams();
  const isEditing = !!id;

  const [formData, setFormData] = useState({
    asset_tag: '',
    peripheral_type: 'monitor',
    brand: '',
    model: '',
    serial_number: '',
    status: 'active',
    assigned_to_person: null, // Foreign Key
    assigned_to_computer: null, // Foreign Key
    site: null, // Foreign Key
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  // --- Fetch related data for dropdowns ---
  const [people, setPeople] = useState([]);
  const [computers, setComputers] = useState([]);
  const [sites, setSites] = useState([]);

  useEffect(() => {
    const fetchRelatedData = async () => {
      try {
        const [peopleRes, computersRes, sitesRes] = await Promise.all([
          api.get('/organization/persons/'),
          api.get('/assets/computers/'),
          api.get('/organization/sites/'),
        ]);
        setPeople(peopleRes.data);
        setComputers(computersRes.data);
        setSites(sitesRes.data);
      } catch (err) {
        console.error("Error fetching related data:", err);
        Alert.alert("Error", "No se pudo cargar la información de personas, ordenadores o sedes.");
      }
    };
    fetchRelatedData();
  }, []);

  useEffect(() => {
    if (isEditing) {
      const fetchPeripheral = async () => {
        try {
          const response = await api.get(`/assets/peripherals/${id}/`);
          const peripheralData = response.data;
          setFormData({
            asset_tag: peripheralData.asset_tag || '',
            peripheral_type: peripheralData.peripheral_type || 'monitor',
            brand: peripheralData.brand || '',
            model: peripheralData.model || '',
            serial_number: peripheralData.serial_number || '',
            status: peripheralData.status || 'active',
            assigned_to_person: peripheralData.assigned_to_person || null,
            assigned_to_computer: peripheralData.assigned_to_computer || null,
            site: peripheralData.site || null,
            notes: peripheralData.notes || '',
          });
        } catch (err) {
          console.error(`Error fetching peripheral ${id}:`, err);
          Alert.alert("Error", "No se pudo cargar los datos del periférico.");
          router.back();
        } finally {
          setInitialLoading(false);
        }
      };
      fetchPeripheral();
    } else {
      setInitialLoading(false);
    }
  }, [id, isEditing]);

  const handleChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const dataToSend = {
        ...formData,
        assigned_to_person: formData.assigned_to_person || null,
        assigned_to_computer: formData.assigned_to_computer || null,
        site: formData.site || null,
      };

      if (isEditing) {
        await api.put(`/assets/peripherals/${id}/`, dataToSend);
        Alert.alert("Éxito", "Periférico actualizado correctamente.");
      } else {
        await api.post('/assets/peripherals/', dataToSend);
        Alert.alert("Éxito", "Periférico creado correctamente.");
      }
      router.back();
    } catch (err) {
      console.error("Error submitting form:", err.response?.data || err.message);
      const errorMsg = err.response?.data ? JSON.stringify(err.response.data) : err.message;
      Alert.alert("Error", `No se pudo guardar el periférico: ${errorMsg}`);
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
      <Stack.Screen options={{ title: isEditing ? 'Editar Periférico' : 'Añadir Periférico' }} />
      
      {/* Asset Tag (Read-only if editing, auto-generated if creating) */}
      <Text style={styles.label}>Código de Activo</Text>
      <TextInput
        style={styles.input}
        value={formData.asset_tag}
        onChangeText={(val) => handleChange('asset_tag', val)}
        editable={!isEditing}
        placeholder="Se generará automáticamente"
        placeholderTextColor={AppColors.subtleText}
      />

      {/* Peripheral Type (Dropdown) */}
      <Text style={styles.label}>Tipo de Periférico</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={formData.peripheral_type}
          onValueChange={(itemValue) => handleChange('peripheral_type', itemValue)}
          style={styles.picker}
          itemStyle={{ color: AppColors.text }}
        >
          {PERIPHERAL_TYPE_CHOICES.map(choice => (
            <Picker.Item key={choice.value} label={choice.label} value={choice.value} />
          ))}
        </Picker>
      </View>

      {/* Brand */}
      <Text style={styles.label}>Marca</Text>
      <TextInput
        style={styles.input}
        value={formData.brand}
        onChangeText={(val) => handleChange('brand', val)}
        placeholder="Marca"
        placeholderTextColor={AppColors.subtleText}
      />
      
      {/* Model */}
      <Text style={styles.label}>Modelo</Text>
      <TextInput
        style={styles.input}
        value={formData.model}
        onChangeText={(val) => handleChange('model', val)}
        placeholder="Modelo"
        placeholderTextColor={AppColors.subtleText}
      />

      {/* Serial Number */}
      <Text style={styles.label}>Número de Serie</Text>
      <TextInput
        style={styles.input}
        value={formData.serial_number}
        onChangeText={(val) => handleChange('serial_number', val)}
        placeholder="Número de Serie"
        placeholderTextColor={AppColors.subtleText}
      />

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

      {/* Assigned To Person (Dropdown FK) */}
      <Text style={styles.label}>Asignado a Persona</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={formData.assigned_to_person}
          onValueChange={(itemValue) => handleChange('assigned_to_person', itemValue)}
          style={styles.picker}
          itemStyle={{ color: AppColors.text }}
        >
          <Picker.Item label="Ninguna" value={null} />
          {people.map(person => (
            <Picker.Item key={person.id} label={`${person.first_name} ${person.last_name}`} value={person.id} />
          ))}
        </Picker>
      </View>

      {/* Assigned To Computer (Dropdown FK) */}
      <Text style={styles.label}>Asignado a Ordenador</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={formData.assigned_to_computer}
          onValueChange={(itemValue) => handleChange('assigned_to_computer', itemValue)}
          style={styles.picker}
          itemStyle={{ color: AppColors.text }}
        >
          <Picker.Item label="Ninguno" value={null} />
          {computers.map(computer => (
            <Picker.Item key={computer.id} label={computer.asset_tag} value={computer.id} />
          ))}
        </Picker>
      </View>

      {/* Site (Dropdown FK) */}
      <Text style={styles.label}>Sede</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={formData.site}
          onValueChange={(itemValue) => handleChange('site', itemValue)}
          style={styles.picker}
          itemStyle={{ color: AppColors.text }}
        >
          <Picker.Item label="Ninguna" value={null} />
          {sites.map(site => (
            <Picker.Item key={site.id} label={site.name} value={site.id} />
          ))}
        </Picker>
      </View>

      {/* Notes */}
      <Text style={styles.label}>Notas</Text>
      <TextInput
        style={[styles.input, styles.notesInput]}
        value={formData.notes}
        onChangeText={(val) => handleChange('notes', val)}
        placeholder="Notas adicionales"
        placeholderTextColor={AppColors.subtleText}
        multiline
      />

      <AppButton
        title={isEditing ? 'Guardar Cambios' : 'Crear Periférico'}
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
  notesInput: {
    height: 120,
    textAlignVertical: 'top',
    paddingVertical: 12,
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