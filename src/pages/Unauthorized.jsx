// pages/Unauthorized.jsx
const Unauthorized = () => {
  return (
    <div className="min-h-screen flex items-center justify-center text-center">
      <div>
        <h1 className="text-4xl font-bold text-red-600">Access Denied</h1>
        <p className="text-gray-500 mt-4">You are not authorized to view this page.</p>
      </div>
    </div>
  );
};

export default Unauthorized;
