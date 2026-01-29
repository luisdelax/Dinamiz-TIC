import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { Colors } from '../../../constants/Colors';

const InventoryHomeScreen = () => {
  const navigateTo = (path: string) => {
    router.push(path);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Gestión de Inventario</Text>

      <View style={styles.cardContainer}>
        <TouchableOpacity style={styles.card} onPress={() => navigateTo('/inventory/computer/')}>
          <FontAwesome name="laptop" size={40} color={Colors.light.tint} />
          <Text style={styles.cardTitle}>Computadoras</Text>
          <Text style={styles.cardDescription}>Administrar laptops, desktops y workstations.</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card} onPress={() => navigateTo('/inventory/network-device/')}>
          <FontAwesome name="server" size={40} color={Colors.light.tint} />
          <Text style={styles.cardTitle}>Equipos de Red</Text>
          <Text style={styles.cardDescription}>Gestionar routers, switches, access points, etc.</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card} onPress={() => navigateTo('/inventory/peripheral/')}>
          <FontAwesome name="print" size={40} color={Colors.light.tint} /> {/* Using print as a generic peripheral icon */}
          <Text style={styles.cardTitle}>Periféricos</Text>
          <Text style={styles.cardDescription}>Controlar monitores, teclados, ratones, impresoras.</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: Colors.light.background,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.light.text,
    marginBottom: 24,
    textAlign: 'center',
  },
  cardContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: '48%', // Approx half width, accounting for spacing
    backgroundColor: Colors.light.cardBackground,
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.light.text,
    marginTop: 12,
    textAlign: 'center',
  },
  cardDescription: {
    fontSize: 13,
    color: Colors.light.lightGray,
    textAlign: 'center',
    marginTop: 4,
  },
});

export default InventoryHomeScreen;
