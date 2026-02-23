import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Platform, Alert, ActivityIndicator } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import { FontAwesome } from '@expo/vector-icons';

import { AppColors } from '../../constants/Colors';

// Definir los reportes disponibles
const REPORTS = [
  { id: '1', title: 'Inventario (Excel)', description: 'Exportar inventario de activos a Excel.', icon: 'file-excel-o', endpoint: '/reports/inventory/excel/' },
  { id: '2', title: 'Inventario (PDF)', description: 'Generar reporte PDF de inventario de ordenadores.', icon: 'file-pdf-o', endpoint: '/reports/inventory/pdf/' },
  { id: '3', title: 'Tickets (Excel)', description: 'Exportar lista de tickets a Excel.', icon: 'file-excel-o', endpoint: '/reports/tickets/excel/' },
  { id: '4', title: 'Tickets (PDF)', description: 'Generar reporte PDF de tickets.', icon: 'file-pdf-o', endpoint: '/reports/tickets/pdf/' },
  { id: '5', title: 'Inventario (PowerBI)', description: 'Ver dashboard de inventario en PowerBI.', icon: 'bar-chart', endpoint: '/reports/inventory/powerbi/' },
  { id: '6', title: 'Tickets (PowerBI)', description: 'Ver dashboard de tickets en PowerBI.', icon: 'bar-chart', endpoint: '/reports/tickets/powerbi/' },
];

export default function ReportsScreen() {
  const [loadingReportId, setLoadingReportId] = useState(null);

  const handleOpenReport = async (report) => {
    // Obtener la BASE_URL de axios.js. No podemos importarla directamente aquí si está en const api
    // Una opción sería tener una constante en un archivo compartido o un mecanismo global.
    // Por ahora, asumiremos una estructura de URL, pero esto es un punto a revisar.
    const API_BASE_URL = 'http://YOUR_COMPUTER_IP:8000'; // <<--- AJUSTAR ESTO A TU IP DE SERVIDOR DJANGO
    // La URL debe ser directa al reporte, no a través de la instancia de axios
    const fullUrl = `${API_BASE_URL}${report.endpoint}`;

    setLoadingReportId(report.id);
    try {
      await WebBrowser.openBrowserAsync(fullUrl);
    } catch (error) {
      console.error("Error al abrir el reporte:", error);
      Alert.alert("Error", "No se pudo abrir el reporte. Asegúrate de que tu servidor Django esté corriendo y la URL sea correcta.");
    } finally {
      setLoadingReportId(null);
    }
  };

  return (
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>

      {REPORTS.map(report => (
        <Pressable
          key={report.id}
          style={({ pressed }) => [styles.reportCard, pressed && styles.reportCardPressed]}
          onPress={() => handleOpenReport(report)}
          disabled={loadingReportId === report.id}
        >
          {loadingReportId === report.id ? (
            <ActivityIndicator size="small" color={AppColors.primary} />
          ) : (
            <>
              <FontAwesome name={report.icon} size={24} color={AppColors.primary} style={styles.reportIcon} />
              <View style={styles.reportTextContainer}>
                <Text style={styles.reportTitle}>{report.title}</Text>
                <Text style={styles.reportDescription}>{report.description}</Text>
              </View>
              <FontAwesome name="chevron-right" size={16} color={AppColors.subtleText} />
            </>
          )}
        </Pressable>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.background,
  },
  contentContainer: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  header: {
    fontSize: 32,
    fontWeight: 'bold',
    color: AppColors.primaryDark,
    marginBottom: 24,
    marginTop: 16,
  },
  reportCard: {
    backgroundColor: AppColors.cardBackground,
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  reportCardPressed: {
    opacity: 0.8,
  },
  reportIcon: {
    marginRight: 16,
    color: AppColors.primary,
  },
  reportTextContainer: {
    flex: 1,
  },
  reportTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: AppColors.text,
    marginBottom: 4,
  },
  reportDescription: {
    fontSize: 14,
    color: AppColors.subtleText,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: AppColors.background,
    padding: 24,
  },
  errorText: {
    color: AppColors.error,
    fontSize: 16,
    textAlign: 'center',
  },
});
