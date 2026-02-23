import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { Stack, useLocalSearchParams, router } from 'expo-router';
import api from '@/api/axios'; // Adjusted path
import { Picker } from '@react-native-picker/picker';
import { AppColors } from '@/constants/Colors'; // Import the new AppColors constant
import AppButton from '../../../components/ui/Button'; // Import AppButton

const NETWORK_DEVICE_TYPE_CHOICES = [
  { label: 'Router', value: 'router' },
  { label: 'Switch', value: 'switch' },
  { label: 'Access Point', value: 'access_point' },
  { label: 'Firewall', value: 'firewall' },
  { label: 'Other', value: 'other' },
];

const STATUS_CHOICES = [
  { label: 'Activo', value: 'active' },
  { label: 'En mantenimiento', value: 'maintenance' },
  { label: 'Retirado', value: 'retired' },
];

export default function NetworkDeviceFormScreen() {
  const { id } = useLocalSearchParams();
  const isEditing = !!id;

  const [formData, setFormData] = useState({
    asset_tag: '',
    device_type: 'router',
    brand: '',
    model: '',
    serial_number: '',
    ip_address: '',
    mac_address: '',
    location: '', // Consider changing to foreign key if needed
    status: 'active',
    site: null, // Foreign Key
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  // --- Fetch related data for dropdowns ---
  const [sites, setSites] = useState([]);

  useEffect(() => {
    const fetchRelatedData = async () => {
      try {
        const sitesRes = await api.get('/organization/sites/');
        setSites(sitesRes.data);
      } catch (err) {
        console.error("Error fetching related data:", err);
        Alert.alert("Error", "No se pudo cargar la información de sedes.");
      }
    };
    fetchRelatedData();
  }, []);

  useEffect(() => {
    if (isEditing) {
      const fetchNetworkDevice = async () => {
        try {
          const response = await api.get(`/assets/network-devices/${id}/`);
          const deviceData = response.data;
          setFormData({
            asset_tag: deviceData.asset_tag || '',
            device_type: deviceData.device_type || 'router',
            brand: deviceData.brand || '',
            model: deviceData.model || '',
            serial_number: deviceData.serial_number || '',
            ip_address: deviceData.ip_address || '',
            mac_address: deviceData.mac_address || '',
            location: deviceData.location || '',
            status: deviceData.status || 'active',
            site: deviceData.site || null,
            notes: deviceData.notes || '',
          });
        } catch (err) {
          console.error(`Error fetching network device ${id}:`, err);
          Alert.alert("Error", "No se pudo cargar los datos del dispositivo de red.");
          router.back();
        } finally {
          setInitialLoading(false);
        }
      };
      fetchNetworkDevice();
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
        await api.put(`/assets/network-devices/${id}/`, dataToSend);
        Alert.alert("Éxito", "Dispositivo de red actualizado correctamente.");
      } else {
        await api.post('/assets/network-devices/', dataToSend);
        Alert.alert("Éxito", "Dispositivo de red creado correctamente.");
      }
      router.back();
    } catch (err) {
      console.error("Error submitting form:", err.response?.data || err.message);
      const errorMsg = err.response?.data ? JSON.stringify(err.response.data) : err.message;
      Alert.alert("Error", `No se pudo guardar el dispositivo de red: ${errorMsg}`);
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
      <Stack.Screen options={{ title: isEditing ? 'Editar Dispositivo de Red' : 'Añadir Dispositivo de Red' }} />
      
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

      {/* Device Type (Dropdown) */}
      <Text style={styles.label}>Tipo de Dispositivo</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={formData.device_type}
          onValueChange={(itemValue) => handleChange('device_type', itemValue)}
          style={styles.picker}
          itemStyle={{ color: AppColors.text }}
        >
          {NETWORK_DEVICE_TYPE_CHOICES.map(choice => (
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

      {/* IP Address */}
      <Text style={styles.label}>Dirección IP</Text>
      <TextInput
        style={styles.input}
        value={formData.ip_address}
        onChangeText={(val) => handleChange('ip_address', val)}
        placeholder="Ej. 192.168.1.1"
        placeholderTextColor={AppColors.subtleText}
        keyboardType="numeric"
      />

      {/* MAC Address */}
      <Text style={styles.label}>Dirección MAC</Text>
      <TextInput
        style={styles.input}
        value={formData.mac_address}
        onChangeText={(val) => handleChange('mac_address', val)}
        placeholder="Ej. 00:00:00:00:00:00"
        placeholderTextColor={AppColors.subtleText}
      />

      {/* Location */}
      <Text style={styles.label}>Ubicación</Text>
      <TextInput
        style={styles.input}
        value={formData.location}
        onChangeText={(val) => handleChange('location', val)}
        placeholder="Ubicación física"
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
        title={isEditing ? 'Guardar Cambios' : 'Crear Dispositivo de Red'}
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