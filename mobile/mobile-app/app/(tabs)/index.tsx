import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator, Dimensions } from 'react-native';
import { Card } from '../../components/Card';
import api from '../../../api/axios';
import { FontAwesome } from '@expo/vector-icons';
import { BarChart, PieChart } from "react-native-chart-kit"; // Import chart components

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#FF8042', '#00C49F', '#0088FE']; // Vibrant colors

const screenWidth = Dimensions.get("window").width;

const chartConfig = {
    backgroundColor: '#ffffff',
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    decimalPlaces: 0, // optional, defaults to 2dp
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
        borderRadius: 16
    },
    propsForDots: {
        r: "6",
        strokeWidth: "2",
        stroke: "#ffa726"
    }
};

const DashboardScreen = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await api.get('/dashboard/stats/');
                setStats(response.data);
            } catch (err) {
                setError('Failed to fetch dashboard stats.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) {
        return (
            <View className="flex-1 justify-center items-center">
                <ActivityIndicator size="large" />
            </View>
        );
    }

    if (error) {
        return (
            <View className="flex-1 justify-center items-center">
                <Text className="text-red-500 text-lg">{error}</Text>
            </View>
        );
    }

    const statCards = [
        { title: "Total Computadoras", value: stats.computers.total, icon: "laptop", color: "#3B82F6" }, // blue-500
        { title: "Total Equipos de Red", value: stats.network_devices.total, icon: "server", color: "#22C55E" }, // green-500
        { title: "Total Tickets", value: stats.tickets.total, icon: "ticket", color: "#EAB308" }, // yellow-500
        { title: "Total Usuarios", value: stats.users, icon: "users", color: "#A855F7" }, // purple-500
    ];

    // Data for Computers by Status Bar Chart
    const computersByStatusData = {
        labels: stats.computers.by_status.map(item => item.status),
        datasets: [{
            data: stats.computers.by_status.map(item => item.count)
        }]
    };

    // Data for Network Devices by Type Pie Chart
    const networkDevicesByTypeData = stats.network_devices.by_type.map((item, index) => ({
        name: item.device_type,
        population: item.count,
        color: COLORS[index % COLORS.length],
        legendFontColor: "#7F7F7F",
        legendFontSize: 15
    }));

    // Data for Tickets by Status Bar Chart
    const ticketsByStatusData = {
        labels: stats.tickets.by_status.map(item => item.status),
        datasets: [{
            data: stats.tickets.by_status.map(item => item.count)
        }]
    };


    return (
        <ScrollView className="flex-1 bg-gray-100 p-4">
            <Text className="text-3xl font-bold text-gray-800 mb-6">Dashboard</Text>

            {/* Stat Cards */}
            <View className="flex-row flex-wrap justify-between mb-6">
                {statCards.map((card, index) => (
                    <Card key={index} style={{ width: screenWidth / 2 - 24, marginBottom: 16, padding: 16, backgroundColor: '#fff', borderRadius: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 3, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <View>
                            <Text className="text-sm text-gray-500">{card.title}</Text>
                            <Text className="text-2xl font-bold text-gray-900 mt-1">{card.value}</Text>
                        </View>
                        <FontAwesome name={card.icon} size={32} color={card.color} />
                    </Card>
                ))}
            </View>

            {/* Computers by Status Bar Chart */}
            <View className="bg-white p-4 rounded-lg shadow-md mb-4">
                <Text className="text-lg font-semibold text-gray-800 mb-2">Computadoras por Estado</Text>
                {stats.computers.by_status.length > 0 ? (
                    <BarChart
                        data={computersByStatusData}
                        width={screenWidth - 48} // Adjusted width for padding
                        height={220}
                        yAxisLabel=""
                        chartConfig={chartConfig}
                        verticalLabelRotation={30}
                    />
                ) : (
                    <Text className="text-center text-gray-500 py-4">No hay datos de computadoras por estado.</Text>
                )}
            </View>

            {/* Network Devices by Type Pie Chart */}
            <View className="bg-white p-4 rounded-lg shadow-md mb-4">
                <Text className="text-lg font-semibold text-gray-800 mb-2">Equipos de Red por Tipo</Text>
                {stats.network_devices.by_type.length > 0 ? (
                    <PieChart
                        data={networkDevicesByTypeData}
                        width={screenWidth - 48} // Adjusted width for padding
                        height={220}
                        chartConfig={chartConfig}
                        accessor="population"
                        backgroundColor="transparent"
                        paddingLeft="15"
                        absolute
                    />
                ) : (
                    <Text className="text-center text-gray-500 py-4">No hay datos de equipos de red por tipo.</Text>
                )}
            </View>

            {/* Tickets by Status Bar Chart */}
            <View className="bg-white p-4 rounded-lg shadow-md mb-4">
                <Text className="text-lg font-semibold text-gray-800 mb-2">Tickets por Estado</Text>
                {stats.tickets.by_status.length > 0 ? (
                    <BarChart
                        data={ticketsByStatusData}
                        width={screenWidth - 48} // Adjusted width for padding
                        height={220}
                        yAxisLabel=""
                        chartConfig={chartConfig}
                        verticalLabelRotation={30}
                    />
                ) : (
                    <Text className="text-center text-gray-500 py-4">No hay datos de tickets por estado.</Text>
                )}
            </View>

        </ScrollView>
    );
};

export default DashboardScreen;