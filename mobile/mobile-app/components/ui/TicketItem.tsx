import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Link } from 'expo-router';
import { AppColors } from '../../constants/Colors';

const TicketItem = ({ item }) => (
  <Link href={`/ticket/${item.id}`} asChild>
    <Pressable>
      {({ pressed }) => (
        <View style={[styles.itemCard, pressed && { backgroundColor: AppColors.lightGray }]}>
          <View>
            <Text style={styles.itemTitle}>{item.title}</Text>
            <Text style={styles.itemDate}>Creado: {new Date(item.created_at).toLocaleDateString()}</Text>
          </View>
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>{item.status}</Text>
          </View>
        </View>
      )}
    </Pressable>
  </Link>
);

const styles = StyleSheet.create({
  itemCard: {
    backgroundColor: AppColors.cardBackground,
    padding: 20,
    marginBottom: 16,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  itemTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: AppColors.text,
  },
  itemDate: {
    fontSize: 13,
    color: AppColors.subtleText,
    marginTop: 4,
  },
  statusBadge: {
    backgroundColor: AppColors.lightGray,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: AppColors.subtleText,
  },
});

export default TicketItem;
