import React, { useState, useContext } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, Alert, ActivityIndicator, Pressable, Platform } from 'react-native';
import { Stack, router } from 'expo-router';
import api from '../../api/axios';
import { useAuth } from '../../auth/AuthContext';

import { AppColors } from '../../constants/Colors';

import AppButton from '../../components/ui/Button'; // Import AppButton

// ... (rest of the code)

export default function ChangePasswordScreen() {
  const { user } = useAuth();
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChangePassword = async () => {
    if (!oldPassword || !newPassword || !confirmNewPassword) {
      Alert.alert('Campos Incompletos', 'Por favor, llena todos los campos.');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      Alert.alert('Error', 'La nueva contraseña y su confirmación no coinciden.');
      return;
    }
    if (newPassword.length < 8) {
      Alert.alert('Contraseña Débil', 'La nueva contraseña debe tener al menos 8 caracteres.');
      return;
    }

    setLoading(true);
    try {
      await api.post(`/users/${user.id}/set_password/`, {
        old_password: oldPassword,
        new_password: newPassword,
      });
      Alert.alert("Éxito", "Contraseña cambiada correctamente.");
      router.back();
    } catch (err) {
      console.error("Error changing password:", err.response?.data || err.message);
      const errorMsg = err.response?.data?.old_password ? err.response.data.old_password[0] : (err.response?.data?.new_password ? err.response.data.new_password[0] : 'No se pudo cambiar la contraseña. Verifica la antigua.');
      Alert.alert("Error", errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Stack.Screen options={{ title: 'Cambiar Contraseña' }} />
      
      <Text style={styles.label}>Contraseña Antigua</Text>
      <TextInput
        style={styles.input}
        value={oldPassword}
        onChangeText={setOldPassword}
        placeholder="Tu contraseña actual"
        placeholderTextColor={AppColors.subtleText}
        secureTextEntry
      />

      <Text style={styles.label}>Nueva Contraseña</Text>
      <TextInput
        style={styles.input}
        value={newPassword}
        onChangeText={setNewPassword}
        placeholder="Al menos 8 caracteres"
        placeholderTextColor={AppColors.subtleText}
        secureTextEntry
      />
      
      <Text style={styles.label}>Confirmar Nueva Contraseña</Text>
      <TextInput
        style={styles.input}
        value={confirmNewPassword}
        onChangeText={setConfirmNewPassword}
        placeholder="Repite la nueva contraseña"
        placeholderTextColor={AppColors.subtleText}
        secureTextEntry
      />

      <AppButton
        title="Guardar Contraseña"
        onPress={handleChangePassword}
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
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: AppColors.background,
    padding: 24,
  },
});
