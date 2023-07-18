package model

import "go.mongodb.org/mongo-driver/bson/primitive"

type Answer struct {
	Id     primitive.ObjectID `json:"id" bson:"_id" binding:"required"`
	UserId string             `json:"user_id" bson:"user_id" binding:"required"`
	FormId string             `json:"form_id" bson:"form_id" binding:"required"`
	Items  []AnswerItem       `json:"items" bson:"items" binding:"required"`
}

type CreateAnswer struct {
	UserId string       `json:"user_id" bson:"user_id" binding:"required"`
	FormId string       `json:"form_id" bson:"form_id" binding:"required"`
	Items  []AnswerItem `json:"items" bson:"items" binding:"required"`
}

type AnswerItem struct {
	FormsItemId string `json:"id" bson:"id" binding:"required"`
	Title       string `json:"title" bson:"title" binding:"required"`
	Value       any    `json:"value" bson:"value" binding:"required"`
}

type GetAnswerRequest struct {
	FormId string `json:"form_id" binding:"required"`
}
