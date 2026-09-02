// Powered by OnSpace.AI
import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Wallpaper } from './Wallpaper';
import { MenuBar } from './MenuBar';
import { Dock } from './Dock';
import { Window } from '@/components/ui/Window';
import { DesktopIcon } from '@/components/feature/DesktopIcon';
import { AIAssistant } from '@/components/feature/AIAssistant';
import { NotesApp } from '@/components/feature/NotesApp';
import { FileManager } from '@/components/feature/FileManager';
import { BrowserApp } from '@/components/feature/BrowserApp';
import { useWindows } from '@/hooks/useWindows';
import { AppKind } from '@/contexts/WindowContext';
import { spacing } from '@/constants/theme';

function renderApp(app: AppKind) {
  switch (app) {
    case 'ai':
      return <AIAssistant />;
    case 'notes':
      return <NotesApp />;
    case 'files':
      return <FileManager />;
    case 'browser':
      return <BrowserApp />;
  }
}

export function Desktop() {
  const { windows } = useWindows();
  const insets = useSafeAreaInsets();
  const { width, height } = Dimensions.get('window');

  return (
    <View style={styles.root}>
      <Wallpaper />
      <View style={{ paddingTop: insets.top }}>
        <MenuBar />
      </View>

      <View style={styles.iconsColumn}>
        <DesktopIcon app="files" label="Finder" icon="folder" color="#7CC5FF" />
        <DesktopIcon app="notes" label="Notes" icon="edit-note" color="#FFB84D" />
        <DesktopIcon app="ai" label="AI" icon="auto-awesome" color="#C56BA3" />
        <DesktopIcon app="browser" label="Web" icon="public" color="#7CE7B2" />
      </View>

      {windows.map((w) => (
        <Window key={w.id} win={w} screenWidth={width} screenHeight={height}>
          {renderApp(w.app)}
        </Window>
      ))}

      <Dock bottomInset={insets.bottom} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  iconsColumn: {
    position: 'absolute',
    top: 60,
    right: spacing.md,
    alignItems: 'center',
  },
});
