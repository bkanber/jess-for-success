import {Button, StyleSheet} from 'react-native';
import { Text, View } from '@/components/Themed';
import * as ImagePicker from 'expo-image-picker';

export default function TabOneScreen() {
    const uploadImage = async (uri: string) => {
        const formData = new FormData();
        formData.append('file', uri);

        try {
            const response = await fetch('http://localhost:7777/caption', {
                method: 'POST',
                body: formData,
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            const data = await response.json();
            console.log('Upload successful:', data);
        } catch (error) {
            console.error('Upload failed:', error);
        }
    }

    const handleImagePicker = async () => {
        // No permissions request is necessary for launching the image library
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: false,
            quality: 1,
        });

        if (!result.canceled) {
            console.log("Uploading image");
            await uploadImage(result.assets[0].uri);
        }
    }

    return (
        <View style={styles.container}>
            <Button
                title="Pick an image from camera roll"
                onPress={handleImagePicker}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    }
});
