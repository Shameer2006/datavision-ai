import { Message } from "@/components/chat/message-bubble";

const STORAGE_KEY = "datavision_chats";
const ACTIVE_CHAT_KEY = "datavision_active_chat";

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  cachedSchema: string;
  cachedDfJson: string;
  createdAt: number;
  updatedAt: number;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function readAll(): Conversation[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeAll(conversations: Conversation[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/** Get every conversation, sorted newest-updated first. */
export function getAllConversations(): Conversation[] {
  return readAll().sort((a, b) => b.updatedAt - a.updatedAt);
}

/** Get a single conversation by id. */
export function getConversation(id: string): Conversation | undefined {
  return readAll().find((c) => c.id === id);
}

/** Create a brand-new conversation and return it. */
export function createConversation(): Conversation {
  const conv: Conversation = {
    id: crypto.randomUUID(),
    title: "New chat",
    messages: [],
    cachedSchema: "",
    cachedDfJson: "",
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
  const all = readAll();
  all.unshift(conv);
  writeAll(all);
  return conv;
}

/** Derive a short title from the first user message. */
function deriveTitle(messages: Message[]): string {
  const first = messages.find((m) => m.role === "user");
  if (!first) return "New chat";
  const text = first.content.trim();
  return text.length > 50 ? text.slice(0, 47) + "…" : text;
}

/** Save (upsert) a conversation. Auto-derives title from first user msg. */
export function saveConversation(conv: Conversation): void {
  conv.updatedAt = Date.now();
  conv.title = deriveTitle(conv.messages);
  const all = readAll();
  const idx = all.findIndex((c) => c.id === conv.id);
  if (idx >= 0) {
    all[idx] = conv;
  } else {
    all.unshift(conv);
  }
  writeAll(all);
}

/** Delete a conversation. */
export function deleteConversation(id: string): void {
  writeAll(readAll().filter((c) => c.id !== id));
}

/** Get/set the active conversation id. */
export function getActiveChatId(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(ACTIVE_CHAT_KEY);
}

export function setActiveChatId(id: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(ACTIVE_CHAT_KEY, id);
}

// ---------------------------------------------------------------------------
// Grouping helper for the sidebar
// ---------------------------------------------------------------------------

export interface GroupedConversations {
  label: string;
  items: Conversation[];
}

export function groupConversationsByDate(): GroupedConversations[] {
  const all = getAllConversations();
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const yesterday = today - 86_400_000;
  const sevenDaysAgo = today - 7 * 86_400_000;

  const groups: Record<string, Conversation[]> = {
    Today: [],
    Yesterday: [],
    "Previous 7 Days": [],
    Older: [],
  };

  for (const conv of all) {
    if (conv.updatedAt >= today) groups.Today.push(conv);
    else if (conv.updatedAt >= yesterday) groups.Yesterday.push(conv);
    else if (conv.updatedAt >= sevenDaysAgo) groups["Previous 7 Days"].push(conv);
    else groups.Older.push(conv);
  }

  return Object.entries(groups)
    .filter(([, items]) => items.length > 0)
    .map(([label, items]) => ({ label, items }));
}
