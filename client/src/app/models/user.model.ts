export interface User {
    id: number;
    username: string;
    email: string;
    password: string;
    isSuper: boolean;
}

export interface loginCredentials {
    email: string;
    password: string;
}
