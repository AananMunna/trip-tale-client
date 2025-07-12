import React, { useContext, useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import Swal from "sweetalert2";
// import useAxiosSecure from "../../../hooks/useAxiosSecure";
// import { AuthContext } from "../../../context/AuthProvider";
import Select from "react-select";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { AuthContext } from "../../context/AuthProvider";

const ManageUsers = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useContext(AuthContext);
  const [roleFilter, setRoleFilter] = useState(null);
  const [searchText, setSearchText] = useState("");

  const roles = [
    { value: "tourist", label: "Tourist" },
    { value: "guide", label: "Tour Guide" },
    { value: "admin", label: "Admin" },
  ];

  const {
    data: users = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["allUsers", roleFilter, searchText],
    queryFn: async () => {
      const query = new URLSearchParams();
      if (roleFilter) query.append("role", roleFilter.value);
      if (searchText) query.append("search", searchText);
      const res = await axiosSecure.get(`/admin/users?${query.toString()}`);
      return res.data;
    },
  });

  const updateRoleMutation = useMutation({
    mutationFn: ({ id, newRole }) =>
      axiosSecure.patch(`/admin/users/${id}`, { role: newRole }),
    onSuccess: () => {
      Swal.fire("Success", "User role updated successfully", "success");
      refetch();
    },
    onError: () => {
      Swal.fire("Error", "Failed to update role", "error");
    },
  });

  const handleRoleChange = (id, role) => {
    updateRoleMutation.mutate({ id, newRole: role });
  };

  return (
    <div className="p-4 md:p-6">
      <h2 className="text-2xl font-semibold mb-4 text-emerald-600 dark:text-emerald-400">
        Manage Users
      </h2>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-4 items-start md:items-center">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="px-4 py-2 border rounded-md w-full md:w-1/3 shadow-sm"
        />
        <div className="w-full md:w-1/4">
          <Select
            options={roles}
            placeholder="Filter by role"
            isClearable
            value={roleFilter}
            onChange={setRoleFilter}
          />
        </div>
      </div>

      {isLoading ? (
        <p>Loading users...</p>
      ) : isError ? (
        <p>Failed to load users.</p>
      ) : (
        <div className="overflow-x-auto rounded-md shadow">
          <table className="min-w-full table-auto bg-white dark:bg-gray-800">
            <thead className="bg-emerald-600 text-white">
              <tr>
                <th className="py-3 px-6 text-left">Name</th>
                <th className="py-3 px-6 text-left">Email</th>
                <th className="py-3 px-6 text-left">Role</th>
                <th className="py-3 px-6 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr
                  key={user._id}
                  className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <td className="py-3 px-6">{user.name}</td>
                  <td className="py-3 px-6">{user.email}</td>
                  <td className="py-3 px-6 capitalize">{user.role}</td>
                  <td className="py-3 px-6 flex flex-wrap gap-2">
                    {roles.map((r) => (
                      <button
                        key={r.value}
                        disabled={user.role === r.value || updateRoleMutation.isLoading}
                        onClick={() => handleRoleChange(user._id, r.value)}
                        className={`px-3 py-1 rounded text-white text-sm transition-all duration-200 ${
                          user.role === r.value
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-blue-600 hover:bg-blue-700"
                        }`}
                      >
                        Make {r.label}
                      </button>
                    ))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ManageUsers;
