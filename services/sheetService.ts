import { User } from '../types';

// This is our in-memory "Google Sheet" database.
// In a real application, this would be a backend API call to a real database.
const userDatabase: User[] = [];

// Simulate a delay to mimic a network request
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

/**
 * Signs up a new user, checking for duplicate emails.
 * In a real app, the password would be hashed before saving.
 */
export const signUpUser = async (newUser: User): Promise<{ user: { name: string } | null; error: string | null; }> => {
  await delay(500); // Simulate network latency

  if (!newUser.email || !newUser.password || !newUser.name) {
      return { user: null, error: "All fields are required." };
  }

  const existingUser = userDatabase.find(user => user.email.toLowerCase() === newUser.email.toLowerCase());

  if (existingUser) {
    return { user: null, error: "An account with this email already exists." };
  }
  
  // Storing the full user object including password for this simulation.
  // NEVER do this in a real production application. Always hash passwords.
  userDatabase.push({
      name: newUser.name,
      email: newUser.email.toLowerCase(),
      password: newUser.password,
  });
  
  console.log("Updated User Database:", userDatabase.map(u => ({name: u.name, email: u.email}))); // For debugging without logging passwords
  return { user: { name: newUser.name }, error: null };
};

/**
 * Logs in a user by verifying their email and password.
 */
export const loginUser = async (email: string, password: string): Promise<{ user: { name: string } | null; error: string | null; }> => {
    await delay(500); // Simulate network latency

    if (!email || !password) {
        return { user: null, error: "Email and password are required." };
    }

    const user = userDatabase.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (!user) {
        return { user: null, error: "Invalid email or password." };
    }

    // In a real app, you would compare a hashed password.
    if (user.password !== password) {
        return { user: null, error: "Invalid email or password." };
    }

    return { user: { name: user.name }, error: null };
};