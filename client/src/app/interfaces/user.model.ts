export interface User {
    _id: string;
    userName: string;
    imageUrl?: string;
    email: string;
    password: string;
    isSuper: boolean;
}

export interface loginCredentials {
    email: string;
    password: string;
}

export interface Role {
    _id: string;
    roleName: string;
}
