import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';

// Better Auth tables
export const user = sqliteTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: integer('email_verified', { mode: 'boolean' }).notNull(),
  image: text('image'),
  createdAt: integer('created_at').notNull(),
  updatedAt: integer('updated_at').notNull(),
});

export const session = sqliteTable('session', {
  id: text('id').primaryKey(),
  expiresAt: integer('expires_at').notNull(),
  token: text('token').notNull().unique(),
  createdAt: integer('created_at').notNull(),
  updatedAt: integer('updated_at').notNull(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  userId: text('user_id').notNull().references(() => user.id),
});

export const account = sqliteTable('account', {
  id: text('id').primaryKey(),
  accountId: text('account_id').notNull(),
  providerId: text('provider_id').notNull(),
  userId: text('user_id').notNull().references(() => user.id),
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  idToken: text('id_token'),
  accessTokenExpiresAt: integer('access_token_expires_at'),
  refreshTokenExpiresAt: integer('refresh_token_expires_at'),
  scope: text('scope'),
  password: text('password'),
  createdAt: integer('created_at').notNull(),
  updatedAt: integer('updated_at').notNull(),
});

export const verification = sqliteTable('verification', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: integer('expires_at').notNull(),
  createdAt: integer('created_at'),
  updatedAt: integer('updated_at'),
});

// ERP Application Tables
export const employees = sqliteTable('employees', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  department: text('department').notNull(),
  role: text('role').notNull(),
  workingHours: integer('working_hours').default(0),
  performanceScore: integer('performance_score').default(0),
  avatar: text('avatar'),
  createdAt: text('created_at').notNull(),
});

export const marbleInventory = sqliteTable('marble_inventory', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  marbleType: text('marble_type').notNull(),
  size: text('size').notNull(),
  quality: text('quality').notNull(),
  quantity: integer('quantity').notNull(),
  pricePerUnit: integer('price_per_unit').notNull(),
  location: text('location').notNull(),
  createdAt: text('created_at').notNull(),
});

export const productionOrders = sqliteTable('production_orders', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  orderId: text('order_id').notNull().unique(),
  stage: text('stage').notNull(),
  progress: integer('progress').notNull().default(0),
  assignedEmployee: text('assigned_employee'),
  startDate: text('start_date').notNull(),
  endDate: text('end_date'),
  status: text('status').notNull(),
  createdAt: text('created_at').notNull(),
});

export const clients = sqliteTable('clients', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  company: text('company').notNull(),
  email: text('email').notNull().unique(),
  phone: text('phone').notNull(),
  address: text('address'),
  status: text('status').notNull().default('active'),
  totalProjects: integer('total_projects').default(0),
  totalRevenue: integer('total_revenue').default(0),
  createdAt: text('created_at').notNull(),
});

export const sales = sqliteTable('sales', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  clientId: integer('client_id').notNull().references(() => clients.id),
  projectName: text('project_name').notNull(),
  amount: integer('amount').notNull(),
  status: text('status').notNull(),
  paymentStatus: text('payment_status').notNull(),
  createdAt: text('created_at').notNull(),
});

// New tables
export const projects = sqliteTable('projects', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  clientId: integer('client_id').notNull().references(() => clients.id),
  budget: integer('budget').notNull(),
  dueDate: text('due_date').notNull(),
  status: text('status').notNull(),
  progress: integer('progress').notNull().default(0),
  createdAt: text('created_at').notNull(),
});

export const clientNotes = sqliteTable('client_notes', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  clientId: integer('client_id').notNull().references(() => clients.id),
  content: text('content').notNull(),
  type: text('type').notNull(),
  createdAt: text('created_at').notNull(),
});