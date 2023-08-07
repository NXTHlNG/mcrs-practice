package repos

import (
	"context"
	"fmt"
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

func (r *AnswerRepository) DeleteById(id primitive.ObjectID) error {
	_, err := r.collection.DeleteOne(context.Background(), bson.D{{"_id", id}})

	return err
}

func (r *AnswerRepository) UpdateById(id primitive.ObjectID, answer model.UpdateAnswer) (primitive.ObjectID, error) {
	res, err := r.collection.UpdateByID(context.Background(), bson.D{{"_id", id}}, bson.M{})
	if err != nil {
		return primitive.NilObjectID, err
	}
	if res.UpsertedCount == 0 && res.ModifiedCount == 0 {
		return primitive.NilObjectID, fmt.Errorf("answer with id %v not found", id)
	}

	return res.UpsertedID.(primitive.ObjectID), nil
}
