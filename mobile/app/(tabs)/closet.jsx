import React, { useState, useEffect } from 'react';
import { StyleSheet, SectionList, Image as RNImage } from 'react-native';
import { Text, View } from '@/components/Themed';
import { useRouter } from 'expo-router';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import FloatingActionButton from '@/components/FloatingActionButton';
import { useAuth } from '@/components/useAuth';
import Image from '@/components/Image';

// Grouping logic remains the same
const defaultGroupBy = 'type'; // Change to 'tags' to group by tags
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
    const [hangers, setHangers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const router = useRouter();
    const { fetch } = useAuth();

    useEffect(() => {
        let isMounted = true;
        setLoading(true);
        setError(null);
        fetch('http://localhost:7777/api/hangers')
            .then(async (res) => {
                if (!res.ok) throw new Error(await res.text() || 'Failed to fetch hangers');
                return res.json();
            })
            .then(data => {
                if (isMounted) setHangers(data);
            })
            .catch(err => {
                if (isMounted) setError(err.message);
            })
            .finally(() => {
                if (isMounted) setLoading(false);
            });
        return () => { isMounted = false; };
    }, [fetch]);

    // Add fallback for missing tags/images
    const hangersWithDefaults = hangers.map(h => ({
        ...h,
        tags: h.tags || (h.aiNotes && h.aiNotes.tags) || [],
        image: h.frontImageId ? { uri: `http://localhost:7777/api/images/${h.frontImageId}/view` } : require('@/assets/images/icon.png'),
    }));
    const sections = groupHangersBy(hangersWithDefaults, groupBy);

    if (loading) {
        return <View style={styles.container}><Text>Loading...</Text></View>;
    }
    if (error) {
        return <View style={styles.container}><Text style={{ color: 'red' }}>Error: {error}</Text></View>;
    }
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
                        <Image imageId={item.frontImageId} style={styles.itemImage} />
                        <View style={styles.itemInfo}>
                            <Text style={styles.itemName}>{item.name}</Text>
                            <Text style={styles.itemType}>{item.type}</Text>
                            <Text style={styles.itemTags}>{(item.tags || []).join(', ')}</Text>
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
        padding: 8,
        backgroundColor: '#f5f5f5',
        flexDirection: 'row',
        alignItems: 'center',
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
