package repos

import (
	"context"
	"fmt"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"server/internal/model"
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

func (r *FormRepository) Create(form model.CreateForm) (primitive.ObjectID, error) {
	res, err := r.collection.InsertOne(context.Background(), &form)
	if err != nil {
		return primitive.NilObjectID, fmt.Errorf("respos.FormRepository.Create failed error: %s", err)
	}

	return res.InsertedID.(primitive.ObjectID), nil
}

func (r *FormRepository) FindByAlias(alias string) (model.Form, error) {
	filter := bson.D{{"alias", alias}}
	result := model.Form{}

	err := r.collection.FindOne(context.Background(), filter).Decode(&result)
	if err != nil {
		return result, fmt.Errorf("respos.FormRepository.findByAlias failed error: %s", err)
	}

	return result, nil
}

func (r *FormRepository) FindById(id primitive.ObjectID) (model.Form, error) {
	result := model.Form{}

	err := r.collection.FindOne(context.Background(), bson.D{{"_id", id}}).Decode(&result)
	if err != nil {
		return result, fmt.Errorf("respos.FormRepository.findById failed error: %s", err)
	}

	return result, nil
}

func (r *FormRepository) Update(id primitive.ObjectID, form model.UpdateForm) (model.Form, error) {
	result := model.Form{}

	_, errUpdate := r.collection.UpdateByID(context.Background(), id, &form)
	if errUpdate != nil {
		return result, fmt.Errorf("resos.FormRepository.findById failed update error: %s", errUpdate)
	}

	errFind := r.collection.FindOne(context.Background(), bson.D{{"_id", id}}).Decode(&result)
	if errFind != nil {
		return result, fmt.Errorf("respos.FormRepository.findById failed find error: %s", errFind)
	}

	return result, nil
}

func (r *FormRepository) Delete(id primitive.ObjectID) error {
	_, err := r.collection.DeleteOne(context.Background(), bson.D{{"_id", id}})
	if err != nil {
		return fmt.Errorf("respos.FormRespository.findById failed error: %s", err)
	}

	return nil
}

func (r *FormRepository) ExistsByAlias(alias string) (bool, error) {
	res, err := r.collection.CountDocuments(context.Background(), bson.D{{"alias", alias}})

	if err != nil {
		return false, fmt.Errorf("respos.FormRespository.ExistsByAlias failed error: %s", err)
	}

	if res == 0 {
		return false, nil
	}

	return true, nil
}
