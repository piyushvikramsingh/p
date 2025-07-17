import { faker } from '@faker-js/faker';

export type UserRole = 'Super Admin' | 'Moderator' | 'Support Agent' | 'End User';
export type UserStatus = 'Active' | 'Suspended' | 'Banned';
export type SubscriptionPlan = 'Free' | 'Pro' | 'Enterprise';

export interface User {
  id: string;
  avatar: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  plan: SubscriptionPlan;
  lastActive: Date;
  createdAt: Date;
}

export const generateUsers = (count: number): User[] => {
  const users = Array.from({ length: count }, () => ({
    id: faker.string.uuid(),
    avatar: faker.image.avatar(),
    name: faker.person.fullName(),
    email: faker.internet.email(),
    role: faker.helpers.arrayElement<UserRole>(['Moderator', 'Support Agent', 'End User']),
    status: faker.helpers.arrayElement<UserStatus>(['Active', 'Active', 'Active', 'Suspended', 'Banned']),
    plan: faker.helpers.arrayElement<SubscriptionPlan>(['Free', 'Pro', 'Enterprise']),
    lastActive: faker.date.recent({ days: 30 }),
    createdAt: faker.date.past({ years: 1 }),
  }));

  // Ensure our main user exists
  users.unshift({
    id: 'piyush-main-user',
    avatar: 'https://i.pravatar.cc/150?u=piyush',
    name: 'Piyush Sharma',
    email: 'piyush@example.com',
    role: 'Super Admin',
    status: 'Active',
    plan: 'Enterprise',
    lastActive: new Date(),
    createdAt: faker.date.past({ years: 2 }),
  });

  return users;
};

// New Log Types and Generators
export type LogLevel = 'Info' | 'Warning' | 'Error' | 'Critical';
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export interface ActivityLog {
  id: string;
  user: { name: string; avatar: string; };
  action: string;
  target: string;
  ip: string;
  timestamp: Date;
}

export interface ErrorLog {
  id: string;
  code: number;
  message: string;
  stackTrace: string;
  severity: LogLevel;
  timestamp: Date;
}

export interface ApiLog {
  id: string;
  method: HttpMethod;
  endpoint: string;
  statusCode: number;
  ip: string;
  duration: number; // in ms
  timestamp: Date;
}

export const generateActivityLogs = (count: number): ActivityLog[] => {
  return Array.from({ length: count }, () => ({
    id: faker.string.uuid(),
    user: {
      name: faker.person.fullName(),
      avatar: faker.image.avatar(),
    },
    action: faker.helpers.arrayElement(['User Login', 'Updated Settings', 'Deleted User', 'Exported Data', 'Created Task']),
    target: faker.helpers.arrayElement(['User: J.Doe', 'System Settings', 'User: A.Smith', 'User List', 'Task #123']),
    ip: faker.internet.ip(),
    timestamp: faker.date.recent({ days: 7 }),
  }));
};

export const generateErrorLogs = (count: number): ErrorLog[] => {
  return Array.from({ length: count }, () => ({
    id: faker.string.uuid(),
    code: faker.helpers.arrayElement([404, 500, 403, 401]),
    message: faker.hacker.phrase(),
    stackTrace: `Error: ${faker.hacker.phrase()}\n    at ${faker.system.filePath()}:${faker.number.int({min:1, max:500})}:${faker.number.int({min:1, max:100})}`,
    severity: faker.helpers.arrayElement<LogLevel>(['Info', 'Warning', 'Error', 'Critical']),
    timestamp: faker.date.recent({ days: 7 }),
  }));
};

export const generateApiLogs = (count: number): ApiLog[] => {
  return Array.from({ length: count }, () => ({
    id: faker.string.uuid(),
    method: faker.helpers.arrayElement<HttpMethod>(['GET', 'POST', 'PUT', 'DELETE', 'PATCH']),
    endpoint: faker.helpers.arrayElement(['/api/users', '/api/tasks/123', '/api/auth/login', '/api/files', '/api/billing/subscriptions']),
    statusCode: faker.helpers.arrayElement([200, 201, 404, 500, 401, 403]),
    ip: faker.internet.ip(),
    duration: faker.number.int({ min: 20, max: 500 }),
    timestamp: faker.date.recent({ days: 7 }),
  }));
};
