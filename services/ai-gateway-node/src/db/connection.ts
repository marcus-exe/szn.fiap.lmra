import { Pool } from 'pg';
import 'dotenv/config';

const pool = new Pool({
  host: process.env.DB_HOST || process.env.POSTGRES_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || process.env.POSTGRES_PORT || '5432'),
  database: process.env.DB_NAME || process.env.POSTGRES_DB || 'lmra',
  user: process.env.DB_USER || process.env.POSTGRES_USER || 'lmra_user',
  password: process.env.DB_PASSWORD || process.env.POSTGRES_PASSWORD || 'lmra_password',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Initialize database schema
export async function initializeDatabase() {
  try {
    // Create table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS analysis_history (
        id BIGSERIAL PRIMARY KEY,
        repository_url VARCHAR(500),
        branch VARCHAR(255),
        analysis_type VARCHAR(50) NOT NULL DEFAULT 'codebase',
        language VARCHAR(50),
        files_analyzed INTEGER,
        status VARCHAR(50) NOT NULL DEFAULT 'completed',
        modernization_score INTEGER,
        overall_severity VARCHAR(50),
        query_parameters JSONB,
        result_data JSONB,
        processed_files TEXT[],
        error_message TEXT,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        completed_at TIMESTAMP
      );
    `);

    // Add query_parameters column if it doesn't exist (for existing databases)
    await pool.query(`
      DO $$ 
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name = 'analysis_history' 
          AND column_name = 'query_parameters'
        ) THEN
          ALTER TABLE analysis_history ADD COLUMN query_parameters JSONB;
        END IF;
      END $$;
    `);

    // Create indexes
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_analysis_history_repository ON analysis_history(repository_url);
      CREATE INDEX IF NOT EXISTS idx_analysis_history_created_at ON analysis_history(created_at DESC);
      CREATE INDEX IF NOT EXISTS idx_analysis_history_status ON analysis_history(status);
      CREATE INDEX IF NOT EXISTS idx_analysis_history_type ON analysis_history(analysis_type);
    `);
    
    console.log('Database schema initialized');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
}

export { pool };

