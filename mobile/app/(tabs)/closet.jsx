import React, { useState } from 'react';
import { StyleSheet, SectionList, Image } from 'react-native';
import { Text, View } from '@/components/Themed';
import { useRouter } from 'expo-router';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import FloatingActionButton from '@/components/FloatingActionButton';

// Mocked Hanger data
const defaultGroupBy = 'type'; // Change to 'tags' to group by tags
const mockHangers = [
    {
        id: '1',
        name: 'Blue Jeans',
        type: 'jeans',
        tags: ['casual', 'denim'],
        image: require('@/assets/images/icon.png'),
    },
    {
        id: '2',
        name: 'White T-Shirt',
        type: 't-shirt',
        tags: ['casual', 'cotton'],
        image: require('@/assets/images/icon.png'),
    },
    {
        id: '3',
        name: 'Black Blazer',
        type: 'blazer',
        tags: ['formal', 'jacket'],
        image: require('@/assets/images/icon.png'),
    },
    {
        id: '4',
        name: 'Red Dress',
        type: 'dress',
        tags: ['formal', 'evening'],
        image: require('@/assets/images/icon.png'),
    },
];

function groupHangersBy(hangers, groupBy) {
    if (groupBy === 'tags') {
        // Flatten all tags, then group
        const tagMap = {};
        hangers.forEach(hanger => {
            hanger.tags.forEach(tag => {
                if (!tagMap[tag]) tagMap[tag] = [];
                tagMap[tag].push(hanger);
            });
        });
        return Object.keys(tagMap).map(tag => ({
            title: tag,
            data: tagMap[tag],
        }));
    } else {
        // Group by type
        const typeMap = {};
        hangers.forEach(hanger => {
            if (!typeMap[hanger.type]) typeMap[hanger.type] = [];
            typeMap[hanger.type].push(hanger);
        });
        return Object.keys(typeMap).map(type => ({
            title: type,
            data: typeMap[type],
        }));
    }
}

export default function ClosetScreen() {
    const [groupBy, setGroupBy] = useState(defaultGroupBy);
    const sections = groupHangersBy(mockHangers, groupBy);
    const router = useRouter();
    return (
        <View style={styles.container}>
            <View style={styles.toggleRow}>
                <Text style={styles.toggleLabel}>Group by:</Text>
                <Text
                    style={[styles.toggleButton, groupBy === 'type' && styles.toggleButtonActive]}
                    onPress={() => setGroupBy('type')}
                >
                    Type
                </Text>
                <Text
                    style={[styles.toggleButton, groupBy === 'tags' && styles.toggleButtonActive]}
                    onPress={() => setGroupBy('tags')}
                >
                    Tags
                </Text>
            </View>
            <SectionList
                sections={sections}
                keyExtractor={item => item.id}
                renderSectionHeader={({ section: { title } }) => (
                    <Text style={styles.sectionHeader}>{title}</Text>
                )}
                renderItem={({ item }) => (
                    <View style={styles.itemRow}>
                        <Image source={item.image} style={styles.itemImage} />
                        <View style={styles.itemInfo}>
                            <Text style={styles.itemName}>{item.name}</Text>
                            <Text style={styles.itemType}>{item.type}</Text>
                            <Text style={styles.itemTags}>{item.tags.join(', ')}</Text>
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
        alignItems: 'stretch',
        justifyContent: 'center',
        backgroundColor: 'transparent',
    },
    listContent: {
        padding: 16,
    },
    sectionHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        backgroundColor: '#eee',
        paddingVertical: 4,
        paddingHorizontal: 8,
        marginTop: 12,
        borderRadius: 4,
    },
    itemRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        marginVertical: 6,
        padding: 10,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    itemImage: {
        width: 48,
        height: 48,
        borderRadius: 8,
        marginRight: 12,
    },
    itemInfo: {
        flex: 1,
    },
    itemName: {
        fontSize: 16,
        fontWeight: '600',
    },
    itemType: {
        fontSize: 14,
        color: '#888',
    },
    itemTags: {
        fontSize: 12,
        color: '#aaa',
    },
    toggleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        marginHorizontal: 8,
    },
    toggleLabel: {
        fontSize: 16,
        marginRight: 8,
    },
    toggleButton: {
        fontSize: 16,
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 6,
        backgroundColor: '#eee',
        marginRight: 8,
        color: '#333',
    },
    toggleButtonActive: {
        backgroundColor: '#333',
        color: '#fff',
    },
});
