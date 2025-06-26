function TestDashboard() {
  return (
    <div className="min-h-screen bg-green-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-green-800 mb-4">
          🎉 Login Successful!
        </h1>
        <p className="text-gray-600">
          Welcome to your dashboard. You have successfully logged in.
        </p>
        <div className="mt-4 p-4 bg-green-100 rounded">
          <p className="text-green-800 font-semibold">
            Dashboard is working correctly!
          </p>
        </div>
      </div>
    </div>
  );
}

export default TestDashboard;