import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, Alert, ActivityIndicator, Pressable, Platform } from 'react-native';
import { Stack, useLocalSearchParams, router } from 'expo-router';
import api from '@/api/axios';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { AppColors } from '@/constants/Colors'; // Import the new AppColors constant

// Opciones para campos de selección (ej. equipment_type, status)
const EQUIPMENT_TYPE_CHOICES = [
  { label: 'PC Escritorio', value: 'desktop' },
  { label: 'Laptop', value: 'laptop' },
];

const STATUS_CHOICES = [
  { label: 'Activo', value: 'active' },
  { label: 'En mantenimiento', value: 'maintenance' },
  { label: 'Retirado', value: 'retired' },
];

export default function ComputerFormScreen() {
  const { id } = useLocalSearchParams(); // Para saber si es editar o crear
  const isEditing = !!id;

  const [formData, setFormData] = useState({
    asset_tag: '',
    equipment_type: 'desktop', // Default value
    brand: '',
    model: '',
    serial_number: '',
    processor: '',
    ram: '',
    storage: '',
    operating_system: '',
    status: 'active', // Default value
    assigned_to_person: null, // Foreign Key
    assigned_to_classroom: null, // Foreign Key
    site: null, // Foreign Key
    purchase_date: '', // Date
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [showDatePicker, setShowDatePicker] = useState(false); // Estado para mostrar/ocultar DatePicker

  // --- Fetch related data for dropdowns ---
  const [people, setPeople] = useState([]);
  const [classrooms, setClassrooms] = useState([]);
  const [sites, setSites] = useState([]);

  useEffect(() => {
    const fetchRelatedData = async () => {
      try {
        const [peopleRes, classroomsRes, sitesRes] = await Promise.all([
          api.get('/organization/persons/'),
          api.get('/organization/classrooms/'),
          api.get('/organization/sites/'),
        ]);
        setPeople(peopleRes.data);
        setClassrooms(classroomsRes.data);
        setSites(sitesRes.data);
      } catch (err) {
        console.error("Error fetching related data:", err);
        Alert.alert("Error", "No se pudo cargar la información de personas, aulas o sedes.");
      }
    };
    fetchRelatedData();
  }, []);

  // --- Load computer data if editing ---
  useEffect(() => {
    if (isEditing) {
      const fetchComputer = async () => {
        try {
          const response = await api.get(`/assets/computers/${id}/`);
          const computerData = response.data;
          setFormData({
            asset_tag: computerData.asset_tag || '',
            equipment_type: computerData.equipment_type || 'desktop',
            brand: computerData.brand || '',
            model: computerData.model || '',
            serial_number: computerData.serial_number || '',
            processor: computerData.processor || '',
            ram: computerData.ram || '',
            storage: computerData.storage || '',
            operating_system: computerData.operating_system || '',
            status: computerData.status || 'active',
            // Asegurarse de que los FKs sean IDs para el Picker
            assigned_to_person: computerData.assigned_to_person || null,
            assigned_to_classroom: computerData.assigned_to_classroom || null,
            site: computerData.site || null,
            purchase_date: computerData.purchase_date || '',
            notes: computerData.notes || '',
          });
        } catch (err) {
          console.error(`Error fetching computer ${id}:`, err);
          Alert.alert("Error", "No se pudo cargar los datos del ordenador.");
          router.back();
        } finally {
          setInitialLoading(false);
        }
      };
      fetchComputer();
    } else {
      setInitialLoading(false);
    }
  }, [id, isEditing]);

  const handleChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(Platform.OS === 'ios'); // En iOS, el picker se cierra solo, en Android hay que cerrarlo
    if (selectedDate) {
      const formattedDate = selectedDate.toISOString().split('T')[0]; // Formato YYYY-MM-DD
      handleChange('purchase_date', formattedDate);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // Ajustar los valores de FK a solo IDs para el envío a la API
      const dataToSend = {
        ...formData,
        assigned_to_person: formData.assigned_to_person || null,
        assigned_to_classroom: formData.assigned_to_classroom || null,
        site: formData.site || null,
        // Convertir fecha a formato YYYY-MM-DD si existe
        purchase_date: formData.purchase_date ? formData.purchase_date : null,
      };

      if (isEditing) {
        await api.put(`/assets/computers/${id}/`, dataToSend);
        Alert.alert("Éxito", "Ordenador actualizado correctamente.");
      } else {
        await api.post('/assets/computers/', dataToSend);
        Alert.alert("Éxito", "Ordenador creado correctamente.");
      }
      router.back(); // Volver a la pantalla anterior
    } catch (err) {
      console.error("Error submitting form:", err.response?.data || err.message);
      const errorMsg = err.response?.data ? JSON.stringify(err.response.data) : err.message;
      Alert.alert("Error", `No se pudo guardar el ordenador: ${errorMsg}`);
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
      <Stack.Screen options={{ title: isEditing ? 'Editar Ordenador' : 'Añadir Ordenador' }} />
      
      <Text style={styles.formTitle}>{isEditing ? 'Editar Ordenador' : 'Nuevo Ordenador'}</Text>
      
      {/* Asset Tag (Read-only if editing, auto-generated if creating) */}
      <Text style={styles.label}>Código de Activo</Text>
      <TextInput
        style={styles.input}
        value={formData.asset_tag}
        onChangeText={(val) => handleChange('asset_tag', val)}
        editable={!isEditing} // No editable si es edición
        placeholder="Se generará automáticamente"
        placeholderTextColor={AppColors.subtleText}
      />

      {/* Equipment Type (Dropdown) */}
      <Text style={styles.label}>Tipo de Equipo</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={formData.equipment_type}
          onValueChange={(itemValue) => handleChange('equipment_type', itemValue)}
          style={styles.picker}
          itemStyle={{ color: AppColors.text }} // Color del texto de los items
        >
          {EQUIPMENT_TYPE_CHOICES.map(choice => (
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

      {/* Processor */}
      <Text style={styles.label}>Procesador</Text>
      <TextInput
        style={styles.input}
        value={formData.processor}
        onChangeText={(val) => handleChange('processor', val)}
        placeholder="Ej. Intel Core i7"
        placeholderTextColor={AppColors.subtleText}
      />

      {/* RAM */}
      <Text style={styles.label}>RAM</Text>
      <TextInput
        style={styles.input}
        value={formData.ram}
        onChangeText={(val) => handleChange('ram', val)}
        placeholder="Ej. 16GB DDR4"
        placeholderTextColor={AppColors.subtleText}
      />

      {/* Storage */}
      <Text style={styles.label}>Almacenamiento</Text>
      <TextInput
        style={styles.input}
        value={formData.storage}
        onChangeText={(val) => handleChange('storage', val)}
        placeholder="Ej. 512GB SSD"
        placeholderTextColor={AppColors.subtleText}
      />

      {/* Operating System */}
      <Text style={styles.label}>Sistema Operativo</Text>
      <TextInput
        style={styles.input}
        value={formData.operating_system}
        onChangeText={(val) => handleChange('operating_system', val)}
        placeholder="Ej. Windows 10 Pro"
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

      {/* Assigned To Classroom (Dropdown FK) */}
      <Text style={styles.label}>Asignado a Aula</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={formData.assigned_to_classroom}
          onValueChange={(itemValue) => handleChange('assigned_to_classroom', itemValue)}
          style={styles.picker}
          itemStyle={{ color: AppColors.text }}
        >
          <Picker.Item label="Ninguna" value={null} />
          {classrooms.map(classroom => (
            <Picker.Item key={classroom.id} label={classroom.name} value={classroom.id} />
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

      {/* Purchase Date (Date Picker) */}
      <Text style={styles.label}>Fecha de Compra</Text>
      <Pressable onPress={() => setShowDatePicker(true)} style={styles.input}>
        <Text style={{ color: formData.purchase_date ? AppColors.text : AppColors.subtleText, fontSize: 16 }}>
          {formData.purchase_date || 'Seleccionar fecha'}
        </Text>
      </Pressable>
      {showDatePicker && (
        <DateTimePicker
          value={formData.purchase_date ? new Date(formData.purchase_date) : new Date()}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}

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

      <Pressable
        style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
        onPress={handleSubmit}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color={AppColors.cardBackground} />
        ) : (
          <Text style={styles.buttonText}>
            {isEditing ? 'Guardar Cambios' : 'Crear Ordenador'}
          </Text>
        )}
      </Pressable>
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
  button: {
    backgroundColor: AppColors.primary,
    height: 52,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonPressed: {
    opacity: 0.8,
  },
  buttonText: {
    color: AppColors.cardBackground,
    fontSize: 18,
    fontWeight: '600',
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
