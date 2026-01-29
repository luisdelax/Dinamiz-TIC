import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, RefreshControl, Platform, Pressable, Alert } from 'react-native';
import api from '../../api/axios';
import { Link, router } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { usePermission } from '../../hooks/usePermission';

import { AppColors } from '../../constants/Colors';

import SegmentedControl from '../../components/ui/SegmentedControl';

// ... (rest of the imports)

// Componente reutilizable para mostrar listas de organización
const OrganizationList = ({ endpoint, renderItem, itemKeyExtractor }) => {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    try {
      setError(null);
      const response = await api.get(endpoint);
      setItems(response.data);
    } catch (err) {
      console.error(`Error fetching from ${endpoint}:`, err);
      setError('No se pudieron cargar los elementos. Desliza para reintentar.');
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [endpoint]); // Refetch cuando el endpoint cambie

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchData();
  }, [endpoint]);

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

  return (
    <FlatList
      data={items}
      renderItem={renderItem}
      keyExtractor={itemKeyExtractor}
      contentContainerStyle={styles.listContentContainer}
      ListEmptyComponent={
        <View style={styles.centerContainer}>
          <Text style={{ color: AppColors.subtleText }}>No hay elementos disponibles.</Text>
        </View>
      }
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={AppColors.primary} />
      }
    />
  );
};

// Componente para renderizar cada item de Site
const SiteItem = ({ item }) => (
  <Link href={`/organization/site/${item.id}`} asChild>
    <Pressable>
      {({ pressed }) => (
        <View style={[styles.itemCard, pressed && { backgroundColor: AppColors.lightGray }]}>
          <Text style={styles.itemCardTitle}>{item.name}</Text>
          <Text style={styles.itemCardSubtitle}>{item.address}</Text>
        </View>
      )}
    </Pressable>
  </Link>
);

// Componente para renderizar cada item de Classroom
const ClassroomItem = ({ item }) => (
  <Link href={`/organization/classroom/${item.id}`} asChild>
    <Pressable>
      {({ pressed }) => (
        <View style={[styles.itemCard, pressed && { backgroundColor: AppColors.lightGray }]}>
          <Text style={styles.itemCardTitle}>{item.name}</Text>
          <Text style={styles.itemCardSubtitle}>Sede: {item.site_name || 'N/A'}</Text>
        </View>
      )}
    </Pressable>
  </Link>
);

// Componente para renderizar cada item de Person
const PersonItem = ({ item }) => (
  <Link href={`/organization/person/${item.id}`} asChild>
    <Pressable>
      {({ pressed }) => (
        <View style={[styles.itemCard, pressed && { backgroundColor: AppColors.lightGray }]}>
          <Text style={styles.itemCardTitle}>{item.first_name} {item.last_name}</Text>
          <Text style={styles.itemCardSubtitle}>{item.email || item.phone_number || 'N/A'}</Text>
        </View>
      )}
    </Pressable>
  </Link>
);


export default function OrganizationScreen() {
  const [selectedType, setSelectedType] = useState('sites'); // 'sites', 'classrooms', 'persons'
  const { hasPermission } = usePermission();
  const canManageOrganization = hasPermission(['admin', 'technician']); // Assuming these roles can manage organization

  const getEndpoint = () => {
    switch (selectedType) {
      case 'sites': return '/organization/sites/';
      case 'classrooms': return '/organization/classrooms/';
      case 'persons': return '/organization/persons/';
      default: return '/organization/sites/';
    }
  };

  const getItemKeyExtractor = (item) => item.id.toString();

  const getRenderItem = () => {
    switch (selectedType) {
      case 'sites': return ({ item }) => <SiteItem item={item} />;
      case 'classrooms': return ({ item }) => <ClassroomItem item={item} />;
      case 'persons': return ({ item }) => <PersonItem item={item} />;
      default: return ({ item }) => <SiteItem item={item} />;
    }
  };

  const handleAdd = () => {
    switch (selectedType) {
      case 'sites': router.push('/organization/site/form'); break;
      case 'classrooms': router.push('/organization/classroom/form'); break;
      case 'persons': router.push('/organization/person/form'); break;
      default: Alert.alert("Error", "Tipo de elemento no soportado para añadir.");
    }
  };

  const ORGANIZATION_OPTIONS = {
    sites: 'Sedes',
    classrooms: 'Aulas',
    persons: 'Personas',
  };


  return (
    <View style={styles.container}>


      <SegmentedControl
        options={Object.keys(ORGANIZATION_OPTIONS)}
        selectedOption={selectedType}
        onSelectOption={setSelectedType}
        renderOption={(option) => ORGANIZATION_OPTIONS[option]}
      />

      <OrganizationList
        endpoint={getEndpoint()}
        renderItem={getRenderItem()}
        itemKeyExtractor={getItemKeyExtractor}
      />

      {/* Botón de Acción Flotante (FAB) */}
      {canManageOrganization && (
        <Pressable style={styles.fab} onPress={handleAdd}>
            <FontAwesome name="plus" size={24} color={AppColors.cardBackground} /> {/* Changed color to cardBackground for contrast */}
          </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.background,
  },
  header: {
    fontSize: 32,
    fontWeight: 'bold',
    color: AppColors.primaryDark,
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  listContentContainer: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  errorText: {
    color: AppColors.error,
    fontSize: 16,
    textAlign: 'center',
  },
  segmentedControlContainer: {
    flexDirection: 'row',
    backgroundColor: AppColors.segmentedControlBackground,
    borderRadius: 12,
    marginHorizontal: 24,
    marginBottom: 24,
    overflow: 'hidden',
  },
  segmentButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentButtonActive: {
    backgroundColor: AppColors.segmentedControlActive,
    borderRadius: 10,
    margin: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  segmentButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: AppColors.segmentedControlText,
  },
  segmentButtonTextActive: {
    color: AppColors.segmentedControlTextActive,
    fontWeight: 'bold',
  },
  itemCard: {
    backgroundColor: AppColors.cardBackground,
    padding: 20,
    marginBottom: 12,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  itemCardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: AppColors.text,
    marginBottom: 4,
  },
  itemCardSubtitle: {
    fontSize: 14,
    color: AppColors.subtleText,
  },
  fab: {
    position: 'absolute',
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    right: 24,
    bottom: 24,
    backgroundColor: AppColors.primary,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
});
