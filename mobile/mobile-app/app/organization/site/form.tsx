import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, Alert, ActivityIndicator, Pressable, Platform } from 'react-native';
import { Stack, useLocalSearchParams, router } from 'expo-router';
import api from '@/api/axios';
import { AppColors } from '@/constants/Colors'; // Import the new AppColors constant
import AppButton from '../../../components/ui/Button'; // Import AppButton

export default function SiteFormScreen() {
  const { id } = useLocalSearchParams();
  const isEditing = !!id;

  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone_number: '',
    email: '',
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  // --- Load site data if editing ---
  useEffect(() => {
    if (isEditing) {
      const fetchSite = async () => {
        try {
          const response = await api.get(`/organization/sites/${id}/`);
          const siteData = response.data;
          setFormData({
            name: siteData.name || '',
            address: siteData.address || '',
            phone_number: siteData.phone_number || '',
            email: siteData.email || '',
            notes: siteData.notes || '',
          });
        } catch (err) {
          console.error(`Error fetching site ${id}:`, err);
          Alert.alert("Error", "No se pudo cargar los datos de la sede.");
          router.back();
        } finally {
          setInitialLoading(false);
        }
      };
      fetchSite();
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
      if (isEditing) {
        await api.put(`/organization/sites/${id}/`, formData);
        Alert.alert("Éxito", "Sede actualizada correctamente.");
      } else {
        await api.post('/organization/sites/', formData);
        Alert.alert("Éxito", "Sede creada correctamente.");
      }
      router.back();
    } catch (err) {
      console.error("Error submitting form:", err.response?.data || err.message);
      const errorMsg = err.response?.data ? JSON.stringify(err.response.data) : err.message;
      Alert.alert("Error", `No se pudo guardar la sede: ${errorMsg}`);
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
      <Stack.Screen options={{ title: isEditing ? 'Editar Sede' : 'Añadir Sede' }} />
      
      <Text style={styles.label}>Nombre</Text>
      <TextInput
        style={styles.input}
        value={formData.name}
        onChangeText={(val) => handleChange('name', val)}
        placeholder="Nombre de la sede"
        placeholderTextColor={AppColors.subtleText}
      />

      <Text style={styles.label}>Dirección</Text>
      <TextInput
        style={styles.input}
        value={formData.address}
        onChangeText={(val) => handleChange('address', val)}
        placeholder="Dirección completa"
        placeholderTextColor={AppColors.subtleText}
      />
      
      <Text style={styles.label}>Número de Teléfono</Text>
      <TextInput
        style={styles.input}
        value={formData.phone_number}
        onChangeText={(val) => handleChange('phone_number', val)}
        placeholder="Ej. +123456789"
        placeholderTextColor={AppColors.subtleText}
        keyboardType="phone-pad"
      />

      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        value={formData.email}
        onChangeText={(val) => handleChange('email', val)}
        placeholder="contacto@sede.com"
        placeholderTextColor={AppColors.subtleText}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <Text style={styles.label}>Notas</Text>
      <TextInput
        style={[styles.input, styles.notesInput]}
        value={formData.notes}
        onChangeText={(val) => handleChange('notes', val)}
        placeholder="Notas adicionales sobre la sede"
        placeholderTextColor={AppColors.subtleText}
        multiline
      />

      <AppButton
        title={isEditing ? 'Guardar Cambios' : 'Crear Sede'}
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
  button: {
    width: '100%',
    marginTop: 24,
  },
});
