package config

import (
	"github.com/ilyakaznacheev/cleanenv"
	"log"
	"os"
)

type Config struct {
	Server `yaml:"server"`
	Mongo  `yaml:"mongo"`
}

type Mongo struct {
	Uri    string `yaml:"uri"`
	DBName string `yaml:"db-name"`
}

type Server struct {
	Timeout     int    `yaml:"timeout"`
	IdleTimeout int    `yaml:"idle-timeout"`
	Port        string `yaml:"port"`
}

func MustLoad() *Config {
	cfg := new(Config)

	if err := cleanenv.ReadConfig("./config/config.yaml", cfg); err != nil {
		log.Println(err)
		os.Exit(1)
	}

	return cfg
}
