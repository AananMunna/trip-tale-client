import { useNavigate, useParams } from "react-router";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useEffect, useState } from "react";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import Swal from "sweetalert2";

const Payment = () => {
  const { id } = useParams();
  const stripe = useStripe();
  const elements = useElements();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate()

  const [clientSecret, setClientSecret] = useState("");
  const [booking, setBooking] = useState(null);
  const [processing, setProcessing] = useState(false);

  // console.log(booking);

  useEffect(() => {
    axiosSecure.get(`/bookings/${id}`).then((res) => {
      const price = Number(res.data?.price || 0); // type-safe
      setBooking(res.data);

      // Convert price to cents
      const priceInCents = Math.round(price * 100);
      if (!priceInCents || isNaN(priceInCents)) return;

      axiosSecure
        .post("/create-payment-intent", { amount: priceInCents })
        .then((response) => {
          if (response.data?.clientSecret) {
            setClientSecret(response.data.clientSecret);
            // console.log(response.data.clientSecret);
          } else {
            Swal.fire("Error", "Failed to create payment intent", "error");
          }
        });
    });
  }, [id, axiosSecure]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements || !clientSecret) return;

    setProcessing(true);
    const card = elements.getElement(CardElement);

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card,
    });

    if (error) {
      Swal.fire("Payment Failed", error.message, "error");
      setProcessing(false);
      return;
    }

    const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: paymentMethod.id,
    });

    if (confirmError) {
      Swal.fire("Payment Error", confirmError.message, "error");
      setProcessing(false);
      return;
    }
    if (paymentIntent?.status === "succeeded") {
      const paymentRecord = {
        packageTitle:booking.packageTitle,
        bookingId: id,
        amount: booking.price,
        transactionId: paymentIntent.id,
        email: booking.touristEmail,
        date: new Date().toISOString(),
      };

      await axiosSecure.post("/payment-history", paymentRecord);
      await axiosSecure.patch(`/bookings/${id}`, { status: "confirmed" });

      Swal.fire("Payment Successful", "Your tour is confirmed!", "success");
      navigate('/dashboard/payment-history')
    } else {
      Swal.fire("Payment Incomplete", "Something went wrong", "error");
    }

    setProcessing(false);
  };

  
const isDarkMode = document.documentElement.classList.contains("dark");


  const cardStyle = {
  style: {
    base: {
      color: isDarkMode ? "#f3f4f6" : "#1f2937", // light: gray-800, dark: gray-100
      fontSize: "16px",
      iconColor: isDarkMode ? "#10B981" : "#059669", // emerald-400 vs 600
      backgroundColor: isDarkMode ? "#1f2937" : "#f9fafb", // bg-gray-800 vs gray-50
      "::placeholder": {
        color: isDarkMode ? "#9CA3AF" : "#6B7280", // gray-400 vs 600
      },
    },
    invalid: {
      color: "#ef4444", // red-500
      iconColor: "#ef4444",
    },
  },
};


  return (
   <section className="max-w-xl mx-auto mt-16 p-6 md:p-8 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 transition-all duration-300">
  <h2 className="text-3xl font-extrabold mb-6 text-center text-emerald-700 dark:text-emerald-400 tracking-tight">
    Complete Your Payment
  </h2>

  {booking && (
    <div className="mb-6 text-center text-lg font-medium text-gray-800 dark:text-gray-200 space-y-1">
      <p>📦 Package: <span className="font-semibold">{booking.packageTitle}</span></p>
      <p>💵 Amount: <span className="text-emerald-600 dark:text-emerald-400 font-bold">৳{booking.price}</span></p>
    </div>
  )}

  <form onSubmit={handleSubmit} className="space-y-6">
    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-600 p-4 transition-all duration-200 focus-within:ring-2 focus-within:ring-emerald-500">
<div className={`p-4 rounded-lg shadow-md ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
  <CardElement options={cardStyle} />
</div>

    </div>

    <button
      type="submit"
      disabled={!stripe || !clientSecret || processing}
      className="w-full px-6 py-3 text-lg font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-50 transition-all duration-200 shadow-md"
    >
      {processing ? "Processing..." : `Pay Now ৳${booking?.price}`}
    </button>
  </form>
</section>

  );
};

export default Payment;
