package server

import (
	"net/http"
	"server/internal/config"
	"time"
)

type Server struct {
	httpServer *http.Server
}

func (s Server) Run(cfg config.Server, handler http.Handler) error {
	s.httpServer = &http.Server{
		Handler:      handler,
		Addr:         ":" + cfg.Port,
		ReadTimeout:  time.Duration(cfg.Timeout) * time.Second,
		WriteTimeout: time.Duration(cfg.Timeout) * time.Second,
		IdleTimeout:  time.Duration(cfg.Timeout) * time.Second,
	}

	return s.httpServer.ListenAndServe()
}
