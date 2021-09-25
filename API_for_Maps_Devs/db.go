package API

import (
	"context"
	"database/sql"

	"go.uber.org/zap"
)

type DB interface {
	getLogger() *zap.Logger

	savePour(ctx context.Context) error

	retriveSite(ctx context.Context, city string, site string) ([]pourDelivery, error)

	migrate(ctx context.Context) error
	TransactContext(ctx context.Context, f func(ctx context.Context, tx *sql.Tx) error) (err error)
	Close() error
}
