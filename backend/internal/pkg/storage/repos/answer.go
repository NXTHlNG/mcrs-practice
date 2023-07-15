package repos

import (
	"context"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"server/internal/model"
)

const answerCollection = "answer"

type AnswerRepository struct {
	collection *mongo.Collection
}

func NewAnswer(s GetCollection) *AnswerRepository {
	return &AnswerRepository{
		collection: s.GetCollection(answerCollection),
	}
}

func (r *AnswerRepository) Create(a model.CreateAnswer) (primitive.ObjectID, error) {
	res, err := r.collection.InsertOne(context.Background(), &a)
	if err != nil {
		return res.InsertedID.(primitive.ObjectID), err
	}

	return res.InsertedID.(primitive.ObjectID), nil
}

func (r *AnswerRepository) GetAllByFormId(id string) ([]model.Answer, error) {
	var res []model.Answer

	cur, err := r.collection.Find(context.Background(), bson.D{{"form_id", id}})
	if err != nil {
		return nil, err
	}

	err = cur.All(context.Background(), &res)
	if err != nil {
		return nil, err
	}

	return res, nil
}

func (r *AnswerRepository) GetById(id primitive.ObjectID) (model.Answer, error) {
	var res model.Answer

	err := r.collection.FindOne(context.Background(), bson.D{{"_id", id}}).Decode(&res)

	if err != nil {
		return res, err
	}
	return res, nil
}
