// Powered by OnSpace.AI
import React, { createContext, ReactNode, useCallback, useMemo, useState } from 'react';
import {
  createFile as svcCreateFile,
  createFolder as svcCreateFolder,
  deleteNode as svcDelete,
  renameNode as svcRename,
  seedVFS,
  updateFile as svcUpdateFile,
  VFSNode,
} from '@/services/vfsService';

interface VFSContextValue {
  nodes: VFSNode[];
  createFolder: (parentId: string, name: string) => void;
  createFile: (parentId: string, name: string, content: string) => string;
  updateFile: (id: string, content: string) => void;
  renameNode: (id: string, name: string) => void;
  deleteNode: (id: string) => void;
}

export const VFSContext = createContext<VFSContextValue | undefined>(undefined);

export function VFSProvider({ children }: { children: ReactNode }) {
  const [nodes, setNodes] = useState<VFSNode[]>(() => seedVFS());

  const createFolder = useCallback((parentId: string, name: string) => {
    setNodes((prev) => svcCreateFolder(prev, parentId, name));
  }, []);

  const createFile = useCallback((parentId: string, name: string, content: string) => {
    let newId = '';
    setNodes((prev) => {
      const result = svcCreateFile(prev, parentId, name, content);
      newId = result.id;
      return result.nodes;
    });
    return newId;
  }, []);

  const updateFile = useCallback((id: string, content: string) => {
    setNodes((prev) => svcUpdateFile(prev, id, content));
  }, []);

  const renameNode = useCallback((id: string, name: string) => {
    setNodes((prev) => svcRename(prev, id, name));
  }, []);

  const deleteNode = useCallback((id: string) => {
    setNodes((prev) => svcDelete(prev, id));
  }, []);

  const value = useMemo<VFSContextValue>(
    () => ({ nodes, createFolder, createFile, updateFile, renameNode, deleteNode }),
    [nodes, createFolder, createFile, updateFile, renameNode, deleteNode]
  );

  return <VFSContext.Provider value={value}>{children}</VFSContext.Provider>;
}
