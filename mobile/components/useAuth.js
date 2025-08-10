import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';


const AuthContext = createContext();
const TOKEN_KEY = 'auth_token';

export function AuthProvider({ children }) {
    const [token, setTokenState] = useState(null);

    // Save token to SecureStore when set
    const setToken = useCallback(async (newToken) => {
        setTokenState(newToken);
        if (newToken) {
            await AsyncStorage.setItem(TOKEN_KEY, newToken);
        } else {
            await AsyncStorage.removeItem(TOKEN_KEY);
        }
    }, []);

    // Load token from SecureStore on mount
    useEffect(() => {
        const loadToken = async () => {
            const storedToken = await AsyncStorage.getItem(TOKEN_KEY);
            if (storedToken) {
                setTokenState(storedToken);
            }
        };
        loadToken()
            .catch(err => console.error('Failed to load token:', err));
    }, []);

    // Wrap fetch to add Authorization header
    const authFetch = useCallback(
        (url, options = {}) => {
            const headers = options.headers ? { ...options.headers } : {};
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }
            return fetch(url, { ...options, headers });
        },
        [token]
    );

    return (
        <AuthContext.Provider value={{ token, setToken, fetch: authFetch }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
