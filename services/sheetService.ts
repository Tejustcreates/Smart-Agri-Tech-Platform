import * as XLSX from 'xlsx';
import { User } from '../types';

const STORAGE_KEY = 'growsmart_users';

const loadUsers = (): User[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

const saveUsers = (users: User[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
};

let userDatabase: User[] = loadUsers();

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const signUpUser = async (newUser: User): Promise<{ user: { name: string } | null; error: string | null; }> => {
  await delay(500);

  if (!newUser.email || !newUser.password || !newUser.name) {
      return { user: null, error: "All fields are required." };
  }

  const existingUser = userDatabase.find(user => user.email.toLowerCase() === newUser.email.toLowerCase());

  if (existingUser) {
    return { user: null, error: "An account with this email already exists." };
  }

  userDatabase.push({
      name: newUser.name,
      email: newUser.email.toLowerCase(),
      password: newUser.password,
      signedUpAt: new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }),
  });

  saveUsers(userDatabase);
  return { user: { name: newUser.name }, error: null };
};

export const loginUser = async (email: string, password: string): Promise<{ user: { name: string } | null; error: string | null; }> => {
    await delay(500);

    if (!email || !password) {
        return { user: null, error: "Email and password are required." };
    }

    userDatabase = loadUsers();
    const user = userDatabase.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (!user) {
      return { user: null, error: "Invalid email or password." };
    }

    if (user.password !== password) {
      return { user: null, error: "Invalid email or password." };
    }

    return { user: { name: user.name }, error: null };
};

export const getAllUsers = (): { name: string; email: string; signedUpAt: string }[] => {
  userDatabase = loadUsers();
  return userDatabase.map(u => ({
    name: u.name,
    email: u.email,
    signedUpAt: u.signedUpAt || 'N/A',
  }));
};

export const exportToExcel = () => {
  const data = userDatabase.map((u, i) => ({
    'S.No': i + 1,
    'Name': u.name,
    'Email': u.email,
    'Signed Up': u.signedUpAt || 'N/A',
  }));

  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Registered Users');

  ws['!cols'] = [
    { wch: 6 },
    { wch: 25 },
    { wch: 35 },
    { wch: 22 },
  ];

  XLSX.writeFile(wb, 'GrowSmart_Registered_Users.xlsx');
};
