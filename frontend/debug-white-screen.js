// This script would typically be run in the browser console
// For debug purposes, you can copy this into the browser console when visiting http://localhost:5173/

console.log('Checking for errors on white screen...');

// Display all errors from the console
const errors = [];
const originalError = console.error;
console.error = function() {
  errors.push(Array.from(arguments));
  originalError.apply(console, arguments);
};

// Check for React error boundary issues
const reactRoot = document.getElementById('root');
if (!reactRoot || reactRoot.children.length === 0) {
  console.log('React root is empty - possible rendering issue');
}

// Check for authentication related issues
if (localStorage.getItem('supabase.auth.token')) {
  console.log('Supabase auth token found in localStorage');
} else {
  console.log('No Supabase auth token found in localStorage');
}

// Report DOM state
console.log('Current DOM structure:', document.body.innerHTML);

// Report all collected errors
console.log('All errors found:', errors);