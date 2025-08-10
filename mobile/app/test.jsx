import React, { useState } from 'react';
import { StyleSheet, Button, Image, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Text, View } from '@/components/Themed';

export default function TestUploadScreen() {
    const [image, setImage] = useState(null);
    const [result, setResult] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(null);

    const pickImageAndUpload = async () => {
        setError(null);
        setResult(null);
        // Pick image
        const pickerResult = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: false,
            quality: 1,
        });
        if (pickerResult.canceled) return;
        const asset = pickerResult.assets[0];
        console.log(asset);
        setImage(asset.uri);
        setUploading(true);
        try {
            // Prepare form data
            const formData = new FormData();
            formData.append('file', asset.file);
            // Upload
            const response = await fetch('http://localhost:7777/tagimage', {
                method: 'POST',
                body: formData,
            });
            if (!response.ok) throw new Error('Upload failed');
            const data = await response.json();
            setResult(data);
        } catch (e) {
            setError(e.message);
        } finally {
            setUploading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Button title="Select Image & Upload" onPress={pickImageAndUpload} disabled={uploading} />
            {image && <Image source={{ uri: image }} style={styles.imagePreview} />}
            {uploading && <ActivityIndicator style={{margin: 16}} />}
            {result && (
                <View style={styles.resultBox}>
                    <Text style={{fontWeight: 'bold'}}>Result:</Text>
                    <Text selectable>{JSON.stringify(result, null, 2)}</Text>
                </View>
            )}
            {error && <Text style={{color: 'red'}}>{error}</Text>}
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
        marginVertical: 16,
        backgroundColor: '#eee',
    },
    resultBox: {
        marginTop: 16,
        padding: 12,
        backgroundColor: '#f5f5f5',
        borderRadius: 8,
        width: '100%',
        maxWidth: 320,
    },
});
