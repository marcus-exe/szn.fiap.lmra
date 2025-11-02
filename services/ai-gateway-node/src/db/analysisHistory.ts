import { pool } from './connection';

export interface AnalysisHistoryRecord {
  id?: number;
  repository_url?: string;
  branch?: string;
  analysis_type: string;
  language?: string;
  files_analyzed?: number;
  status: 'in_progress' | 'completed' | 'failed';
  modernization_score?: number;
  overall_severity?: string;
  query_parameters?: any;
  result_data?: any;
  processed_files?: string[];
  error_message?: string;
  created_at?: Date;
  completed_at?: Date;
}

export async function saveAnalysisStart(data: {
  repository_url?: string;
  branch?: string;
  analysis_type: string;
  language?: string;
  query_parameters?: any;
}): Promise<number> {
  const result = await pool.query(
    `INSERT INTO analysis_history 
     (repository_url, branch, analysis_type, language, query_parameters, status, created_at)
     VALUES ($1, $2, $3, $4, $5, 'in_progress', NOW())
     RETURNING id`,
    [
      data.repository_url || null,
      data.branch || null,
      data.analysis_type,
      data.language || null,
      data.query_parameters ? JSON.stringify(data.query_parameters) : null
    ]
  );
  return result.rows[0].id;
}

export async function updateAnalysisProgress(
  id: number,
  update: {
    files_analyzed?: number;
    processed_files?: string[];
    status?: 'in_progress' | 'completed' | 'failed';
    modernization_score?: number;
    overall_severity?: string;
    result_data?: any;
    error_message?: string;
  }
): Promise<void> {
  const updates: string[] = [];
  const values: any[] = [];
  let paramIndex = 1;

  if (update.files_analyzed !== undefined) {
    updates.push(`files_analyzed = $${paramIndex++}`);
    values.push(update.files_analyzed);
  }
  if (update.processed_files !== undefined) {
    updates.push(`processed_files = $${paramIndex++}`);
    values.push(update.processed_files);
  }
  if (update.status !== undefined) {
    updates.push(`status = $${paramIndex++}`);
    values.push(update.status);
  }
  if (update.modernization_score !== undefined) {
    updates.push(`modernization_score = $${paramIndex++}`);
    values.push(update.modernization_score);
  }
  if (update.overall_severity !== undefined) {
    updates.push(`overall_severity = $${paramIndex++}`);
    values.push(update.overall_severity);
  }
  if (update.result_data !== undefined) {
    updates.push(`result_data = $${paramIndex++}::JSONB`);
    values.push(JSON.stringify(update.result_data));
  }
  if (update.error_message !== undefined) {
    updates.push(`error_message = $${paramIndex++}`);
    values.push(update.error_message);
  }
  if (update.status === 'completed' || update.status === 'failed') {
    updates.push(`completed_at = NOW()`);
  }

  if (updates.length > 0) {
    values.push(id);
    await pool.query(
      `UPDATE analysis_history SET ${updates.join(', ')} WHERE id = $${paramIndex}`,
      values
    );
  }
}

export async function getAnalysisHistory(limit: number = 50, offset: number = 0, analysisType?: string): Promise<AnalysisHistoryRecord[]> {
  let query = `
    SELECT id, repository_url, branch, analysis_type, language, files_analyzed,
           status, modernization_score, overall_severity, query_parameters, processed_files,
           error_message, created_at, completed_at
    FROM analysis_history
  `;
  const params: any[] = [];
  
  if (analysisType) {
    query += ` WHERE analysis_type = $1`;
    params.push(analysisType);
    query += ` ORDER BY created_at DESC LIMIT $2 OFFSET $3`;
    params.push(limit, offset);
  } else {
    query += ` ORDER BY created_at DESC LIMIT $1 OFFSET $2`;
    params.push(limit, offset);
  }
  
  const result = await pool.query(query, params);
  return result.rows;
}

export async function getAnalysisById(id: number): Promise<AnalysisHistoryRecord | null> {
  const result = await pool.query(
    `SELECT id, repository_url, branch, analysis_type, language, files_analyzed,
            status, modernization_score, overall_severity, query_parameters, result_data, processed_files,
            error_message, created_at, completed_at
     FROM analysis_history
     WHERE id = $1`,
    [id]
  );
  return result.rows[0] || null;
}

