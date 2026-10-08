import { GDReport } from "../types/report";
import { UtteranceSegment, SessionConfig } from "../types/arena";
import { supabase, isSupabaseConfigured } from "../supabase/client";
import {
  saveReportToHistory as saveToIndexedDb,
  getAllReportsFromHistory as getFromIndexedDb,
  getReportById as getFromIndexedDbById,
} from "./indexedDb";

/**
 * Saves full session, utterance segments, and evaluation report to Supabase DB and local IndexedDB cache.
 */
export async function saveReport(
  report: GDReport,
  config?: Partial<SessionConfig>
): Promise<void> {
  // Always cache locally in IndexedDB first for instant UI response and offline safety
  await saveToIndexedDb(report);

  if (!isSupabaseConfigured || !supabase) {
    return;
  }

  try {
    // 1. Get current authenticated user if logged in
    const {
      data: { user },
    } = await supabase.auth.getUser().catch(() => ({ data: { user: null } }));

    const userId = user?.id || null;

    // 2. Upsert session record
    const { error: sessionError } = await supabase.from("sessions").upsert(
      {
        id: report.sessionId,
        user_id: userId,
        topic: report.topic,
        panel_size: config?.panelSize || 4,
        duration_seconds: report.durationSeconds,
        patience_ms: config?.patienceMs || 1200,
        is_text_fallback: config?.isTextFallback || false,
        created_at: report.createdAt,
        ended_at: new Date().toISOString(),
      },
      { onConflict: "id" }
    );

    if (sessionError) {
      console.warn("Supabase session insert warning:", sessionError.message);
    }

    // 3. Upsert report record
    const { error: reportError } = await supabase.from("reports").insert({
      session_id: report.sessionId,
      user_id: userId,
      topic: report.topic,
      duration_seconds: report.durationSeconds,
      stats: report.stats,
      dimensions: report.dimensions,
      missed_openings: report.missed_openings || [],
      top_3_actions: report.top_3_actions || [],
      transcript: report.transcript || [],
      created_at: report.createdAt,
    });

    if (reportError) {
      console.warn("Supabase report insert warning:", reportError.message);
    }

    // 4. Batch insert utterance segments if transcript is present
    if (report.transcript && report.transcript.length > 0) {
      const segmentRows = report.transcript.map((seg: UtteranceSegment) => ({
        session_id: report.sessionId,
        speaker_id: seg.speakerId,
        speaker_name: seg.speakerName,
        is_user: seg.isUser,
        start_ms: seg.startMs,
        end_ms: seg.endMs,
        text: seg.text,
        interrupted: seg.interrupted || false,
        words_spoken: seg.wordsSpoken || (seg.text ? seg.text.split(/\s+/).length : 0),
      }));

      const { error: segError } = await supabase
        .from("utterance_segments")
        .insert(segmentRows);

      if (segError) {
        console.warn("Supabase segments insert warning:", segError.message);
      }
    }
  } catch (err) {
    console.error("Failed to sync report with Supabase DB:", err);
  }
}

/**
 * Fetches all discussion reports from Supabase DB, merging or falling back to local IndexedDB.
 */
export async function getAllReports(): Promise<GDReport[]> {
  if (!isSupabaseConfigured || !supabase) {
    return getFromIndexedDb();
  }

  try {
    const { data, error } = await supabase
      .from("reports")
      .select("*")
      .order("created_at", { ascending: false });

    if (error || !data || data.length === 0) {
      return getFromIndexedDb();
    }

    // Map Supabase rows back to GDReport structure
    const dbReports: GDReport[] = data.map((row) => ({
      sessionId: row.session_id,
      createdAt: row.created_at,
      topic: row.topic,
      durationSeconds: row.duration_seconds,
      stats: row.stats,
      dimensions: row.dimensions,
      missed_openings: row.missed_openings || [],
      top_3_actions: row.top_3_actions || [],
      transcript: row.transcript || [],
    }));

    // Merge with local IndexedDB reports to ensure no offline session is omitted
    const localReports = await getFromIndexedDb();
    const existingIds = new Set(dbReports.map((r) => r.sessionId));
    const merged = [...dbReports];

    for (const local of localReports) {
      if (!existingIds.has(local.sessionId)) {
        merged.push(local);
      }
    }

    return merged;
  } catch (err) {
    console.warn("Supabase fetch failed, using local storage:", err);
    return getFromIndexedDb();
  }
}

/**
 * Fetches a single discussion report by sessionId.
 */
export async function getReportById(sessionId: string): Promise<GDReport | undefined> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from("reports")
        .select("*")
        .eq("session_id", sessionId)
        .maybeSingle();

      if (!error && data) {
        return {
          sessionId: data.session_id,
          createdAt: data.created_at,
          topic: data.topic,
          durationSeconds: data.duration_seconds,
          stats: data.stats,
          dimensions: data.dimensions,
          missed_openings: data.missed_openings || [],
          top_3_actions: data.top_3_actions || [],
          transcript: data.transcript || [],
        };
      }
    } catch (err) {
      console.warn("Failed to fetch report by ID from Supabase:", err);
    }
  }

  return getFromIndexedDbById(sessionId);
}
