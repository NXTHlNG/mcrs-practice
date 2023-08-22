package repos

import (
	"context"
	"fmt"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"io"
	"log"
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
	ctx := context.Background()

	cur, err := r.collection.Find(ctx, bson.D{{"form_id", id}})
	if err != nil {
		return nil, err
	}

	var answer model.Answer
	for cur.Next(ctx) {

		if err := cur.Err(); err != nil {
			if err == io.EOF {
				break
			}

			return nil, err
		}

		answer = model.Answer{}
		err := cur.Decode(&answer)

		if err != nil {
			return nil, err
		}

		injectionType(&answer)

		err = cur.Decode(&answer)
		if err != nil {
			return nil, err
		}

		res = append(res, answer)
	}

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
	res, err := r.collection.UpdateByID(context.Background(), id, bson.M{"$set": answer})
	if err != nil {
		return primitive.NilObjectID, err
	}
	log.Printf("update result: %v", res)
	if res.UpsertedCount == 0 && res.ModifiedCount == 0 && res.MatchedCount == 0 {
		return primitive.NilObjectID, fmt.Errorf("answer with id %v not found", id)
	}

	return id, nil
}

func (r *AnswerRepository) CreateAll(answer []interface{}) ([]interface{}, error) {
	res, err := r.collection.InsertMany(context.Background(), answer)

	return res.InsertedIDs, err
}

func injectionType(answer *model.Answer) {
	for _, item := range answer.Items {
		if item.Type == model.Multi {
			var arr []model.AnswerItem
			item.Value = arr
		} else {
			item.Value = model.AnswerItem{}
		}
	}
}
