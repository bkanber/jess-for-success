import React, { useState, useEffect, useRef } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Platform, StyleSheet, Button, Image, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Text, View } from '@/components/Themed';
import { useRouter } from 'expo-router';

export default function HangerModalScreen() {
    const [image, setImage] = useState(null);
    const [name, setName] = useState('');
    const [type, setType] = useState('');
    const [tags, setTags] = useState('');
    const [uploading, setUploading] = useState(false);
    const [uploaded, setUploaded] = useState(false);
    const router = useRouter();
    const timeoutRef = useRef(null);

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
        });
        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    const takePhoto = async () => {
        const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
        });
        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    const handleUpload = async () => {
        setUploading(true);
        setTimeout(() => {
            setUploading(false);
            setUploaded(true);
        }, 1500); // Mock upload
    };

    useEffect(() => {
        if (uploaded) {
            timeoutRef.current = setTimeout(() => {
                router.back();
            }, 3000);
            return () => {
                if (timeoutRef.current) clearTimeout(timeoutRef.current);
            };
        }
    }, [uploaded]);

    if (uploaded) {
        return (
            <View style={styles.container}>
                <Text style={{fontSize: 20, marginBottom: 16}}>Upload successful!</Text>
                <Text>Hanger "{name || 'New Item'}" added.</Text>
                <TouchableOpacity
                    style={{marginTop: 24, padding: 12, backgroundColor: '#eee', borderRadius: 8}}
                    onPress={() => {
                        if (timeoutRef.current) clearTimeout(timeoutRef.current);
                        setUploaded(false);
                        setUploading(false);
                        setImage(null);
                        setName('');
                        setType('');
                        setTags('');
                    }}
                >
                    <Text style={{color: '#333', fontWeight: 'bold'}}>Add Another</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
            {!image ? (
                <View style={{alignItems: 'center'}}>
                    <Text style={{fontSize: 18, marginBottom: 16}}>Add a new Hanger</Text>
                    <Button title="Take Photo" onPress={takePhoto} />
                    <View style={{height: 12}} />
                    <Button title="Choose from Gallery" onPress={pickImage} />
                </View>
            ) : (
                <View style={{width: '100%', alignItems: 'center'}}>
                    <Image source={{ uri: image }} style={styles.imagePreview} />
                    <TextInput
                        style={styles.input}
                        placeholder="Name"
                        value={name}
                        onChangeText={setName}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Type (e.g. t-shirt)"
                        value={type}
                        onChangeText={setType}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Tags (comma separated)"
                        value={tags}
                        onChangeText={setTags}
                    />
                    <TouchableOpacity
                        style={styles.uploadButton}
                        onPress={handleUpload}
                        disabled={uploading}
                    >
                        {uploading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={{color: '#fff', fontWeight: 'bold'}}>Upload</Text>
                        )}
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
    },
    imagePreview: {
        width: 180,
        height: 180,
        borderRadius: 12,
        marginBottom: 16,
        backgroundColor: '#eee',
    },
    input: {
        width: '100%',
        maxWidth: 320,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 10,
        marginBottom: 12,
        fontSize: 16,
        backgroundColor: '#fff',
    },
    uploadButton: {
        backgroundColor: '#333',
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 8,
        width: '100%',
        maxWidth: 320,
    },
});
