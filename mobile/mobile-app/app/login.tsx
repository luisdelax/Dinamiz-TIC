import React, { useState, useContext } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, ActivityIndicator, Pressable, KeyboardAvoidingView, Platform, Dimensions } from 'react-native';
import { AuthContext } from '../auth/AuthContext';

const { height } = Dimensions.get('window');

import { AppColors } from '../constants/Colors';

import AppButton from '../components/ui/Button';

// ... (rest of the code)

export default function LoginScreen() {
  const { login } = useContext(AuthContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert('Campos incompletos', 'Por favor, ingresa tu usuario y contraseña.');
      return;
    }
    setIsLoggingIn(true);
    const result = await login(username, password);
    setIsLoggingIn(false);

    if (!result.success) {
      Alert.alert('Error de Login', result.error || 'No se pudo iniciar sesión. Verifica tus credenciales.');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.topSection}>
        <Text style={styles.welcomeTitle}>Bienvenido</Text>
        <Text style={styles.welcomeSubtitle}>Tu sistema de gestión de IT</Text>
      </View>
      <View style={styles.contentArea}>
        <Text style={styles.signInTitle}>Iniciar Sesión</Text>
        <Text style={styles.signInSubtitle}>Accede a tu cuenta</Text>
        
        <TextInput
          style={styles.input}
          placeholder="Nombre de usuario"
          placeholderTextColor={AppColors.subtleText}
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Contraseña"
          placeholderTextColor={AppColors.subtleText}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <AppButton
          title="Entrar"
          onPress={handleLogin}
          disabled={isLoggingIn}
          variant="primary"
          style={styles.button} // Keep the button styles defined locally for specific login screen layout
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.background,
  },
  topSection: {
    height: height * 0.4,
    backgroundColor: AppColors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: Platform.OS === 'android' ? 50 : 0,
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
  },
  welcomeTitle: {
    fontSize: 40,
    fontWeight: 'bold',
    color: AppColors.cardBackground,
    marginBottom: 8,
    textAlign: 'center',
  },
  welcomeSubtitle: {
    fontSize: 18,
    color: AppColors.cardBackground,
    textAlign: 'center',
    paddingHorizontal: 30,
  },
  contentArea: {
    flex: 1,
    backgroundColor: AppColors.cardBackground,
    marginTop: -40,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    paddingHorizontal: 24,
    paddingTop: 60,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 5,
  },
  signInTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: AppColors.text,
    marginBottom: 10,
  },
  signInSubtitle: {
    fontSize: 16,
    color: AppColors.subtleText,
    marginBottom: 40,
    textAlign: 'center',
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
    width: '100%',
  },
  button: {
    width: '100%',
    marginTop: 24,
  },
});