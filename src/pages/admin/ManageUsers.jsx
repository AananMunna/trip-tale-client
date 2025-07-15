import React, { useContext, useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import Swal from "sweetalert2";
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

  const roleColors = {
    tourist: "bg-emerald-600 hover:bg-emerald-700",
    guide: "bg-blue-600 hover:bg-blue-700",
    admin: "bg-red-600 hover:bg-red-700",
  };

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
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      <h2 className="text-3xl font-semibold mb-6 text-emerald-600 dark:text-emerald-400">
        Manage Users
      </h2>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6 items-start md:items-center">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="px-4 py-2 border rounded-md w-full md:w-1/3 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200"
          aria-label="Search users by name or email"
        />
        <div className="w-full md:w-1/4">
          <Select
            options={roles}
            placeholder="Filter by role"
            isClearable
            value={roleFilter}
            onChange={setRoleFilter}
            className="dark:text-gray-200"
          />
        </div>
      </div>

      {isLoading ? (
        <p className="text-center text-gray-500 dark:text-gray-400">Loading users...</p>
      ) : isError ? (
        <p className="text-center text-red-500">Failed to load users.</p>
      ) : users.length === 0 ? (
        <p className="text-center text-gray-500 dark:text-gray-400">No users found.</p>
      ) : (
        <>
          {/* Large screen table */}
          <div className="hidden md:block overflow-x-auto rounded-md shadow-md">
            <table className="min-w-full table-auto bg-white dark:bg-gray-800">
              <thead className="bg-emerald-600 text-white">
                <tr>
                  <th className="py-3 px-6 text-left">User</th>
                  <th className="py-3 px-6 text-left">Email</th>
                  <th className="py-3 px-6 text-left">Role</th>
                  <th className="py-3 px-6 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr
                    key={u._id}
                    className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <td className="py-3 px-6 flex items-center gap-3">
                      <img
                        src={u.photo || "/default-avatar.png"}
                        alt={`${u.name}'s avatar`}
                        className="w-10 h-10 rounded-full object-cover border-2 border-emerald-600"
                      />
                      <span>{u.name}</span>
                    </td>
                    <td className="py-3 px-6 break-words">{u.email}</td>
                    <td className="py-3 px-6 capitalize font-medium">{u.role}</td>
                    <td className="py-3 px-6 flex flex-wrap gap-2">
                      {roles
                        .filter((r) => r.value !== u.role)
                        .map((r) => (
                          <button
                            key={r.value}
                            onClick={() => handleRoleChange(u._id, r.value)}
                            className={`px-3 py-1 rounded text-white text-sm transition-colors duration-200 ${roleColors[r.value]}`}
                            aria-label={`Make ${r.label}`}
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

          {/* Mobile card view */}
          <div className="md:hidden flex flex-col gap-6">
            {users.map((u) => (
              <div
                key={u._id}
                className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md"
              >
                <div className="flex items-center gap-4 mb-3">
                  <img
                    src={u.photo || "/default-avatar.png"}
                    alt={`${u.name}'s avatar`}
                    className="w-14 h-14 rounded-full object-cover border-2 border-emerald-600"
                  />
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold">{u.name}</h3>
                    <p className="text-sm break-words">{u.email}</p>
                    <p className="capitalize font-medium text-emerald-600 dark:text-emerald-400 mt-1">
                      {u.role}
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {roles
                    .filter((r) => r.value !== u.role)
                    .map((r) => (
                      <button
                        key={r.value}
                        onClick={() => handleRoleChange(u._id, r.value)}
                        className={`flex-1 min-w-[40%] px-3 py-2 rounded text-white text-sm transition-colors duration-200 ${roleColors[r.value]}`}
                        aria-label={`Make ${r.label}`}
                      >
                        Make {r.label}
                      </button>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ManageUsers;
