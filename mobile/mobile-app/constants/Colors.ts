// mobile/mobile-app/constants/Colors.ts

// Paleta de colores consistente basada en el UI kit de referencia
const tintColorLight = '#2E7D32'; // Verde principal más oscuro y moderno
const tintColorDark = '#1B5E20'; // Verde más oscuro para acentos
const accentColor = '#FFC107'; // Mantenemos el acento amarillo
const errorColor = '#D32F2F'; // Rojo para errores

export const Colors = {
  light: {
    text: '#212121', // Texto casi negro para mejor contraste
    background: '#F7F9F7', // Fondo gris muy suave con un toque de verde
    tint: tintColorLight,
    icon: '#424242',
    tabIconDefault: '#616161', // Gris para íconos inactivos
    tabIconSelected: tintColorLight,
    cardBackground: '#FFFFFF',
    subtleText: '#757575',
    lightGray: '#E0E0E0',
    error: errorColor,
    accent: accentColor,
    segmentedControlBackground: '#E0E0E0',
    segmentedControlActive: tintColorLight, // Verde para el segmento activo
    segmentedControlText: '#212121', // Texto oscuro para segmentos
    segmentedControlTextActive: '#FFFFFF', // Texto blanco para el segmento activo
  },
  dark: {
    text: '#F5F5F5',
    background: '#121212',
    tint: tintColorDark,
    icon: '#BDBDBD',
    tabIconDefault: '#757575',
    tabIconSelected: tintColorDark,
    cardBackground: '#1E1E1E',
    subtleText: '#BDBDBD',
    lightGray: '#424242',
    error: errorColor,
    accent: accentColor,
    segmentedControlBackground: '#424242',
    segmentedControlActive: tintColorDark,
    segmentedControlText: '#F5F5F5',
    segmentedControlTextActive: '#121212',
  },
};

// Exporta una paleta de colores simplificada para uso directo en componentes
export const AppColors = {
  primary: Colors.light.tint,
  primaryDark: tintColorDark,
  primaryLight: tintColorLight,
  background: Colors.light.background,
  cardBackground: Colors.light.cardBackground,
  text: Colors.light.text,
  subtleText: Colors.light.subtleText,
  lightGray: Colors.light.lightGray,
  error: Colors.light.error,
  accent: Colors.light.accent,
  segmentedControlBackground: Colors.light.segmentedControlBackground,
  segmentedControlActive: Colors.light.segmentedControlActive,
  segmentedControlText: Colors.light.segmentedControlText,
  segmentedControlTextActive: Colors.light.segmentedControlTextActive,
};

// Colores para los segmentos del Pie Chart
export const CHART_COLORS = [
  '#2E7D32', // primary
  '#66BB6A',
  '#AED581',
  '#9CCC65',
  '#DCE775',
  '#FFB74D',
  '#FF8A65',
  '#E57373',
];