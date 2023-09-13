package storage

import (
	"context"
	"go.mongodb.org/mongo-driver/mongo/options"
	"log"
	"os"
	"time"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/readpref"
)

type Storage struct {
	db *mongo.Database
}

func New(uri, username, password string) *Storage {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	client, err := mongo.Connect(ctx, options.Client().ApplyURI(uri).SetAuth(options.Credential{
		Username: username,
		Password: password,
	}))

	// client, err := mongo.Connect(ctx, options.Client().ApplyURI(uri))

	if err != nil {
		log.Printf("try connect to mongo: %v", err)
		os.Exit(1)
	}

	if err := client.Ping(ctx, readpref.Primary()); err != nil {
		log.Printf("try ping to mongo: %v", err)
		os.Exit(1)
	}

	db := client.Database("mcrs")

	return &Storage{
		db: db,
	}
}

func (s *Storage) GetCollection(name string) *mongo.Collection {
	return s.db.Collection(name)
}
