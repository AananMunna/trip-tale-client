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

      await axiosSecure.post("/dashboard/payment-history", paymentRecord);
      await axiosSecure.patch(`/bookings/${id}`, { status: "confirmed" });

      Swal.fire("Payment Successful", "Your tour is confirmed!", "success");
      navigate('/payment-history')
    } else {
      Swal.fire("Payment Incomplete", "Something went wrong", "error");
    }

    setProcessing(false);
  };

  return (
    <section className="max-w-xl mx-auto mt-10 p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4 text-center text-emerald-600 dark:text-emerald-400">
        Complete Your Payment
      </h2>

      {booking && (
        <div className="mb-4 text-center">
          <p>Package: <strong>{booking.packageTitle}</strong></p>
          <p>Price: ৳{booking.price}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <CardElement className="p-3 border dark:border-gray-600 rounded-md bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white" />
        <button
          type="submit"
          disabled={!stripe || !clientSecret || processing}
          className="w-full px-4 py-2 bg-emerald-600 text-white font-semibold rounded hover:bg-emerald-700 disabled:opacity-50"
        >
          {processing ? "Processing..." : `Pay Now $ ${booking.price}`}
        </button>
      </form>
    </section>
  );
};

export default Payment;
