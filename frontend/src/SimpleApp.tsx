// Test component to check if basic React is working
function SimpleApp() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#22c55e', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center' 
    }}>
      <div style={{ 
        backgroundColor: 'white', 
        padding: '2rem', 
        borderRadius: '8px', 
        textAlign: 'center' 
      }}>
        <h1 style={{ 
          fontSize: '2rem', 
          marginBottom: '1rem', 
          color: '#333' 
        }}>
          🌱 FarmCare AI is Working!
        </h1>
        <p style={{ color: '#666' }}>
          If you can see this, React is working correctly.
        </p>
        <p style={{ color: '#666', marginTop: '0.5rem' }}>
          The issue was likely with Supabase configuration.
        </p>
      </div>
    </div>
  );
}

export default SimpleApp;
