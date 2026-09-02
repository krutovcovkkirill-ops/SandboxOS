// Powered by OnSpace.AI
// Virtual File System - purely in-memory mock of a sandbox filesystem.

export type VFSNodeType = 'folder' | 'file';

export interface VFSNode {
  id: string;
  name: string;
  type: VFSNodeType;
  parentId: string | null;
  content?: string;
  createdAt: number;
  updatedAt: number;
  size: number;
}

const now = () => Date.now();

const uid = () => {
  const rand = Math.random().toString(36).slice(2, 9);
  return 'n_' + Date.now().toString(36) + '_' + rand;
};

export function seedVFS(): VFSNode[] {
  const rootDesktop: VFSNode = {
    id: 'root',
    name: 'Desktop',
    type: 'folder',
    parentId: null,
    createdAt: now(),
    updatedAt: now(),
    size: 0,
  };
  const docs: VFSNode = {
    id: 'documents',
    name: 'Documents',
    type: 'folder',
    parentId: 'root',
    createdAt: now(),
    updatedAt: now(),
    size: 0,
  };
  const projects: VFSNode = {
    id: 'projects',
    name: 'Projects',
    type: 'folder',
    parentId: 'root',
    createdAt: now(),
    updatedAt: now(),
    size: 0,
  };
  const readme: VFSNode = {
    id: 'readme',
    name: 'README.txt',
    type: 'file',
    parentId: 'root',
    createdAt: now(),
    updatedAt: now(),
    size: 320,
    content:
      'Welcome to SandboxOS.\n\nThis is a lightweight OS simulation running inside your phone.\nOpen the AI Assistant to ask questions about any file in this sandbox.\n\nTip: Drag windows by their title bar. Tap the red dot to close.',
  };
  const notes: VFSNode = {
    id: 'notes1',
    name: 'ideas.txt',
    type: 'file',
    parentId: 'documents',
    createdAt: now(),
    updatedAt: now(),
    size: 128,
    content:
      'Ideas for SandboxOS v2:\n- Multi-desktop workspaces\n- Terminal emulator\n- Local RAG over PDFs\n- Themed cursor animations',
  };
  const roadmap: VFSNode = {
    id: 'roadmap',
    name: 'roadmap.md',
    type: 'file',
    parentId: 'projects',
    createdAt: now(),
    updatedAt: now(),
    size: 200,
    content:
      '# Roadmap\n\n1. Window manager\n2. VFS mock\n3. AI Assistant\n4. Custom themes\n5. Plugin apps',
  };
  return [rootDesktop, docs, projects, readme, notes, roadmap];
}

export function listChildren(nodes: VFSNode[], parentId: string): VFSNode[] {
  return nodes
    .filter((n) => n.parentId === parentId)
    .sort((a, b) => {
      if (a.type !== b.type) return a.type === 'folder' ? -1 : 1;
      return a.name.localeCompare(b.name);
    });
}

export function findNode(nodes: VFSNode[], id: string): VFSNode | undefined {
  return nodes.find((n) => n.id === id);
}

export function pathOf(nodes: VFSNode[], id: string): VFSNode[] {
  const chain: VFSNode[] = [];
  let cursor = findNode(nodes, id);
  while (cursor) {
    chain.unshift(cursor);
    cursor = cursor.parentId ? findNode(nodes, cursor.parentId) : undefined;
  }
  return chain;
}

export function createFolder(nodes: VFSNode[], parentId: string, name: string): VFSNode[] {
  const node: VFSNode = {
    id: uid(),
    name: name.trim() || 'Untitled Folder',
    type: 'folder',
    parentId,
    createdAt: now(),
    updatedAt: now(),
    size: 0,
  };
  return [...nodes, node];
}

export function createFile(
  nodes: VFSNode[],
  parentId: string,
  name: string,
  content: string
): { nodes: VFSNode[]; id: string } {
  const id = uid();
  const node: VFSNode = {
    id,
    name: name.trim() || 'Untitled.txt',
    type: 'file',
    parentId,
    createdAt: now(),
    updatedAt: now(),
    size: content.length,
    content,
  };
  return { nodes: [...nodes, node], id };
}

export function updateFile(nodes: VFSNode[], id: string, content: string): VFSNode[] {
  return nodes.map((n) =>
    n.id === id
      ? { ...n, content, size: content.length, updatedAt: now() }
      : n
  );
}

export function renameNode(nodes: VFSNode[], id: string, name: string): VFSNode[] {
  return nodes.map((n) => (n.id === id ? { ...n, name, updatedAt: now() } : n));
}

export function deleteNode(nodes: VFSNode[], id: string): VFSNode[] {
  const toDelete = new Set<string>([id]);
  let changed = true;
  while (changed) {
    changed = false;
    for (const n of nodes) {
      if (n.parentId && toDelete.has(n.parentId) && !toDelete.has(n.id)) {
        toDelete.add(n.id);
        changed = true;
      }
    }
  }
  return nodes.filter((n) => !toDelete.has(n.id));
}

export function searchFiles(nodes: VFSNode[], query: string): VFSNode[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return nodes.filter(
    (n) =>
      n.name.toLowerCase().includes(q) ||
      (n.type === 'file' && (n.content || '').toLowerCase().includes(q))
  );
}
