import { theme } from '@/utils/theme';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { TextInput, TouchableOpacity, View } from 'react-native';

interface ChatInputProps {
  inputText: string;
  setInputText: (text: string) => void;
  onSend: () => void;
  isLoading: boolean;
  styles: any;
}

const ChatInput = ({ inputText, setInputText, onSend, isLoading, styles }: ChatInputProps) => {
  const isDisable = inputText.trim() === '' || isLoading;

  return (
    <View style={styles.inputAreaContainer}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Ask about crops, diseases..."
          placeholderTextColor={theme.colors.secondary}
          multiline
          maxLength={500}
        />
        <TouchableOpacity
          style={[styles.sendButton, isDisable && styles.sendButtonDisabled]}
          onPress={onSend}
          disabled={isDisable}
        >
          <Ionicons
            name="send"
            size={18}
            color={isDisable ? theme.colors.secondary : "#FFFFFF"}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ChatInput;