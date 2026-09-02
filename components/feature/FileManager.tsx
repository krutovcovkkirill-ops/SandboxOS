// Powered by OnSpace.AI
import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, radius, spacing, typography } from '@/constants/theme';
import { useVFS } from '@/hooks/useVFS';
import { listChildren, pathOf } from '@/services/vfsService';
import { useAlert } from '@/template';

export function FileManager() {
  const { nodes, createFolder, deleteNode } = useVFS();
  const { showAlert } = useAlert();
  const [cwd, setCwd] = useState<string>('root');
  const [selected, setSelected] = useState<string | null>(null);

  const children = useMemo(() => listChildren(nodes, cwd), [nodes, cwd]);
  const breadcrumb = useMemo(() => pathOf(nodes, cwd), [nodes, cwd]);
  const selectedNode = selected ? nodes.find((n) => n.id === selected) : null;

  const handleNewFolder = () => {
    createFolder(cwd, 'New Folder');
  };

  const handleDelete = () => {
    if (!selected || selected === 'root') return;
    showAlert('Delete item?', 'This is a sandbox action.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          deleteNode(selected);
          setSelected(null);
        },
      },
    ]);
  };

  return (
    <View style={styles.root}>
      <View style={styles.crumbBar}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.crumbRow}>
            {breadcrumb.map((n, idx) => (
              <React.Fragment key={n.id}>
                <Pressable onPress={() => setCwd(n.id)}>
                  <Text
                    style={[
                      styles.crumb,
                      idx === breadcrumb.length - 1 && styles.crumbActive,
                    ]}
                  >
                    {n.name}
                  </Text>
                </Pressable>
                {idx < breadcrumb.length - 1 ? (
                  <MaterialIcons
                    name="chevron-right"
                    size={14}
                    color={colors.text.subtle}
                  />
                ) : null}
              </React.Fragment>
            ))}
          </View>
        </ScrollView>
      </View>

      <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
        {children.length === 0 ? (
          <View style={styles.emptyState}>
            <MaterialIcons name="folder-open" size={38} color={colors.text.subtle} />
            <Text style={styles.emptyText}>Empty folder</Text>
          </View>
        ) : (
          children.map((n) => (
            <Pressable
              key={n.id}
              onPress={() => {
                setSelected(n.id);
                if (n.type === 'folder') setCwd(n.id);
              }}
              style={[
                styles.row,
                selected === n.id && styles.rowActive,
              ]}
            >
              <MaterialIcons
                name={n.type === 'folder' ? 'folder' : 'description'}
                size={20}
                color={n.type === 'folder' ? colors.accent.warning : colors.accent.primary}
              />
              <View style={{ flex: 1 }}>
                <Text style={styles.rowName} numberOfLines={1}>
                  {n.name}
                </Text>
                <Text style={styles.rowMeta}>
                  {n.type === 'folder' ? 'Folder' : (n.size + ' B')}
                </Text>
              </View>
              {n.type === 'folder' ? (
                <MaterialIcons name="chevron-right" size={16} color={colors.text.subtle} />
              ) : null}
            </Pressable>
          ))
        )}
      </ScrollView>

      {selectedNode && selectedNode.type === 'file' && selectedNode.content ? (
        <View style={styles.preview}>
          <Text style={styles.previewTitle} numberOfLines={1}>
            {selectedNode.name}
          </Text>
          <Text style={styles.previewBody} numberOfLines={3}>
            {selectedNode.content}
          </Text>
        </View>
      ) : null}

      <View style={styles.toolbar}>
        <Pressable onPress={handleNewFolder} style={styles.tool}>
          <MaterialIcons name="create-new-folder" size={14} color={colors.text.primary} />
          <Text style={styles.toolText}>New</Text>
        </Pressable>
        <Pressable
          onPress={handleDelete}
          style={[styles.tool, { opacity: selected && selected !== 'root' ? 1 : 0.4 }]}
        >
          <MaterialIcons name="delete" size={14} color={colors.text.primary} />
          <Text style={styles.toolText}>Delete</Text>
        </Pressable>
        <View style={{ flex: 1 }} />
        <Text style={styles.count}>{children.length} items</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  crumbBar: {
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.glass.borderSoft,
  },
  crumbRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  crumb: { color: colors.text.secondary, ...typography.caption },
  crumbActive: { color: colors.text.primary, fontWeight: '700' },
  list: { flex: 1, paddingVertical: 4 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: 8,
    paddingHorizontal: 6,
    borderRadius: radius.sm,
    marginVertical: 2,
  },
  rowActive: {
    backgroundColor: colors.glass.medium,
    borderWidth: 1,
    borderColor: colors.glass.borderSoft,
  },
  rowName: { color: colors.text.primary, fontSize: 13, fontWeight: '600' },
  rowMeta: { color: colors.text.subtle, fontSize: 10, marginTop: 1 },
  preview: {
    padding: spacing.sm,
    backgroundColor: colors.glass.soft,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.glass.borderSoft,
    marginBottom: spacing.sm,
  },
  previewTitle: { color: colors.text.primary, fontSize: 12, fontWeight: '700', marginBottom: 4 },
  previewBody: { color: colors.text.secondary, fontSize: 11, lineHeight: 15 },
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.glass.borderSoft,
  },
  tool: {
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
  toolText: { color: colors.text.primary, fontSize: 11, fontWeight: '600' },
  count: { color: colors.text.subtle, fontSize: 10 },
  emptyState: { alignItems: 'center', paddingVertical: spacing.xl, gap: 6 },
  emptyText: { color: colors.text.subtle, ...typography.caption },
});
