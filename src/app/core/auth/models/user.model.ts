export interface User {
  id: number | string;
  username: string;
  email: string;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  fullName?: string;
  password?: string;
  role?: UserRole;
  isActivated?: boolean;
  avatar?: string;
  createdOn?: Date;
  updatedOn?: Date;
  lastLogin?: Date;
  token?: string;
  refreshToken?: string;
  permissions?: string[];
  age?: number;
  bio?: string;
}

export enum UserRole {
  Admin,
  Editor,
  User
}

export interface Credentials {
  username: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}
