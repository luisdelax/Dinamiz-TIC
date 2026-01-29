import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, ActivityIndicator, Pressable, TextInput } from 'react-native';
import { Stack, router } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import api from '../../api/axios';
import ComputerList from '../../components/inventory/ComputerList';
import NetworkDeviceList from '../../components/inventory/NetworkDeviceList';
import PeripheralList from '../../components/inventory/PeripheralList';
import { usePermission } from '../../hooks/usePermission';
import { Ionicons } from '@expo/vector-icons';
import { AppColors } from '../../constants/Colors';
import SegmentedControl from '../../components/ui/SegmentedControl';

const fetchInventory = async (key) => {
  const { data } = await api.get(`/assets/${key}/`);
  return data;
};

const INVENTORY_CATEGORIES = {
  computers: 'Ordenadores',
  'network-devices': 'Red',
  peripherals: 'Periféricos',
};

export default function InventoryScreen() {
  const [selectedCategory, setSelectedCategory] = useState('computers');
  const [searchTerm, setSearchTerm] = useState('');
  const { hasPermission, hasAnyRole } = usePermission();

  const { data: computers, isLoading: isLoadingComputers, refetch: refetchComputers } = useQuery({
    queryKey: ['computers'],
    queryFn: () => fetchInventory('computers'),
    enabled: selectedCategory === 'computers',
  });

  const { data: networkDevices, isLoading: isLoadingNetworkDevices, refetch: refetchNetworkDevices } = useQuery({
    queryKey: ['network-devices'],
    queryFn: () => fetchInventory('network-devices'),
    enabled: selectedCategory === 'network-devices',
  });

  const { data: peripherals, isLoading: isLoadingPeripherals, refetch: refetchPeripherals } = useQuery({
    queryKey: ['peripherals'],
    queryFn: () => fetchInventory('peripherals'),
    enabled: selectedCategory === 'peripherals',
  });

  const filterData = (data, term) => {
    if (!data) return [];
    const lowerCaseTerm = term.toLowerCase();
    return data.filter(item =>
      (item.asset_tag && item.asset_tag.toLowerCase().includes(lowerCaseTerm)) ||
      (item.brand && item.brand.toLowerCase().includes(lowerCaseTerm)) ||
      (item.model && item.model.toLowerCase().includes(lowerCaseTerm)) ||
      (item.serial_number && item.serial_number.toLowerCase().includes(lowerCaseTerm)) ||
      (item.ip_address && item.ip_address.toLowerCase().includes(lowerCaseTerm)) ||
      (item.mac_address && item.mac_address.toLowerCase().includes(lowerCaseTerm))
    );
  };

  const filteredComputers = filterData(computers, searchTerm);
  const filteredNetworkDevices = filterData(networkDevices, searchTerm);
  const filteredPeripherals = filterData(peripherals, searchTerm);

  const onRefresh = () => {
    if (selectedCategory === 'computers') refetchComputers();
    if (selectedCategory === 'network-devices') refetchNetworkDevices();
    if (selectedCategory === 'peripherals') refetchPeripherals();
  };

  const renderList = () => {
    switch (selectedCategory) {
      case 'computers':
        if (isLoadingComputers) return <ActivityIndicator size="large" color={AppColors.primary} style={styles.loader} />;
        return <ComputerList computers={filteredComputers} />;
      case 'network-devices':
        if (isLoadingNetworkDevices) return <ActivityIndicator size="large" color={AppColors.primary} style={styles.loader} />;
        return <NetworkDeviceList networkDevices={filteredNetworkDevices} />;
      case 'peripherals':
        if (isLoadingPeripherals) return <ActivityIndicator size="large" color={AppColors.primary} style={styles.loader} />;
        return <PeripheralList peripherals={filteredPeripherals} />;
      default:
        return null;
    }
  };

  const handleFabPress = () => {
    if (selectedCategory === 'computers') router.push('/inventory/computer/form');
    if (selectedCategory === 'network-devices') router.push('/inventory/network-device/form');
    if (selectedCategory === 'peripherals') router.push('/inventory/peripheral/form');
  };

  const canAddInventory = hasAnyRole(['admin', 'technician']);

  return (
    <View style={styles.fullContainer}>
      <Stack.Screen options={{ title: 'Inventario' }} />

      <SegmentedControl
        options={Object.keys(INVENTORY_CATEGORIES)}
        selectedOption={selectedCategory}
        onSelectOption={setSelectedCategory}
        renderOption={(option) => INVENTORY_CATEGORIES[option]}
      />

      <TextInput
        style={styles.searchInput}
        placeholder="Buscar por tag, marca, modelo, serial, IP, MAC..."
        placeholderTextColor={AppColors.subtleText}
        value={searchTerm}
        onChangeText={setSearchTerm}
      />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        refreshControl={<RefreshControl refreshing={false} onRefresh={onRefresh} colors={[AppColors.primary]} />}
      >
        {renderList()}
      </ScrollView>

      {canAddInventory && (
        <Pressable
          style={({ pressed }) => [styles.fab, pressed && styles.fabPressed]}
          onPress={handleFabPress}
        >
          <Ionicons name="add" size={30} color={AppColors.cardBackground} />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  fullContainer: {
    flex: 1,
    backgroundColor: AppColors.background,
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 24,
    paddingBottom: 96,
  },
  loader: {
    marginTop: 48,
  },
  searchInput: {
    height: 52,
    borderColor: AppColors.lightGray,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    marginHorizontal: 24,
    marginBottom: 16,
    backgroundColor: AppColors.cardBackground,
    color: AppColors.text,
    fontSize: 16,
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
  fabPressed: {
    opacity: 0.8,
  },
});
