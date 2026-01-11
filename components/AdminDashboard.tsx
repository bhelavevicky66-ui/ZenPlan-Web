import React, { useEffect, useState } from 'react';
import { UserData, UserRole } from '../types';
import { getAllUsers, updateUserRole } from '../services/firestore';

interface AdminDashboardProps {
    currentUser: UserData;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ currentUser }) => {
    const [users, setUsers] = useState<UserData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        try {
            const allUsers = await getAllUsers();
            setUsers(allUsers);
        } catch (error) {
            console.error("Failed to load users", error);
        } finally {
            setLoading(false);
        }
    };

    const handleRoleChange = async (userId: string, newRole: UserRole) => {
        if (currentUser.role !== 'super_admin') {
            alert("Only Super Admins can change roles.");
            return;
        }

        // Prevent changing own role for safety or implement strict checks
        if (userId === currentUser.uid) {
            alert("You cannot change your own role.");
            return;
        }

        try {
            await updateUserRole(userId, newRole);
            setUsers(prev => prev.map(u => u.uid === userId ? { ...u, role: newRole } : u));
        } catch (error) {
            console.error("Failed to update role", error);
            alert("Failed to update role");
        }
    };

    if (loading) return <div className="p-8 text-center">Loading users...</div>;

    return (
        <div className="p-6 max-w-6xl mx-auto animate-in fade-in duration-500">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-800 mb-2">Admin Dashboard</h1>
                <p className="text-slate-500">Manage users and roles</p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-100">
                            <th className="p-4 font-semibold text-slate-600 text-sm">User</th>
                            <th className="p-4 font-semibold text-slate-600 text-sm">Email</th>
                            <th className="p-4 font-semibold text-slate-600 text-sm">Role</th>
                            <th className="p-4 font-semibold text-slate-600 text-sm">Joined</th>
                            {currentUser.role === 'super_admin' && (
                                <th className="p-4 font-semibold text-slate-600 text-sm text-right">Actions</th>
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.uid} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                                <td className="p-4">
                                    <div className="flex items-center gap-3">
                                        <img
                                            src={user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.uid}`}
                                            alt=""
                                            className="w-8 h-8 rounded-full bg-slate-200"
                                        />
                                        <span className="font-medium text-slate-700">{user.displayName}</span>
                                    </div>
                                </td>
                                <td className="p-4 text-sm text-slate-600">{user.email}</td>
                                <td className="p-4">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                    ${user.role === 'super_admin' ? 'bg-purple-100 text-purple-800' :
                                            user.role === 'admin' ? 'bg-indigo-100 text-indigo-800' :
                                                'bg-slate-100 text-slate-800'}`}>
                                        {user.role.replace('_', ' ')}
                                    </span>
                                </td>
                                <td className="p-4 text-sm text-slate-500">
                                    {new Date(user.createdAt).toLocaleDateString()}
                                </td>
                                {currentUser.role === 'super_admin' && (
                                    <td className="p-4 text-right">
                                        <select
                                            value={user.role}
                                            onChange={(e) => handleRoleChange(user.uid, e.target.value as UserRole)}
                                            className="text-sm border border-slate-200 rounded-lg px-2 py-1 outline-none focus:border-indigo-500 bg-white"
                                            disabled={user.email === 'bhelavevicky66@gmail.com'} // Protect main super admin
                                        >
                                            <option value="user">User</option>
                                            <option value="admin">Admin</option>
                                            <option value="super_admin">Super Admin</option>
                                        </select>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminDashboard;
