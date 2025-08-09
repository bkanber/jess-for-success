import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, TextInput, FlatList, KeyboardAvoidingView, Platform, TouchableOpacity, Keyboard } from 'react-native';
import { Text, View } from '@/components/Themed';

const MOCK_MESSAGES = [
    { id: '1', sender: 'jess', text: 'Hi! I’m Jess, your personal stylist. How can I help you today?' },
    { id: '2', sender: 'user', text: 'Hi Jess! Can you suggest an outfit for a summer party?' },
    { id: '3', sender: 'jess', text: 'Absolutely! Do you prefer something casual or a bit more formal?' },
];

export default function JessChatScreen() {
    const [messages, setMessages] = useState(MOCK_MESSAGES);
    const [input, setInput] = useState('');
    const flatListRef = useRef(null);

    useEffect(() => {
        if (flatListRef.current && messages.length > 0) {
            flatListRef.current.scrollToEnd({ animated: true });
        }
    }, [messages]);

    const handleSend = () => {
        if (input.trim() === '') return;
        setMessages(prev => [
            ...prev,
            { id: String(Date.now()), sender: 'user', text: input }
        ]);
        setInput('');
        Keyboard.dismiss();
    };

    const renderItem = ({ item }) => (
        <View style={[styles.bubble, item.sender === 'jess' ? styles.jessBubble : styles.userBubble]}>
            <Text style={item.sender === 'jess' ? styles.jessText : styles.userText}>{item.text}</Text>
        </View>
    );

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={80}
        >
            <FlatList
                ref={flatListRef}
                data={messages}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.chatContent}
            />
            <View style={styles.inputRow}>
                <TextInput
                    style={styles.input}
                    value={input}
                    onChangeText={setInput}
                    placeholder="Type your message..."
                    placeholderTextColor="#aaa"
                    onSubmitEditing={handleSend}
                    returnKeyType="send"
                />
                <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
                    <Text style={styles.sendButtonText}>Send</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    chatContent: {
        padding: 16,
        paddingBottom: 80,
    },
    bubble: {
        maxWidth: '80%',
        padding: 12,
        borderRadius: 18,
        marginBottom: 10,
    },
    jessBubble: {
        alignSelf: 'flex-start',
        backgroundColor: '#e6e6fa',
        borderTopLeftRadius: 4,
    },
    userBubble: {
        alignSelf: 'flex-end',
        backgroundColor: '#333',
        borderTopRightRadius: 4,
    },
    jessText: {
        color: '#333',
    },
    userText: {
        color: '#fff',
    },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderTopWidth: 1,
        borderColor: '#eee',
        backgroundColor: '#fff',
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
    },
    input: {
        flex: 1,
        height: 40,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 20,
        paddingHorizontal: 16,
        marginRight: 8,
        backgroundColor: '#f9f9f9',
        color: '#333',
    },
    sendButton: {
        backgroundColor: '#333',
        borderRadius: 20,
        paddingHorizontal: 18,
        paddingVertical: 8,
    },
    sendButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});
