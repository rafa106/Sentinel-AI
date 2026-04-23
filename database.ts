import Database from 'better-sqlite3';
import path from 'path';

const db = new Database('sentinel.db');

// Initialize tables
db.exec(`
  CREATE TABLE IF NOT EXISTS devices (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    status TEXT NOT NULL,
    risk TEXT NOT NULL,
    user TEXT NOT NULL,
    lastSeen TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS vault_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    content TEXT NOT NULL,
    createdAt TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS team_members (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    status TEXT NOT NULL,
    email TEXT NOT NULL
  );
`);

// Seed initial data if empty
const deviceCount = db.prepare('SELECT count(*) as count FROM devices').get() as { count: number };
if (deviceCount.count === 0) {
  const insertDevice = db.prepare('INSERT INTO devices (name, type, status, risk, user, lastSeen) VALUES (?, ?, ?, ?, ?, ?)');
  insertDevice.run('CEO-MacBook-Pro', 'Laptop', 'Protected', 'Low', 'Rafael Constancio', '2m ago');
  insertDevice.run('Finance-Desktop-01', 'Desktop', 'Scanning', 'Medium', 'Ana Silva', 'Just now');
  insertDevice.run('Marketing-iPhone', 'Smartphone', 'Protected', 'Low', 'Carlos Souza', '15m ago');
  insertDevice.run('Dev-Workstation-04', 'Desktop', 'Vulnerable', 'High', 'Lucas Lima', '1h ago');
}

const teamCount = db.prepare('SELECT count(*) as count FROM team_members').get() as { count: number };
if (teamCount.count === 0) {
  const insertMember = db.prepare('INSERT INTO team_members (name, role, status, email) VALUES (?, ?, ?, ?)');
  insertMember.run('Rafael Constancio', 'Security Admin', 'Active', 'rafael@company.com');
  insertMember.run('Ana Silva', 'Security Analyst', 'Active', 'ana@company.com');
  insertMember.run('Carlos Souza', 'Compliance Officer', 'Active', 'carlos@company.com');
}

export default db;
