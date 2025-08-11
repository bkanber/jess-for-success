import React from 'react';
import { StyleSheet, FlatList, Image } from 'react-native';
import { Text, View } from '@/components/Themed';
import FloatingActionButton from '@/components/FloatingActionButton';
import { useRouter } from 'expo-router';

// Mocked hanger items
const mockHangers = [
    {
        id: '1',
        name: 'Blue Jeans',
        type: 'jeans',
        image: require('@/assets/images/icon.png'),
    },
    {
        id: '2',
        name: 'White T-Shirt',
        type: 't-shirt',
        image: require('@/assets/images/icon.png'),
    },
    {
        id: '3',
        name: 'Black Blazer',
        type: 'blazer',
        image: require('@/assets/images/icon.png'),
    },
    {
        id: '4',
        name: 'Red Dress',
        type: 'dress',
        image: require('@/assets/images/icon.png'),
    },
];

// Mocked outfits, each with a name and hanger items
const mockOutfits = [
    {
        id: 'o1',
        name: 'Casual Friday',
        items: [mockHangers[0], mockHangers[1]],
    },
    {
        id: 'o2',
        name: 'Boardroom Ready',
        items: [mockHangers[2], mockHangers[0]],
    },
    {
        id: 'o3',
        name: 'Evening Out',
        items: [mockHangers[3]],
    },
];

export default function OutfitsScreen() {
    const router = useRouter();
    return (
        <View style={styles.container}>
            <Text style={styles.header}>My Outfits</Text>
            <FlatList
                data={mockOutfits}
                keyExtractor={outfit => outfit.id}
                renderItem={({ item: outfit }) => (
                    <View style={styles.outfitCard}>
                        <Text style={styles.outfitName}>{outfit.name}</Text>
                        <View style={styles.itemsRow}>
                            {outfit.items.map(hanger => (
                                <View key={hanger.id} style={styles.hangerItem}>
                                    <Image source={hanger.image} style={styles.hangerImage} />
                                    <Text style={styles.hangerName}>{hanger.name}</Text>
                                </View>
                            ))}
                        </View>
                    </View>
                )}
                contentContainerStyle={styles.listContent}
            />
            <FloatingActionButton onPress={() => router.push('/addhanger')} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
        marginLeft: 16,
        marginTop: 16,
    },
    listContent: {
        paddingHorizontal: 8,
        paddingBottom: 16,
    },
    outfitCard: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 16,
        marginBottom: 14,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    outfitName: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 10,
    },
    itemsRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    hangerItem: {
        alignItems: 'center',
        marginRight: 18,
    },
    hangerImage: {
        width: 48,
        height: 48,
        borderRadius: 8,
        marginBottom: 4,
    },
    hangerName: {
        fontSize: 12,
        color: '#333',
        textAlign: 'center',
        maxWidth: 60,
    },
});
