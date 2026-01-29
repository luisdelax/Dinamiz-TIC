import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, Alert, ActivityIndicator, Pressable, Platform } from 'react-native';
import { Stack, useLocalSearchParams, router } from 'expo-router';
import api from '@/api/axios';
import { Picker } from '@react-native-picker/picker';
import { AppColors } from '@/constants/Colors'; // Import the new AppColors constant
import AppButton from '../../../components/ui/Button'; // Import AppButton

export default function ClassroomFormScreen() {
  const { id } = useLocalSearchParams();
  const isEditing = !!id;

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    site: null, // Foreign Key
  });
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  // --- Fetch related data for site dropdown ---
  const [sites, setSites] = useState([]);

  useEffect(() => {
    const fetchSites = async () => {
      try {
        const response = await api.get('/organization/sites/');
        setSites(response.data);
      } catch (err) {
        console.error("Error fetching sites:", err);
        Alert.alert("Error", "No se pudo cargar la información de sedes.");
      }
    };
    fetchSites();
  }, []);

  // --- Load classroom data if editing ---
  useEffect(() => {
    if (isEditing) {
      const fetchClassroom = async () => {
        try {
          const response = await api.get(`/organization/classrooms/${id}/`);
          const classroomData = response.data;
          setFormData({
            name: classroomData.name || '',
            description: classroomData.description || '',
            site: classroomData.site?.id || null, // Asegurarse de que sea el ID
          });
        } catch (err) {
          console.error(`Error fetching classroom ${id}:`, err);
          Alert.alert("Error", "No se pudo cargar los datos del aula.");
          router.back();
        } finally {
          setInitialLoading(false);
        }
      };
      fetchClassroom();
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
      };

      if (isEditing) {
        await api.put(`/organization/classrooms/${id}/`, dataToSend);
        Alert.alert("Éxito", "Aula actualizada correctamente.");
      } else {
        await api.post('/organization/classrooms/', dataToSend);
        Alert.alert("Éxito", "Aula creada correctamente.");
      }
      router.back();
    } catch (err) {
      console.error("Error submitting form:", err.response?.data || err.message);
      const errorMsg = err.response?.data ? JSON.stringify(err.response.data) : err.message;
      Alert.alert("Error", `No se pudo guardar el aula: ${errorMsg}`);
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
      <Stack.Screen options={{ title: isEditing ? 'Editar Aula' : 'Añadir Aula' }} />
      
      <Text style={styles.label}>Nombre del Aula</Text>
      <TextInput
        style={styles.input}
        value={formData.name}
        onChangeText={(val) => handleChange('name', val)}
        placeholder="Ej. Sala 101"
        placeholderTextColor={AppColors.subtleText}
      />

      <Text style={styles.label}>Descripción</Text>
      <TextInput
        style={[styles.input, styles.descriptionInput]}
        value={formData.description}
        onChangeText={(val) => handleChange('description', val)}
        placeholder="Descripción del aula"
        placeholderTextColor={AppColors.subtleText}
        multiline
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

      <AppButton
        title={isEditing ? 'Guardar Cambios' : 'Crear Aula'}
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
