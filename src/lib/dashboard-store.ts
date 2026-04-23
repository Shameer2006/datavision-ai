// ============================================================
// Dashboard store — localStorage-based persistence for dashboards
// ============================================================

import type { DashboardData } from "./types";

const STORAGE_KEY = "datavision_dashboards";

/**
 * Save a dashboard to localStorage. Returns the dashboard ID.
 */
export function saveDashboard(data: DashboardData): string {
  if (typeof window === "undefined") return data.id;

  const stored = getAllDashboards();
  stored[data.id] = data;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
  } catch {
    // If localStorage is full, remove oldest dashboards
    const ids = Object.keys(stored).sort(
      (a, b) =>
        new Date(stored[a].createdAt).getTime() -
        new Date(stored[b].createdAt).getTime()
    );
    // Keep only the 10 most recent
    while (ids.length > 10) {
      const oldId = ids.shift();
      if (oldId) delete stored[oldId];
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
  }

  return data.id;
}

/**
 * Get a dashboard by ID from localStorage.
 */
export function getDashboard(id: string): DashboardData | null {
  if (typeof window === "undefined") return null;

  const stored = getAllDashboards();
  return stored[id] || null;
}

/**
 * List all stored dashboards (id, title, createdAt).
 */
export function listDashboards(): Array<{
  id: string;
  title: string;
  createdAt: string;
}> {
  if (typeof window === "undefined") return [];

  const stored = getAllDashboards();
  return Object.values(stored)
    .map((d) => ({
      id: d.id,
      title: d.title,
      createdAt: d.createdAt,
    }))
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
}

function getAllDashboards(): Record<string, DashboardData> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}
