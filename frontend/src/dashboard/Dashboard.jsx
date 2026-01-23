import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import api from '../api/axios';
import Spinner from '../components/Spinner';
import { ComputerDesktopIcon, ServerStackIcon, TicketIcon, UserGroupIcon } from '@heroicons/react/24/outline'; // Import icons for cards

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#FF8042', '#00C49F', '#0088FE']; // More vibrant colors

const Dashboard = () => {
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
        return <Spinner />;
    }

    if (error) {
        return <div className="text-red-500 text-center py-10">{error}</div>;
    }

    const statCards = [
        { title: "Total Computadoras", value: stats.computers.total, icon: ComputerDesktopIcon, color: "text-blue-500" },
        { title: "Total Equipos de Red", value: stats.network_devices.total, icon: ServerStackIcon, color: "text-green-500" },
        { title: "Total Tickets", value: stats.tickets.total, icon: TicketIcon, color: "text-yellow-500" },
        { title: "Total Usuarios", value: stats.users, icon: UserGroupIcon, color: "text-purple-500" },
    ];

    return (
        <div className="p-4 sm:p-4 md:p-6 bg-gray-100 min-h-full">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Panel de Control</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {statCards.map((card, index) => (
                    <div key={index} className="bg-white p-6 rounded-xl shadow-lg flex items-center justify-between transition-transform transform hover:scale-105 duration-300">
                        <div>
                            <h3 className="text-sm font-medium text-gray-500">{card.title}</h3>
                            <p className="text-3xl font-bold text-gray-900 mt-1">{card.value}</p>
                        </div>
                        <card.icon className={`h-12 w-12 ${card.color} opacity-60`} />
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl shadow-lg">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Computadoras por Estado</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={stats.computers.by_status}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="status" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="count" fill={COLORS[0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-lg">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Equipos de Red por Tipo</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie data={stats.network_devices.by_type} dataKey="count" nameKey="device_type" cx="50%" cy="50%" outerRadius={100} label>
                                {stats.network_devices.by_type.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                
                <div className="bg-white p-6 rounded-xl shadow-lg col-span-1 lg:col-span-2">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Tickets por Estado</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={stats.tickets.by_status}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="status" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="count" fill={COLORS[1]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;