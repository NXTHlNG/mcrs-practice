package repos

import (
	"go.mongodb.org/mongo-driver/mongo"
)

const formCollection = "form"

type FormRepository struct {
	collection *mongo.Collection
}

type GetCollection interface {
	GetCollection(name string) *mongo.Collection
}

func NewForm(s GetCollection) *FormRepository {
	return &FormRepository{
		collection: s.GetCollection(formCollection),
	}
}

func (r *FormRepository) findOne() interface{} {
	return nil
}
