import React from 'react';
import { StyleSheet, FlatList, View } from 'react-native';
import { Text } from '@/components/Themed';
import { Ionicons } from '@expo/vector-icons';

// Mocked email promo offers data
const mockOffers = [
  {
    id: '1',
    sender: 'Levi’s',
    subject: '20% Off All Jeans – This Weekend Only!',
    fits: 'green', // good fit
  },
  {
    id: '2',
    sender: 'Uniqlo',
    subject: 'New Arrivals: Summer Tees',
    fits: 'yellow', // maybe
  },
  {
    id: '3',
    sender: 'Nordstrom',
    subject: 'Formalwear Sale: Blazers & Dresses',
    fits: 'red', // not a fit
  },
  {
    id: '4',
    sender: 'Zara',
    subject: 'Evening Dresses for Less',
    fits: 'yellow',
  },
  {
    id: '5',
    sender: 'Gap',
    subject: 'Buy 1 Get 1 Free: T-Shirts',
    fits: 'green',
  },
];

function getFitIcon(fits) {
  if (fits === 'green') return <Ionicons name="checkmark-circle" size={22} color="#3CB371" style={{marginRight: 8}} />;
  if (fits === 'yellow') return <Ionicons name="alert-circle" size={22} color="#FFD700" style={{marginRight: 8}} />;
  return <Ionicons name="close-circle" size={22} color="#FF6347" style={{marginRight: 8}} />;
}

export default function OffersInboxScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Offers Inbox</Text>
      <FlatList
        data={mockOffers}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.offerRow}>
            {getFitIcon(item.fits)}
            <View style={styles.offerInfo}>
              <Text style={styles.sender}>{item.sender}</Text>
              <Text style={styles.subject}>{item.subject}</Text>
            </View>
          </View>
        )}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    paddingTop: 24,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    marginLeft: 16,
  },
  listContent: {
    paddingHorizontal: 8,
    paddingBottom: 16,
  },
  offerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginVertical: 6,
    padding: 14,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  offerInfo: {
    flex: 1,
  },
  sender: {
    fontSize: 16,
    fontWeight: '600',
  },
  subject: {
    fontSize: 14,
    color: '#555',
    marginTop: 2,
  },
});
