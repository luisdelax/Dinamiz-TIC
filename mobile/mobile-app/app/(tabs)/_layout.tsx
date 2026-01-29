import React from 'react';
import { Tabs } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { usePermission, ROLES } from '../../hooks/usePermission'; // Importar el hook de permisos
import { Colors } from '../../constants/Colors'; // Import the new Colors constant

export default function TabLayout() {
  const { hasPermission, isRole } = usePermission();

  const isAdmin = isRole(ROLES.ADMIN);
  const canManageInventory = hasPermission('canManageInventory');
  const canManageUsers = hasPermission('canManageUsers');
  const canManageOrganization = hasPermission('canManageOrganization');

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.light.tint, // Usar el color principal del tema claro
        tabBarStyle: {
          backgroundColor: Colors.light.cardBackground, // Fondo de la barra de pestañas blanco
          borderTopWidth: 1,
          borderTopColor: Colors.light.lightGray, // Línea sutil en la parte superior
        },
        tabBarLabelStyle: {
          fontWeight: '500',
        },
        // Opcional: Estilo para el header de la tab. La App/_layout.tsx ya maneja el título global.
        headerStyle: {
          backgroundColor: Colors.light.background, // Fondo del header
        },
        headerTintColor: Colors.light.text, // Color del texto del header
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}>
      <Tabs.Screen
        name="index" // Dashboard ahora será la pestaña predeterminada (index)
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color }) => <FontAwesome size={22} name="bar-chart" color={color} />,
        }}
      />
      <Tabs.Screen
        name="tickets" // Tickets
        options={{
          title: 'Tickets',
          tabBarIcon: ({ color }) => <FontAwesome size={22} name="ticket" color={color} />,
        }}
      />
      {canManageInventory && ( // Inventario
        <Tabs.Screen
          name="inventory"
          options={{
            title: 'Inventario',
            tabBarIcon: ({ color }) => <FontAwesome size={22} name="laptop" color={color} />,
          }}
        />
      )}
      {canManageUsers && ( // Usuarios
        <Tabs.Screen
          name="users"
          options={{
            title: 'Usuarios',
            tabBarIcon: ({ color }) => <FontAwesome size={22} name="users" color={color} />,
          }}
        />
      )}
      {canManageOrganization && ( // Organización
        <Tabs.Screen
          name="organization"
          options={{
            title: 'Organización',
            tabBarIcon: ({ color }) => <FontAwesome size={22} name="building" color={color} />,
          }}
        />
      )}
      <Tabs.Screen
        name="reports" // Reports
        options={{
          title: 'Reportes',
          tabBarIcon: ({ color }) => <FontAwesome size={22} name="file-pdf-o" color={color} />,
        }}
      />
      <Tabs.Screen
        name="home" // Home (Perfil) al final de todo
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color }) => <FontAwesome size={22} name="user-circle" color={color} />,
        }}
      />
    </Tabs>
  );
}