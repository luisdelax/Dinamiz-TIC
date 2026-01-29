import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, Alert, ActivityIndicator, Pressable, Switch, Platform } from 'react-native';
import { Stack, useLocalSearchParams, router } from 'expo-router';
import api from '@/api/axios';
import { Picker } from '@react-native-picker/picker';
import { AppColors } from '@/constants/Colors'; // Import the new AppColors constant
import AppButton from '../../components/ui/Button'; // Import AppButton

// Opciones para roles (de users/models.py)
const ROLE_CHOICES = [
  { label: 'Administrador', value: 'admin' },
  { label: 'Técnico', value: 'technician' },
  { label: 'Usuario', value: 'user' },
];

export default function UserFormScreen() {
  const { id } = useLocalSearchParams();
  const isEditing = !!id;

  const [formData, setFormData] = useState({
    username: '',
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    confirm_password: '', // Solo para el frontend
    role: 'user', // Default value
    site: null, // Foreign Key
    is_active: true,
    is_staff: false,
    is_superuser: false,
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

  // --- Load user data if editing ---
  useEffect(() => {
    if (isEditing) {
      const fetchUser = async () => {
        try {
          const response = await api.get(`/users/${id}/`);
          const userData = response.data;
          setFormData({
            username: userData.username || '',
            first_name: userData.first_name || '',
            last_name: userData.last_name || '',
            email: userData.email || '',
            password: '', // Nunca precargar la contraseña
            confirm_password: '',
            role: userData.role || 'user',
            site: userData.site?.id || null, // Asegurarse de que sea el ID
            is_active: userData.is_active,
            is_staff: userData.is_staff,
            is_superuser: userData.is_superuser,
          });
        } catch (err) {
          console.error(`Error fetching user ${id}:`, err);
          Alert.alert("Error", "No se pudo cargar los datos del usuario.");
          router.back();
        } finally {
          setInitialLoading(false);
        }
      };
      fetchUser();
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
      if (!isEditing && formData.password !== formData.confirm_password) {
        Alert.alert("Error", "Las contraseñas no coinciden.");
        setLoading(false);
        return;
      }

      const dataToSend = {
        username: formData.username,
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        role: formData.role,
        site: formData.site || null,
        is_active: formData.is_active,
        is_staff: formData.is_staff,
        is_superuser: formData.is_superuser,
      };

      // Solo enviar la contraseña si se está creando o si se ha introducido una nueva en edición
      if (formData.password) {
        dataToSend.password = formData.password;
      }

      if (isEditing) {
        await api.patch(`/users/${id}/`, dataToSend); // Usar PATCH para actualizaciones parciales
        Alert.alert("Éxito", "Usuario actualizado correctamente.");
      } else {
        await api.post('/users/', dataToSend);
        Alert.alert("Éxito", "Usuario creado correctamente.");
      }
      router.back();
    } catch (err) {
      console.error("Error submitting form:", err.response?.data || err.message);
      const errorMsg = err.response?.data ? JSON.stringify(err.response.data) : err.message;
      Alert.alert("Error", `No se pudo guardar el usuario: ${errorMsg}`);
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
      <Stack.Screen options={{ title: isEditing ? 'Editar Usuario' : 'Añadir Usuario' }} />
      
      <Text style={styles.label}>Nombre de Usuario</Text>
      <TextInput
        style={styles.input}
        value={formData.username}
        onChangeText={(val) => handleChange('username', val)}
        placeholder="Nombre de usuario único"
        placeholderTextColor={AppColors.subtleText}
        autoCapitalize="none"
      />

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
        placeholder="ejemplo@dominio.com"
        placeholderTextColor={AppColors.subtleText}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <Text style={styles.label}>Contraseña</Text>
      <TextInput
        style={styles.input}
        value={formData.password}
        onChangeText={(val) => handleChange('password', val)}
        placeholder={isEditing ? 'Dejar en blanco para no cambiar' : 'Contraseña'}
        placeholderTextColor={AppColors.subtleText}
        secureTextEntry
      />
      
      {!isEditing && ( // Confirmar contraseña solo al crear
        <>
          <Text style={styles.label}>Confirmar Contraseña</Text>
          <TextInput
            style={styles.input}
            value={formData.confirm_password}
            onChangeText={(val) => handleChange('confirm_password', val)}
            placeholder="Repite la nueva contraseña"
            placeholderTextColor={AppColors.subtleText}
            secureTextEntry
          />
        </>
      )}

      {/* Role (Dropdown) */}
      <Text style={styles.label}>Rol</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={formData.role}
          onValueChange={(itemValue) => handleChange('role', itemValue)}
          style={styles.picker}
          itemStyle={{ color: AppColors.text }}
        >
          {ROLE_CHOICES.map(choice => (
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

      {/* Switch for is_active */}
      <View style={styles.switchContainer}>
        <Text style={styles.label}>Usuario Activo</Text>
        <Switch
          onValueChange={(val) => handleChange('is_active', val)}
          value={formData.is_active}
          trackColor={{ false: AppColors.lightGray, true: AppColors.primary }}
          thumbColor={Platform.OS === 'android' ? AppColors.cardBackground : (formData.is_active ? AppColors.primary : AppColors.cardBackground)}
        />
      </View>

      {/* Switch for is_staff */}
      <View style={styles.switchContainer}>
        <Text style={styles.label}>Acceso a Staff</Text>
        <Switch
          onValueChange={(val) => handleChange('is_staff', val)}
          value={formData.is_staff}
          trackColor={{ false: AppColors.lightGray, true: AppColors.primary }}
          thumbColor={Platform.OS === 'android' ? AppColors.cardBackground : (formData.is_staff ? AppColors.primary : AppColors.cardBackground)}
        />
      </View>

      {/* Switch for is_superuser */}
      <View style={styles.switchContainer}>
        <Text style={styles.label}>Superusuario</Text>
        <Switch
          onValueChange={(val) => handleChange('is_superuser', val)}
          value={formData.is_superuser}
          trackColor={{ false: AppColors.lightGray, true: AppColors.primary }}
          thumbColor={Platform.OS === 'android' ? AppColors.cardBackground : (formData.is_superuser ? AppColors.primary : AppColors.cardBackground)}
        />
      </View>

      <AppButton
        title={isEditing ? 'Guardar Cambios' : 'Crear Usuario'}
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
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: AppColors.cardBackground,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: AppColors.lightGray,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
});