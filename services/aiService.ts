// Powered by OnSpace.AI
// Mocked "on-device" AI: templated responses with optional VFS-aware answers.

import { VFSNode, findNode, searchFiles } from './vfsService';

export interface AIMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  createdAt: number;
}

const templates = {
  greeting: [
    'Welcome. I am running locally inside SandboxOS. Ask me anything, or point me at a file.',
    'Hi. All my inference happens on-device. What would you like to do?',
  ],
  unknown: [
    'I can help with notes, files, and general questions. Try asking about README.txt or ideas.txt.',
    'Interesting. I am a lightweight 1.5B model, so I keep answers short and grounded in your sandbox.',
  ],
  createFolder: 'Folder created inside your Documents. You can rename it from the File Manager.',
  writeLetter:
    'Draft ready. I opened Notes with a starter template - customize the tone and hit Save.',
};

const pick = (arr: string[]): string => arr[Math.floor(Math.random() * arr.length)];

export function detectIntent(text: string): 'greet' | 'folder' | 'letter' | 'search' | 'default' {
  const t = text.toLowerCase();
  if (/(hi|hello|hey|start)/.test(t)) return 'greet';
  if (/(create|new).*folder/.test(t)) return 'folder';
  if (/(write|draft).*(letter|note|email)/.test(t)) return 'letter';
  if (/(find|search|about|explain|what|show).*/.test(t)) return 'search';
  return 'default';
}

export async function generateResponse(
  prompt: string,
  nodes: VFSNode[],
  contextFileId?: string | null
): Promise<string> {
  // Simulate on-device latency (streaming would go here in real llama.cpp).
  await new Promise((r) => setTimeout(r, 420));

  const intent = detectIntent(prompt);

  if (intent === 'greet') return pick(templates.greeting);
  if (intent === 'folder') return templates.createFolder;
  if (intent === 'letter') return templates.writeLetter;

  if (contextFileId) {
    const f = findNode(nodes, contextFileId);
    if (f && f.type === 'file' && f.content) {
      const excerpt = f.content.split('\n').slice(0, 4).join(' ').slice(0, 220);
      return `Based on "${f.name}": ${excerpt}${excerpt.length >= 220 ? '...' : ''}`;
    }
  }

  if (intent === 'search') {
    const hits = searchFiles(nodes, prompt.replace(/[?.!,]/g, ''));
    if (hits.length > 0) {
      const first = hits[0];
      const excerpt = (first.content || '').split('\n').slice(0, 3).join(' ').slice(0, 180);
      return `Found ${hits.length} match(es). Top result "${first.name}": ${excerpt}`;
    }
  }

  return pick(templates.unknown);
}

export function seedMessages(): AIMessage[] {
  return [
    {
      id: 'sys_1',
      role: 'assistant',
      content:
        'SandboxOS Assistant ready. I run 100% offline with a mocked 1.5B model. Try "explain README.txt".',
      createdAt: Date.now(),
    },
  ];
}
