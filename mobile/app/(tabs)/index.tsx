import {Button, StyleSheet} from 'react-native';
import { Text, View } from '@/components/Themed';
import * as ImagePicker from 'expo-image-picker';

export default function TabOneScreen() {
    const uploadImage = async (file) => {

        console.log("Uploading image:", file);

        const fd = new FormData();
        fd.append('file', file);

        try {
            const response = await fetch('http://localhost:7777/caption', {
                method: 'POST',
                body: fd,
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

        console.log("Image picker result:", result);

        if (!result.canceled) {
            console.log("Uploading image");
            const file = result.assets[0].file;
            file.uri = result.assets[0].uri;
            await uploadImage(file);
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
