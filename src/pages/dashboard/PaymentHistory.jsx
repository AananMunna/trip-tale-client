import { useContext, useEffect, useState } from "react";
// import useAxiosSecure from "../../hooks/useAxiosSecure";
// import { AuthContext } from "../../context/AuthProvider";
import { Loader2 } from "lucide-react";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { AuthContext } from "../../context/AuthProvider";

const PaymentHistory = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useContext(AuthContext);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.email) return;

    axiosSecure
      .get(`/payment-history?email=${user.email}`)
      .then((res) => {
        setPayments(res.data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [axiosSecure, user]);

  return (
    <section className="max-w-5xl mx-auto p-6">
      <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center text-emerald-600 dark:text-emerald-400">
        My Payment History
      </h2>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <Loader2 className="animate-spin w-6 h-6 text-emerald-600" />
        </div>
      ) : payments.length === 0 ? (
        <p className="text-center text-gray-500 dark:text-gray-400">No payments found.</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {payments.map((payment, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow p-4 transition hover:shadow-md"
            >
              <p><span className="font-semibold text-gray-700 dark:text-gray-300">Package:</span> {payment.packageTitle || "N/A"}</p>
              <p><span className="font-semibold text-gray-700 dark:text-gray-300">Amount:</span> ৳{payment.amount}</p>
              <p><span className="font-semibold text-gray-700 dark:text-gray-300">Date:</span> {new Date(payment.date).toLocaleDateString()}</p>
              <p><span className="font-semibold text-gray-700 dark:text-gray-300">Transaction ID:</span> <span className="text-sm text-emerald-600 dark:text-emerald-400">{payment.transactionId}</span></p>
              <p><span className="font-semibold text-gray-700 dark:text-gray-300">Email:</span> {payment.email}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default PaymentHistory;
