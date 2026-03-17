import { formatAIResponse } from '@/utils/formattedAiResonse';
import React from 'react';
import { Text, View } from 'react-native';

interface MessageProps {
  message: {
    id: string;
    text: string;
    isUser: boolean;
    timestamp: Date;
  };
  styles: any;
}

const ChatMessage = ({ message, styles }: MessageProps) => {
  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <View
      style={[
        styles.messageBubble,
        message.isUser ? styles.userBubble : styles.aiBubble,
      ]}
    >
      <Text style={[
        styles.messageText,
        message.isUser ? styles.userText : styles.aiText,
      ]}>
        {formatAIResponse(message.text)}
      </Text>
      <Text style={[
        styles.timestamp,
        message.isUser ? styles.userTimestamp : styles.aiTimestamp,
      ]}>
        {formatTime(message.timestamp)}
      </Text>
    </View>
  );
};

export default ChatMessage;