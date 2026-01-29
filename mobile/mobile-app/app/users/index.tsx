import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, ScrollView, ActivityIndicator, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { router } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import api from '../../../api/axios'; // Corrected path
import { Colors } from '../../../constants/Colors';

const UserListScreen = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get(`/users/`);
      setUsers(response.data);
    } catch (err) {
      setError('Failed to fetch users.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleAddUser = () => {
    router.push('/users/form');
  };

  const handleEditUser = (id) => {
    router.push(`/users/${id}`);
  };

  const handleDeleteUser = async (id) => {
    Alert.alert(
      "Confirmar Eliminación",
      "¿Estás seguro de que quieres eliminar este usuario?",
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        {
          text: "Eliminar",
          onPress: async () => {
            try {
              await api.delete(`/users/${id}/`);
              fetchUsers();
            } catch (err) {
              setError("Failed to delete user.");
              console.error(err);
            }
          }
        }
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.light.tint} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Gestión de Usuarios</Text>
        <TouchableOpacity style={styles.addButton} onPress={handleAddUser}>
          <FontAwesome name="plus" size={20} color="#fff" />
          <Text style={styles.addButtonText}>Agregar</Text>
        </TouchableOpacity>
      </View>

      {error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : users.length === 0 ? (
        <Text style={styles.noDataText}>No se encontraron usuarios.</Text>
      ) : (
        <ScrollView style={styles.listContainer}>
          {users.map((user) => (
            <TouchableOpacity key={user.id} style={styles.userItem} onPress={() => handleEditUser(user.id)}>
              <View style={styles.itemDetails}>
                <Text style={styles.itemTitle}>{user.username}</Text>
                <Text style={styles.itemSubtitle}>{user.email}</Text>
                <Text style={styles.itemRole}>Rol: {user.role}</Text>
                <Text style={[styles.itemStatus, user.is_active ? styles.statusActive : styles.statusInactive]}>
                  {user.is_active ? 'Activo' : 'Inactivo'}
                </Text>
              </View>
              <View style={styles.itemActions}>
                <TouchableOpacity onPress={() => handleEditUser(user.id)} style={styles.actionButton}>
                  <FontAwesome name="pencil" size={20} color={Colors.light.tint} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDeleteUser(user.id)} style={styles.actionButton}>
                  <FontAwesome name="trash" size={20} color="red" />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: Colors.light.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.light.text,
  },
  addButton: {
    flexDirection: 'row',
    backgroundColor: Colors.light.tint,
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    marginLeft: 8,
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
  noDataText: {
    textAlign: 'center',
    marginTop: 20,
    color: Colors.light.text,
  },
  listContainer: {
    flex: 1,
  },
  userItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.light.cardBackground,
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  itemDetails: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.light.text,
  },
  itemSubtitle: {
    fontSize: 14,
    color: Colors.light.lightGray,
    marginTop: 4,
  },
  itemRole: {
    fontSize: 14,
    color: Colors.light.text,
    marginTop: 4,
  },
  itemStatus: {
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 8,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 5,
    alignSelf: 'flex-start',
  },
  statusActive: {
    backgroundColor: '#D1FAE5', // green-100
    color: '#065F46', // green-900
  },
  statusInactive: {
    backgroundColor: '#FEE2E2', // red-100
    color: '#991B1B', // red-900
  },
  itemActions: {
    flexDirection: 'row',
  },
  actionButton: {
    marginLeft: 15,
  },
});

export default UserListScreen;
