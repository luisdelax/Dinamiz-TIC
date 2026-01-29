import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, Alert, ActivityIndicator, Pressable, Platform } from 'react-native';
import { Stack, useLocalSearchParams, router } from 'expo-router';
import api from '@/api/axios';
import { Picker } from '@react-native-picker/picker';
import { AppColors } from '@/constants/Colors'; // Import the new AppColors constant
import AppButton from '../../../components/ui/Button'; // Import AppButton

export default function PersonFormScreen() {
  const { id } = useLocalSearchParams();
  const isEditing = !!id;

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    site: null, // Foreign Key
    classroom: null, // Foreign Key
  });
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  // --- Fetch related data for dropdowns ---
  const [sites, setSites] = useState([]);
  const [classrooms, setClassrooms] = useState([]);

  useEffect(() => {
    const fetchRelatedData = async () => {
      try {
        const [sitesRes, classroomsRes] = await Promise.all([
          api.get('/organization/sites/'),
          api.get('/organization/classrooms/'),
        ]);
        setSites(sitesRes.data);
        setClassrooms(classroomsRes.data);
      } catch (err) {
        console.error("Error fetching related data:", err);
        Alert.alert("Error", "No se pudo cargar la información de sedes o aulas.");
      }
    };
    fetchRelatedData();
  }, []);

  // --- Load person data if editing ---
  useEffect(() => {
    if (isEditing) {
      const fetchPerson = async () => {
        try {
          const response = await api.get(`/organization/persons/${id}/`);
          const personData = response.data;
          setFormData({
            first_name: personData.first_name || '',
            last_name: personData.last_name || '',
            email: personData.email || '',
            phone_number: personData.phone_number || '',
            site: personData.site?.id || null, // Asegurarse de que sea el ID
            classroom: personData.classroom?.id || null, // Asegurarse de que sea el ID
          });
        } catch (err) {
          console.error(`Error fetching person ${id}:`, err);
          Alert.alert("Error", "No se pudo cargar los datos de la persona.");
          router.back();
        } finally {
          setInitialLoading(false);
        }
      };
      fetchPerson();
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
        site: formData.site || null,
        classroom: formData.classroom || null,
      };

      if (isEditing) {
        await api.put(`/organization/persons/${id}/`, dataToSend);
        Alert.alert("Éxito", "Persona actualizada correctamente.");
      } else {
        await api.post('/organization/persons/', dataToSend);
        Alert.alert("Éxito", "Persona creada correctamente.");
      }
      router.back();
    } catch (err) {
      console.error("Error submitting form:", err.response?.data || err.message);
      const errorMsg = err.response?.data ? JSON.stringify(err.response.data) : err.message;
      Alert.alert("Error", `No se pudo guardar la persona: ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={AppColors.primary} />
        <Text style={{ marginTop: 10, color: AppColors.subtleText }}>Cargando...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Stack.Screen options={{ title: isEditing ? 'Editar Persona' : 'Añadir Persona' }} />
      
      <Text style={styles.label}>Nombre</Text>
      <TextInput
        style={styles.input}
        value={formData.first_name}
        onChangeText={(val) => handleChange('first_name', val)}
        placeholder="Nombre"
        placeholderTextColor={AppColors.subtleText}
      />

      <Text style={styles.label}>Apellido</Text>
      <TextInput
        style={styles.input}
        value={formData.last_name}
        onChangeText={(val) => handleChange('last_name', val)}
        placeholder="Apellido"
        placeholderTextColor={AppColors.subtleText}
      />
      
      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        value={formData.email}
        onChangeText={(val) => handleChange('email', val)}
        placeholder="correo@ejemplo.com"
        placeholderTextColor={AppColors.subtleText}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <Text style={styles.label}>Número de Teléfono</Text>
      <TextInput
        style={styles.input}
        value={formData.phone_number}
        onChangeText={(val) => handleChange('phone_number', val)}
        placeholder="Ej. +1234567890"
        placeholderTextColor={AppColors.subtleText}
        keyboardType="phone-pad"
      />

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

      {/* Classroom (Dropdown FK) */}
      <Text style={styles.label}>Aula</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={formData.classroom}
          onValueChange={(itemValue) => handleChange('classroom', itemValue)}
          style={styles.picker}
          itemStyle={{ color: AppColors.text }}
        >
          <Picker.Item label="Ninguna" value={null} />
          {classrooms.map(classroom => (
            <Picker.Item key={classroom.id} label={`${classroom.name} (${classroom.site_name || 'N/A'})`} value={classroom.id} />
          ))}
        </Picker>
      </View>

      <AppButton
        title={isEditing ? 'Guardar Cambios' : 'Crear Persona'}
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
