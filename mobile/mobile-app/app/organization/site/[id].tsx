import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, Pressable, Alert } from 'react-native';
import { useLocalSearchParams, Stack, router } from 'expo-router';
import api from '../../../api/axios';
import { usePermission } from '../../../hooks/usePermission';

import { AppColors } from '../../../constants/Colors';

const DetailField = ({ label, value }) => (
  <View style={styles.detailField}>
    <Text style={styles.detailLabel}>{label}:</Text>
    <Text style={styles.detailValue}>{value || 'N/A'}</Text>
  </View>
);

export default function SiteDetailScreen() {
  const { id } = useLocalSearchParams();
  const [site, setSite] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { hasPermission } = usePermission();

  const canManageOrganization = hasPermission(['admin', 'technician']);


  const fetchSiteDetail = async () => {
    try {
      setIsLoading(true);
      const response = await api.get(`/organization/sites/${id}/`);
      setSite(response.data);
    } catch (err) {
      console.error(`Error fetching site ${id}:`, err);
      setError('No se pudo cargar el detalle de la sede.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchSiteDetail();
    }
  }, [id]);

  const handleEdit = () => {
    router.push(`/organization/site/form?id=${id}`);
  };

  const handleDelete = () => {
    Alert.alert(
      "Eliminar Sede",
      "¿Estás seguro de que quieres eliminar esta sede? Esto eliminará también las aulas, personas y activos asociados.",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Eliminar",
          onPress: async () => {
            try {
              await api.delete(`/organization/sites/${id}/`);
              Alert.alert("Éxito", "Sede eliminada correctamente.");
              router.back();
            } catch (err) {
              console.error("Error deleting site:", err.response?.data || err.message);
              Alert.alert("Error", "No se pudo eliminar la sede.");
            }
          },
          style: "destructive",
        },
      ]
    );
  };

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={AppColors.primary} />
        <Text style={{ marginTop: 10, color: AppColors.subtleText }}>Cargando...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (!site) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.text}>Sede no encontrada.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
import AppButton from '../../../components/ui/Button'; // Import AppButton

// ... (rest of the code)

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Stack.Screen options={{ title: `Sede: ${site.name}` }} />
      
      <View style={styles.card}>
        <Text style={styles.title}>{site.name}</Text>
        <DetailField label="Dirección" value={site.address} />
        
        <View style={styles.separator} />

        <DetailField label="Teléfono" value={site.phone_number} />
        <DetailField label="Email" value={site.email} />
        
        {site.notes && (
          <>
            <View style={styles.separator} />
            <Text style={styles.sectionTitle}>Notas:</Text>
            <Text style={styles.description}>{site.notes}</Text>
          </>
        )}
      </View>

      {canManageOrganization && (
        <View style={styles.buttonContainer}>
          <AppButton title="Editar" onPress={handleEdit} variant="primary" style={styles.singleButton} />
          <AppButton title="Eliminar" onPress={handleDelete} variant="danger" style={styles.singleButton} />
        </View>
      )}
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
  card: {
    backgroundColor: AppColors.cardBackground,
    borderRadius: 12,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    marginBottom: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: AppColors.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  detailField: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: AppColors.lightGray,
  },
  detailLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: AppColors.text,
    flex: 1,
  },
  detailValue: {
    fontSize: 16,
    color: AppColors.subtleText,
    flex: 2,
    textAlign: 'right',
  },
  separator: {
    height: 1,
    backgroundColor: AppColors.lightGray,
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: AppColors.text,
    marginBottom: 12,
    marginTop: 8,
  },
  description: {
    fontSize: 16,
    color: AppColors.text,
    lineHeight: 24,
    marginBottom: 10,
  },
  errorText: {
    color: AppColors.error,
    fontSize: 16,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
    paddingHorizontal: 0,
  },
  singleButton: {
    flex: 1,
    marginHorizontal: 8,
  },
});