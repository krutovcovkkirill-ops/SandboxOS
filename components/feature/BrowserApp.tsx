// Powered by OnSpace.AI
import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, radius, spacing, typography } from '@/constants/theme';

interface FakePage {
  title: string;
  domain: string;
  hero: string;
  body: string[];
}

const CATALOG: Record<string, FakePage> = {
  'sandbox://home': {
    title: 'SandboxNet Start',
    domain: 'sandbox://home',
    hero: 'The offline internet, curated.',
    body: [
      'This is a simulated browser inside SandboxOS. It renders a small catalog of preset pages so the sandbox stays 100% offline.',
      'Try visiting sandbox://news, sandbox://docs, or sandbox://about.',
    ],
  },
  'sandbox://news': {
    title: 'Daily Bytes',
    domain: 'sandbox://news',
    hero: 'On-device AI adoption climbs 400% in 12 months',
    body: [
      'A new wave of consumer devices ships with locally hosted 1B-3B parameter models. Battery life remains the primary bottleneck.',
      'SandboxOS demonstrates a lightweight containerized approach: apps see a virtual filesystem while the host phone remains untouched.',
    ],
  },
  'sandbox://docs': {
    title: 'SandboxOS Docs',
    domain: 'sandbox://docs',
    hero: 'Getting Started',
    body: [
      '1. Open Finder from the dock.',
      '2. Create folders and files inside your Documents.',
      '3. Ask the AI Assistant about any file - it can read your sandbox contents.',
      '4. Drag any window by its title bar to reposition.',
    ],
  },
  'sandbox://about': {
    title: 'About SandboxOS',
    domain: 'sandbox://about',
    hero: 'A tiny OS that lives inside your phone.',
    body: [
      'Every window, file, and setting exists only inside this app. Nothing touches the host filesystem.',
      'V1 focuses on the desktop shell. Future versions add themes, plugins, and third-party apps.',
    ],
  },
};

const START_PAGES = Object.keys(CATALOG);

export function BrowserApp() {
  const [url, setUrl] = useState('sandbox://home');
  const [displayed, setDisplayed] = useState('sandbox://home');
  const [loading, setLoading] = useState(false);

  const page = CATALOG[displayed];

  const go = (target?: string) => {
    const dest = (target || url).trim();
    setUrl(dest);
    setLoading(true);
    setTimeout(() => {
      setDisplayed(CATALOG[dest] ? dest : 'sandbox://home');
      if (!CATALOG[dest]) setUrl('sandbox://home');
      setLoading(false);
    }, 250);
  };

  return (
    <View style={styles.root}>
      <View style={styles.chrome}>
        <View style={styles.navBtns}>
          <MaterialIcons name="arrow-back-ios" size={12} color={colors.text.subtle} />
          <MaterialIcons name="arrow-forward-ios" size={12} color={colors.text.subtle} />
          <Pressable onPress={() => go(displayed)} hitSlop={6}>
            <MaterialIcons name="refresh" size={14} color={colors.text.primary} />
          </Pressable>
        </View>
        <TextInput
          value={url}
          onChangeText={setUrl}
          onSubmitEditing={() => go()}
          returnKeyType="go"
          placeholder="sandbox://"
          placeholderTextColor={colors.text.subtle}
          style={styles.address}
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>

      <View style={styles.tabsRow}>
        {START_PAGES.map((u) => (
          <Pressable
            key={u}
            onPress={() => go(u)}
            style={[styles.tab, displayed === u && styles.tabActive]}
          >
            <Text style={[styles.tabText, displayed === u && styles.tabTextActive]}>
              {u.replace('sandbox://', '')}
            </Text>
          </Pressable>
        ))}
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {loading ? (
          <Text style={styles.loading}>Loading...</Text>
        ) : (
          <>
            <Text style={styles.hero}>{page.hero}</Text>
            <Text style={styles.domain}>{page.domain}</Text>
            {page.body.map((p, i) => (
              <Text key={i} style={styles.paragraph}>
                {p}
              </Text>
            ))}
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  chrome: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.glass.borderSoft,
  },
  navBtns: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  address: {
    flex: 1,
    backgroundColor: colors.glass.soft,
    borderColor: colors.glass.borderSoft,
    borderWidth: 1,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    color: colors.text.primary,
    fontSize: 12,
  },
  tabsRow: {
    flexDirection: 'row',
    gap: 6,
    paddingVertical: spacing.sm,
    flexWrap: 'wrap',
  },
  tab: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.pill,
    backgroundColor: colors.glass.soft,
    borderWidth: 1,
    borderColor: colors.glass.borderSoft,
  },
  tabActive: { backgroundColor: colors.accent.primary, borderColor: colors.accent.primary },
  tabText: { color: colors.text.secondary, fontSize: 10, fontWeight: '600' },
  tabTextActive: { color: '#1B1B24' },
  content: { flex: 1, paddingTop: spacing.sm },
  hero: { color: colors.text.primary, ...typography.title, marginBottom: 4 },
  domain: { color: colors.accent.primary, fontSize: 11, marginBottom: spacing.sm },
  paragraph: {
    color: colors.text.secondary,
    ...typography.bodyRegular,
    fontSize: 13,
    marginBottom: spacing.sm,
  },
  loading: { color: colors.text.subtle, textAlign: 'center', marginTop: spacing.lg },
});
