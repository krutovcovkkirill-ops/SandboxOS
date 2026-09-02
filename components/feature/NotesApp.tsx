// Powered by OnSpace.AI
import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, radius, spacing, typography } from '@/constants/theme';
import { useVFS } from '@/hooks/useVFS';
import { useAlert } from '@/template';
import { VFSNode } from '@/services/vfsService';

export function NotesApp() {
  const { nodes, createFile, updateFile, deleteNode } = useVFS();
  const { showAlert } = useAlert();

  const notesFolder = useMemo(() => {
    const docs = nodes.find((n) => n.id === 'documents');
    return docs ? docs.id : 'root';
  }, [nodes]);

  const noteFiles = useMemo<VFSNode[]>(
    () => nodes.filter((n) => n.type === 'file' && n.name.match(/\.(txt|md)$/i)),
    [nodes]
  );

  const [activeId, setActiveId] = useState<string | null>(noteFiles[0]?.id || null);
  const active = noteFiles.find((n) => n.id === activeId) || null;
  const [draft, setDraft] = useState(active?.content || '');
  const [title, setTitle] = useState(active?.name || '');

  React.useEffect(() => {
    if (active) {
      setDraft(active.content || '');
      setTitle(active.name);
    }
  }, [activeId]);

  const handleNew = () => {
    const id = createFile(notesFolder, 'Untitled.txt', '');
    setActiveId(id);
  };

  const handleSave = () => {
    if (!active) return;
    updateFile(active.id, draft);
    showAlert('Saved', active.name + ' updated in Documents.');
  };

  const handleDelete = () => {
    if (!active) return;
    showAlert('Delete note?', active.name, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          deleteNode(active.id);
          setActiveId(null);
        },
      },
    ]);
  };

  return (
    <View style={styles.root}>
      <View style={styles.sidebar}>
        <View style={styles.sidebarHeader}>
          <Text style={styles.sideTitle}>Notes</Text>
          <Pressable onPress={handleNew} hitSlop={8}>
            <MaterialIcons name="add" size={18} color={colors.text.primary} />
          </Pressable>
        </View>
        <ScrollView showsVerticalScrollIndicator={false}>
          {noteFiles.length === 0 ? (
            <Text style={styles.empty}>No notes yet</Text>
          ) : (
            noteFiles.map((n) => (
              <Pressable
                key={n.id}
                onPress={() => setActiveId(n.id)}
                style={[
                  styles.noteItem,
                  activeId === n.id && styles.noteItemActive,
                ]}
              >
                <Text style={styles.noteName} numberOfLines={1}>
                  {n.name}
                </Text>
                <Text style={styles.noteSize}>{n.size} B</Text>
              </Pressable>
            ))
          )}
        </ScrollView>
      </View>
      <View style={styles.editor}>
        {active ? (
          <>
            <TextInput
              value={title}
              onChangeText={setTitle}
              style={styles.titleInput}
              placeholderTextColor={colors.text.subtle}
            />
            <TextInput
              value={draft}
              onChangeText={setDraft}
              multiline
              placeholder="Start typing..."
              placeholderTextColor={colors.text.subtle}
              style={styles.body}
            />
            <View style={styles.actions}>
              <Pressable onPress={handleDelete} style={styles.btnGhost}>
                <MaterialIcons name="delete" size={14} color={colors.text.primary} />
                <Text style={styles.btnText}>Delete</Text>
              </Pressable>
              <Pressable onPress={handleSave} style={styles.btnPrimary}>
                <MaterialIcons name="save" size={14} color="#1B1B24" />
                <Text style={styles.btnTextDark}>Save</Text>
              </Pressable>
            </View>
          </>
        ) : (
          <View style={styles.emptyState}>
            <MaterialIcons name="edit-note" size={40} color={colors.text.subtle} />
            <Text style={styles.emptyStateText}>Select or create a note</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, flexDirection: 'row', gap: spacing.sm },
  sidebar: {
    width: 110,
    borderRightWidth: 1,
    borderRightColor: colors.glass.borderSoft,
    paddingRight: spacing.sm,
  },
  sidebarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  sideTitle: { color: colors.text.primary, ...typography.caption, fontWeight: '700' },
  empty: { color: colors.text.subtle, ...typography.caption, marginTop: 8 },
  noteItem: {
    paddingVertical: 6,
    paddingHorizontal: 6,
    borderRadius: radius.sm,
    marginBottom: 4,
  },
  noteItemActive: {
    backgroundColor: colors.glass.medium,
    borderWidth: 1,
    borderColor: colors.glass.borderSoft,
  },
  noteName: { color: colors.text.primary, fontSize: 12, fontWeight: '600' },
  noteSize: { color: colors.text.subtle, fontSize: 10, marginTop: 2 },
  editor: { flex: 1 },
  titleInput: {
    color: colors.text.primary,
    ...typography.title,
    marginBottom: 6,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: colors.glass.borderSoft,
  },
  body: {
    flex: 1,
    color: colors.text.primary,
    ...typography.bodyRegular,
    textAlignVertical: 'top',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.glass.borderSoft,
  },
  btnGhost: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: radius.pill,
    backgroundColor: colors.glass.soft,
    borderWidth: 1,
    borderColor: colors.glass.borderSoft,
  },
  btnPrimary: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radius.pill,
    backgroundColor: colors.accent.primary,
  },
  btnText: { color: colors.text.primary, fontSize: 12, fontWeight: '600' },
  btnTextDark: { color: '#1B1B24', fontSize: 12, fontWeight: '700' },
  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 8 },
  emptyStateText: { color: colors.text.subtle, ...typography.caption },
});
