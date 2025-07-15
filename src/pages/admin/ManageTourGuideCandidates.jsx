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
<div className="p-4">
  <h2 className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mb-4">
    🎓 Manage Tour Guide Candidates
  </h2>

  {/* Desktop Table */}
  {/* <div className="hidden lg:block overflow-x-auto rounded shadow">
    <table className="min-w-full bg-white dark:bg-gray-800">
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
            <td className="py-2 px-4 max-w-xs truncate" title={candidate.why}>
              {candidate.reason}
            </td>
            <td className="py-2 px-4">
              <a
                href={candidate.cvLink}
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
  </div> */}

  {/* Mobile Card View */}
  <div className=" space-y-4">
    {candidates.map((candidate) => (
      <div
        key={candidate._id}
        className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-gray-200 dark:border-gray-700"
      >
        <p>
          <span className="font-semibold">Name:</span> {candidate.name}
        </p>
        <p>
          <span className="font-semibold">Email:</span> {candidate.email}
        </p>
        <p>
          <span className="font-semibold">Title:</span> {candidate.title}
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          <span className="font-semibold">Why:</span> {candidate.reason}
        </p>
        <p className="mt-2">
          <a
            href={candidate.cvLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 underline"
          >
            View CV
          </a>
        </p>
        <div className="flex gap-2 mt-3">
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
        </div>
      </div>
    ))}
  </div>
</div>

  );
};

export default ManageTourGuideCandidates;
