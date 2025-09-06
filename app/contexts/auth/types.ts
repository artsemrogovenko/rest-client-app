export interface AuthUser {
    displayName: string | null;
    email: string | null;
    uid: string;
}

export interface AuthContextType {
    user: AuthUser | null;
    setUser: (user: AuthUser | null) => void;
}