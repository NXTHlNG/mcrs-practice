package main

import (
	"log"
	"server/internal/config"
	"server/internal/pkg/storage"
	"server/internal/pkg/storage/repos"
	"server/internal/services"
)

func main() {
	cfg := config.MustLoad()
	log.Printf("init config %v\n", cfg)

	st := storage.New(cfg.Uri)
	log.Println("init storage")

	r := repos.NewForm(st)
	log.Println("init repository")

	_ = services.NewForm(r)
	log.Println("init service")
	//TODO init router

	//TODO: start server
}
