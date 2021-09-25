package API

import (
	"context"
	"database/sql"
	"fmt"

	"go.uber.org/zap"
)

func (s *SQLiteDB) getLogger() *zap.Logger {
	return s.logger
}

// d, k, p, s, t
func (s *SQLiteDB) savePour(ctx context.Context) error {
	if err := s.TransactContext(ctx, func(ctx context.Context, tx *sql.Tx) error {
		if _, err := tx.ExecContext(ctx, `
			INSERT INTO pourData (siteCity,
				siteCode,
				payloadTicketId,
				payloadEventArrivalTime,
				payloadEventToPlantTime,
				locationLatitude,
				locationLongitude)
			VALUES ("boston", 
					"2",
					"20166e15-98bc-414d-8f34-f3d417565461",
					"2020-08-26 12:05:37+00",
					"2020-08-26 12:05:37+00",
					42.363235,
					-71.082076
		);
		`,
		); err != nil {
			fmt.Println("not inserted:")
			return fmt.Errorf("server: SQLdb: failed to insert map name data into db: %w", err)
		}
		return nil
	}); err != nil {
		return fmt.Errorf("server: SQLdb: save pour transaction failed: %w", err)
	}
	return nil
}

func (s *SQLiteDB) retriveSite(ctx context.Context, city string, site string) ([]pourDelivery, error) {
	var pours []pourDelivery
	var pour pourDelivery
	if err := s.TransactContext(ctx, func(ctx context.Context, tx *sql.Tx) error {
		rows, err := tx.QueryContext(ctx, `
				SELECT payloadEventArrivalTime,	payloadEventToPlantTime, locationLatitude, locationLongitude
				FROM pourData
				WHERE siteCity = :city
				AND siteCode   = :site
				`,
			sql.Named("city", city),
			sql.Named("site", site),
		)
		if err != nil {
			fmt.Println("did not work extracting instructions")
			return fmt.Errorf("server: SQLdb: failed to retrieve data from instruction rows: %w", err)
		}
		defer rows.Close()
		for rows.Next() {
			if err := rows.Scan(
				&pour.StartTime,
				&pour.EndTime,
				&pour.Latitude,
				&pour.Longitude,
			); err != nil {
				return fmt.Errorf("server: SQLdb: failed to scan instruction row: %w", err)
			}

			pours = append(pours, pour)
		}
		if err := rows.Err(); err != nil {
			return fmt.Errorf("server: SQLdb: failed to scan last instruction row: %w", err)
		}

		return nil
	}); err != nil {
		return pours, fmt.Errorf("server: SQLdb: retriveInstruction transaction failed: %w", err)
	}

	return pours, nil
}

func (s *SQLiteDB) Close() error {
	if err := s.db.Close(); err != nil {
		return fmt.Errorf("server: SQLdb: failed to close sqlite db: %w", err)
	}
	return nil
}
