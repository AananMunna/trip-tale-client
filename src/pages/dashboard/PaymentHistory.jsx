import { useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { AuthContext } from "../../context/AuthProvider";

const PaymentHistory = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useContext(AuthContext);

  const {
    data: payments = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["paymentHistory", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/payment-history?email=${user?.email}`);
      return res.data.sort((a, b) => new Date(b.date) - new Date(a.date)); // Latest first
    },
    enabled: !!user?.email,
  });

  const recent = payments[0];
  const older = payments.slice(1);

  return (
    <section className="max-w-5xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-8 text-center text-emerald-600 dark:text-emerald-400">
        My Payment History
      </h2>

      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <Loader2 className="animate-spin w-6 h-6 text-emerald-600" />
        </div>
      ) : isError ? (
        <p className="text-center text-red-500">Failed to load payment history.</p>
      ) : payments.length === 0 ? (
        <p className="text-center text-gray-500 dark:text-gray-400">
          No payments found.
        </p>
      ) : (
        <div className="space-y-10">
          {/* 🔥 Recent Payment Highlighted */}
          {recent && (
            <div className="bg-emerald-50 dark:bg-emerald-950 border-l-4 border-emerald-500 p-5 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-3 text-emerald-700 dark:text-emerald-300">
                🕒 Most Recent Payment
              </h3>
              <div className="grid sm:grid-cols-2 gap-2 text-sm text-gray-700 dark:text-gray-200">
                <p><strong>Package:</strong> {recent.packageTitle || "N/A"}</p>
                <p><strong>Amount:</strong> ৳{recent.amount}</p>
                <p><strong>Date:</strong> {new Date(recent.date).toLocaleDateString()}</p>
                <p><strong>Transaction ID:</strong> <span className="text-emerald-600 dark:text-emerald-400">{recent.transactionId}</span></p>
                <p><strong>Email:</strong> {recent.email}</p>
              </div>
            </div>
          )}

          {/* 📜 Older Payments */}
          {older.length > 0 && (
            <div>
              <h4 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-300">
                Previous Payments
              </h4>
              <div className="grid md:grid-cols-2 gap-4">
                {older.map((payment, idx) => (
                  <div
                    key={idx}
                    className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow p-4 transition hover:shadow-md text-sm"
                  >
                    <p><strong>Package:</strong> {payment.packageTitle}</p>
                    <p><strong>Amount:</strong> ৳{payment.amount}</p>
                    <p><strong>Date:</strong> {new Date(payment.date).toLocaleDateString()}</p>
                    <p><strong>Transaction ID:</strong> <span className="text-emerald-600 dark:text-emerald-400">{payment.transactionId}</span></p>
                    <p><strong>Email:</strong> {payment.email}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
};

export default PaymentHistory;
