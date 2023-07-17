package main

import (
	"log"
	"os"
	"server/internal/config"
	"server/internal/handler"
	"server/internal/pkg/server"
	"server/internal/pkg/storage"
	"server/internal/pkg/storage/repos"
	"server/internal/services"
)

func main() {
	cfg := config.MustLoad()
	log.Printf("init config %v\n", cfg)

	st := storage.New(cfg.Uri)
	log.Println("init storage")

	rf := repos.NewForm(st)
	ra := repos.NewAnswer(st)
	log.Println("init repository")

	fs := services.NewForm(rf)
	as := services.NewAnswer(ra)
	log.Println("init service")

	h := handler.New(fs, as)

	httpServer := &server.Server{}

	err := httpServer.Run(cfg.Server, h.InitRoutes())
	if err != nil {
		log.Println(err)
		os.Exit(1)
	}
}
