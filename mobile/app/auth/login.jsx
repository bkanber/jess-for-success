import {StyleSheet} from 'react-native';
import {View, Text} from '@/components/Themed';
import {useAuth} from '@/components/useAuth';
import React, {useState} from 'react';
import {TextInput, TouchableOpacity, ActivityIndicator} from 'react-native';
import {useRouter, Link} from 'expo-router';

export default function LoginScreen() {
    const {fetch, setToken} = useAuth();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    const handleLogin = async () => {
        setLoading(true);
        setError('');
        try {
            const res = await fetch('http://localhost:7777/api/auth/token', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({username, password}),
            });
            const data = await res.json();
            if (res.ok && data.token) {
                await setToken(data.token);
            } else {
                setError(data.error || 'Login failed');
            }
        } catch (err) {
            setError('Network error');
        }
        setLoading(false);
    };

    return (
        <View style={styles.container}>
            <Text style={{fontSize: 24, marginBottom: 24}}>Login</Text>
            <TextInput
                style={styles.input}
                placeholder="Username"
                autoCapitalize="none"
                value={username}
                onChangeText={setUsername}
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
            />
            {error ? <Text style={{color: 'red', marginBottom: 12}}>{error}</Text> : null}
            <TouchableOpacity
                style={styles.button}
                onPress={handleLogin}
                disabled={loading}
            >
                {loading ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <Text style={{color: '#fff', fontWeight: 'bold'}}>Login</Text>
                )}
            </TouchableOpacity>
            <Link href="/auth/register" style={{marginTop: 24}}>
                <Text style={{color: '#007AFF'}}>Don't have an account? Register</Text>
            </Link>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    input: {
        width: 240,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 10,
        marginBottom: 12,
        fontSize: 16,
        backgroundColor: '#fff',
    },
    button: {
        backgroundColor: '#333',
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 8,
        width: 240,
    },
});