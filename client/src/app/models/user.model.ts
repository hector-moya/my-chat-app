export interface User {
    _id: string;
    userName: string;
    email: string;
    password: string;
    isSuper: boolean;
}

export interface loginCredentials {
    email: string;
    password: string;
}
