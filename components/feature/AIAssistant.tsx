// Powered by OnSpace.AI
import React, { useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, radius, spacing, typography } from '@/constants/theme';
import { AIMessage, generateResponse, seedMessages } from '@/services/aiService';
import { useVFS } from '@/hooks/useVFS';

export function AIAssistant() {
  const { nodes } = useVFS();
  const [messages, setMessages] = useState<AIMessage[]>(() => seedMessages());
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);

  const suggestions = useMemo(
    () => ['Explain README.txt', 'Create folder', 'Draft a letter', 'Search ideas'],
    []
  );

  const send = async (text?: string) => {
    const value = (text || input).trim();
    if (!value || busy) return;
    const user: AIMessage = {
      id: 'u_' + Date.now(),
      role: 'user',
      content: value,
      createdAt: Date.now(),
    };
    setMessages((prev) => [...prev, user]);
    setInput('');
    setBusy(true);
    const reply = await generateResponse(value, nodes);
    const assistant: AIMessage = {
      id: 'a_' + Date.now(),
      role: 'assistant',
      content: reply,
      createdAt: Date.now(),
    };
    setMessages((prev) => [...prev, assistant]);
    setBusy(false);
  };

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <MaterialIcons name="auto-awesome" size={16} color={colors.text.primary} />
        <Text style={styles.headerText}>Local 1.5B  ·  Offline</Text>
      </View>
      <FlatList
        data={messages}
        keyExtractor={(m) => m.id}
        contentContainerStyle={{ paddingVertical: spacing.sm, gap: spacing.sm }}
        renderItem={({ item }) => (
          <View
            style={[
              styles.bubble,
              item.role === 'user' ? styles.userBubble : styles.aiBubble,
            ]}
          >
            <Text style={item.role === 'user' ? styles.userText : styles.aiText}>
              {item.content}
            </Text>
          </View>
        )}
      />
      <View style={styles.suggRow}>
        {suggestions.map((s) => (
          <Pressable key={s} onPress={() => send(s)} style={styles.sugg}>
            <Text style={styles.suggText}>{s}</Text>
          </Pressable>
        ))}
      </View>
      <View style={styles.inputRow}>
        <TextInput
          value={input}
          onChangeText={setInput}
          placeholder={busy ? 'Thinking...' : 'Ask anything'}
          placeholderTextColor={colors.text.subtle}
          style={styles.input}
          editable={!busy}
          onSubmitEditing={() => send()}
          returnKeyType="send"
        />
        <Pressable
          onPress={() => send()}
          style={[styles.sendBtn, { opacity: busy || !input ? 0.5 : 1 }]}
          disabled={busy || !input}
        >
          <MaterialIcons name="arrow-upward" size={18} color="#1B1B24" />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.glass.borderSoft,
  },
  headerText: { color: colors.text.secondary, ...typography.caption },
  bubble: {
    maxWidth: '86%',
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: colors.accent.primary,
  },
  aiBubble: {
    alignSelf: 'flex-start',
    backgroundColor: colors.glass.medium,
    borderWidth: 1,
    borderColor: colors.glass.borderSoft,
  },
  userText: { color: '#1B1B24', ...typography.bodyRegular },
  aiText: { color: colors.text.primary, ...typography.bodyRegular },
  suggRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    paddingVertical: spacing.sm,
  },
  sugg: {
    backgroundColor: colors.glass.soft,
    borderColor: colors.glass.borderSoft,
    borderWidth: 1,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.pill,
  },
  suggText: { color: colors.text.secondary, fontSize: 11 },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.glass.borderSoft,
  },
  input: {
    flex: 1,
    backgroundColor: colors.glass.soft,
    borderColor: colors.glass.borderSoft,
    borderWidth: 1,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: 8,
    color: colors.text.primary,
    ...typography.bodyRegular,
  },
  sendBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.accent.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
