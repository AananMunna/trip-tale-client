import React, { useContext } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import Swal from "sweetalert2";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { AuthContext } from "../../context/AuthProvider";

const ManageTourGuideCandidates = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useContext(AuthContext);

  // Fetch applications
  const {
    data: candidates = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["candidates"],
    queryFn: async () => {
      const res = await axiosSecure.get("/admin/guide-candidates");
      return res.data;
    },
  });

  // Accept candidate
  const acceptMutation = useMutation({
    mutationFn: async (candidate) => {
      const res = await axiosSecure.patch(`/admin/updateRole/${candidate.email}`, {
        role: "guide",
      });
      await axiosSecure.delete(`/admin/guide-candidates/${candidate._id}`);
      return res;
    },
    onSuccess: () => {
      Swal.fire("Success", "User promoted to Tour Guide!", "success");
      refetch();
    },
    onError: () => {
      Swal.fire("Error", "Failed to promote user", "error");
    },
  });

  // Reject candidate
  const rejectMutation = useMutation({
    mutationFn: async (id) => {
      return await axiosSecure.delete(`/admin/guide-candidates/${id}`);
    },
    onSuccess: () => {
      Swal.fire("Rejected", "Candidate application removed", "info");
      refetch();
    },
    onError: () => {
      Swal.fire("Error", "Failed to reject candidate", "error");
    },
  });

  if (isLoading) return <p className="text-center">Loading...</p>;

  if (candidates.length === 0) return <p className="text-center">No applications found.</p>;

  return (
    <div className="overflow-x-auto p-4">
      <h2 className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mb-4">
        🎓 Manage Tour Guide Candidates
      </h2>
      <table className="min-w-full bg-white dark:bg-gray-800 rounded shadow">
        <thead className="bg-emerald-600 text-white">
          <tr>
            <th className="py-3 px-4 text-left">Name</th>
            <th className="py-3 px-4 text-left">Email</th>
            <th className="py-3 px-4 text-left">Application Title</th>
            <th className="py-3 px-4 text-left">Why</th>
            <th className="py-3 px-4 text-left">CV Link</th>
            <th className="py-3 px-4 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {candidates.map((candidate) => (
            <tr
              key={candidate._id}
              className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <td className="py-2 px-4">{candidate.name}</td>
              <td className="py-2 px-4">{candidate.email}</td>
              <td className="py-2 px-4">{candidate.title}</td>
              <td className="py-2 px-4 max-w-xs truncate" title={candidate.why}>{candidate.why}</td>
              <td className="py-2 px-4">
                <a
                  href={candidate.cv}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 underline"
                >
                  View CV
                </a>
              </td>
              <td className="py-2 px-4 flex gap-2">
                <button
                  onClick={() => acceptMutation.mutate(candidate)}
                  className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
                >
                  Accept
                </button>
                <button
                  onClick={() => rejectMutation.mutate(candidate._id)}
                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                >
                  Reject
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageTourGuideCandidates;
