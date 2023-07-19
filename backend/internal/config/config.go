package config

import (
	"log"
	"os"

	"github.com/ilyakaznacheev/cleanenv"
)

type Config struct {
	Server `yaml:"server"`
	Mongo  `yaml:"mongo"`
}

type Mongo struct {
	Uri      string `yaml:"uri" env:"DB_URI"`
	DBName   string `yaml:"db-name"`
	Username string `yaml:"db-user" env:"DB_USERNAME"`
	Password string `yaml:"db-password" env:"DB_PASSWORD"`
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
