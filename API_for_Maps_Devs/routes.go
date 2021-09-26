package API

import (
	"context"
	"net/http"

	"github.com/go-chi/chi"
	"github.com/go-chi/chi/middleware"
	"github.com/go-chi/cors"
)

func allowOriginFunc(r *http.Request, origin string) bool {
	// Allow all without checking origin
	return true
}

func (h *HttpServer) routes(ctx context.Context) error {

	// General middleware
	h.router.Use(cors.Handler(cors.Options{
		AllowOriginFunc:  allowOriginFunc,
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"X-PINGOTHER", "Accept", "Authorization", "Content-Type", "X-CSRF-Token"},
		ExposedHeaders:   []string{"Link"},
		AllowCredentials: true,
	}))
	h.router.Use(middleware.Logger)

	// Public routes
	h.router.Group(func(r chi.Router) {
		// Get
		r.Get("/boston", h.giveMe(ctx, "boston", "0"))
		r.Get("/dc", h.giveMe(ctx, "dc", "0"))
		r.Get("/toronto", h.giveMe(ctx, "toronto", "0"))

		r.Get("/boston/project1", h.giveMe(ctx, "boston", "1"))
		r.Get("/boston/project2", h.giveMe(ctx, "boston", "2"))

		r.Get("/dc/project1", h.giveMe(ctx, "dc", "1"))
		r.Get("/dc/project2", h.giveMe(ctx, "dc", "2"))

		r.Get("/toronto/project1", h.giveMe(ctx, "toronto", "1"))
		r.Get("/toronto/project2", h.giveMe(ctx, "toronto", "2"))

		//r.Get("/citys", h.city)

	})
	return nil
}
