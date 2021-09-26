package API

import (
	"context"
	"database/sql"
	"fmt"

	_ "github.com/mattn/go-sqlite3"
	"go.uber.org/zap"
)

type SQLiteDB struct {
	db     *sql.DB
	logger *zap.Logger
}

func OpenSQLiteDB(ctx context.Context, logger *zap.Logger, dsn string) (*SQLiteDB, error) {
	db, err := sql.Open("sqlite3", dsn)
	if err != nil {
		return nil, fmt.Errorf("server: sqlite_db_general: failed to open sqlite db: %w", err)
	}

	if err := db.PingContext(ctx); err != nil {
		db.Close()
		return nil, fmt.Errorf("server: sqlite_db_general: sqlite db down: %w", err)
	}

	s := &SQLiteDB{
		db:     db,
		logger: logger,
	}

	if err := s.migrate(ctx); err != nil {
		s.Close()
		return nil, fmt.Errorf("server: sqlite_db_general: failed to migrate SQLite database: %w", err)
	}

	return s, nil
}

func (s *SQLiteDB) migrate(ctx context.Context) error {
	if err := s.TransactContext(ctx, func(ctx context.Context, tx *sql.Tx) error {

		if _, err := tx.ExecContext(ctx, `
				CREATE TABLE IF NOT EXISTS pourData (
					payloadTicketId STRING NOT NULL PRIMARY KEY,
					siteCity STRING NOT NULL ,
					siteCode STRING NOT NULL,
					payloadEventArrivalTime STRING NOT NULL,
					payloadEventToPlantTime STRING NOT NULL,
					locationLatitude INTEGER NOT NULL,
					locationLongitude INTEGER NOT NULL

				)
			`); err != nil {
			return fmt.Errorf("sqlite failed to create maps table: %w", err)
		}

		return nil
	}); err != nil {
		return fmt.Errorf("server: SQLGeneral: migrate transaction failed: %w", err)
	}

	return nil
}

func (s *SQLiteDB) TransactContext(ctx context.Context, f func(ctx context.Context, tx *sql.Tx) error) (err error) {
	tx, err := s.db.BeginTx(ctx, nil)
	if err != nil {
		return fmt.Errorf("server: SQLGeneral: failed to begin a transaction: %w", err)
	}

	defer func() {
		if err != nil {
			if err := tx.Rollback(); err != nil {
				s.logger.Error("server: SQLGeneral: transaction rollback failed")
			}
			return
		}

		err = tx.Commit()
	}()

	return f(ctx, tx)
}
