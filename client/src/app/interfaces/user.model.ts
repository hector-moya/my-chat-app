export interface User {
  _id: string;
  userName: string;
  imageUrl?: string;
  email: string;
  password: string;
  bio?: string;
  status: 'pending' | 'user' | 'super';
}

export interface loginCredentials {
    email: string;
    password: string;
}

export interface Role {
    _id: string;
    roleName: string;
}

export interface UpdateResponse {
    message: string;
    user: User;
}