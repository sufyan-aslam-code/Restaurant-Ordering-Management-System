import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Shield, User, Mail, ShieldAlert, Search } from "lucide-react"; // <-- Added Search icon

// NOTE: Ensure this path matches where your Container component is actually located
import Container from "../../components/common/Container"; 

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(""); // <-- New state for the search bar

  // Fetch users when the component mounts
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("restaurant_access_token"); 
      
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/admin/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        setUsers(data);
      } else {
        throw new Error(data.message || "Failed to fetch users");
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      const token = localStorage.getItem("restaurant_access_token");
      
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/admin/users/${userId}/role`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ role: newRole }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("User role updated successfully!");
        setUsers(users.map((u) => (u.id === userId ? { ...u, role: newRole } : u)));
      } else {
        throw new Error(data.message || "Failed to update role");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Filter users based on the search query
  const filteredUsers = users.filter((user) => {
    const query = searchQuery.toLowerCase();
    const nameMatch = user.fullName?.toLowerCase().includes(query);
    const emailMatch = user.email?.toLowerCase().includes(query);
    return nameMatch || emailMatch;
  });

  if (isLoading) {
    return (
      <Container>
        <div className="flex h-96 items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-orange-500 border-t-transparent"></div>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="py-8">
        {/* Header Section */}
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
              Manage Users
            </h1>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              View registered users and manage their access roles.
            </p>
          </div>
          <div className="flex items-center gap-2 self-start rounded-lg bg-orange-50 px-4 py-2 text-orange-600 dark:bg-orange-500/10 dark:text-orange-500 sm:self-auto">
            <ShieldAlert size={20} />
            <span className="text-sm font-semibold">Admin Access Required</span>
          </div>
        </div>

        {/* Search Bar Section */}
        <div className="mb-6 flex items-center justify-between">
          <div className="relative w-full max-w-md">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full rounded-xl border border-gray-200 bg-white p-2.5 pl-10 text-sm text-gray-900 outline-none transition-colors focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:placeholder-gray-400 dark:focus:border-orange-500"
            />
          </div>
        </div>

        {/* Users Table */}
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600 dark:text-gray-400">
              <thead className="border-b border-gray-200 bg-gray-50 text-xs uppercase text-gray-700 dark:border-slate-800 dark:bg-slate-800/50 dark:text-gray-300">
                <tr>
                  <th className="px-6 py-4 font-semibold">User</th>
                  <th className="px-6 py-4 font-semibold">Contact Info</th>
                  <th className="px-6 py-4 font-semibold">Current Role</th>
                  <th className="px-6 py-4 text-right font-semibold">Manage Role</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-slate-800">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="py-12 text-center text-gray-500 dark:text-gray-400">
                      {searchQuery ? "No users found matching your search." : "No users found."}
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr
                      key={user.id}
                      className="transition-colors hover:bg-gray-50 dark:hover:bg-slate-800/50"
                    >
                      {/* User Name & Avatar */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-orange-100 to-orange-50 font-bold text-orange-600 dark:from-orange-500/20 dark:to-orange-500/10 dark:text-orange-500">
                            {user.fullName ? user.fullName[0].toUpperCase() : "U"}
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900 dark:text-white">
                              {user.fullName}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              ID: {user.id}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Contact Info */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Mail size={16} className="text-gray-400" />
                          <span>{user.email}</span>
                        </div>
                      </td>

                      {/* Current Role Badge */}
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
                            user.role === "admin"
                              ? "bg-purple-100 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400"
                              : "bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400"
                          }`}
                        >
                          {user.role === "admin" ? <Shield size={14} /> : <User size={14} />}
                          {user.role === "admin" ? "Admin" : "User"}
                        </span>
                      </td>

                      {/* Role Management Dropdown */}
                      <td className="px-6 py-4 text-right">
                        <select
                          value={user.role}
                          onChange={(e) => handleRoleChange(user.id, e.target.value)}
                          className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 outline-none transition-colors focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-gray-200 dark:focus:border-orange-500"
                        >
                          <option value="user">User</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default ManageUsers;