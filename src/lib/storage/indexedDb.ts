import { openDB, DBSchema } from "idb";
import { GDReport } from "../types/report";

interface GDArenaDB extends DBSchema {
  reports: {
    key: string;
    value: GDReport;
    indexes: { "by-date": string };
  };
}

const DB_NAME = "gd-arena-storage";
const DB_VERSION = 1;

async function getDB() {
  return openDB<GDArenaDB>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains("reports")) {
        const store = db.createObjectStore("reports", { keyPath: "sessionId" });
        store.createIndex("by-date", "createdAt");
      }
    },
  });
}

export async function saveReportToHistory(report: GDReport): Promise<void> {
  if (typeof window === "undefined") return;
  const db = await getDB();
  await db.put("reports", report);
}

export async function getAllReportsFromHistory(): Promise<GDReport[]> {
  if (typeof window === "undefined") return [];
  const db = await getDB();
  return db.getAllFromIndex("reports", "by-date");
}

export async function getReportById(sessionId: string): Promise<GDReport | undefined> {
  if (typeof window === "undefined") return undefined;
  const db = await getDB();
  return db.get("reports", sessionId);
}
