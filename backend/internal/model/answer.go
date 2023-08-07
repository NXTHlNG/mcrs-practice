package model

import "go.mongodb.org/mongo-driver/bson/primitive"

type Answer struct {
	Id     primitive.ObjectID `json:"id" bson:"_id" binding:"required"`
	FormId string             `json:"form_id" bson:"form_id" binding:"required"`
	Items  []AnswerItem       `json:"items" bson:"items" binding:"required"`
}

type CreateAnswer struct {
	FormId string       `json:"form_id" bson:"form_id" binding:"required"`
	Items  []AnswerItem `json:"items" bson:"items" binding:"required"`
}

type UpdateAnswer struct {
	Items []AnswerItem `json:"items" bson:"items" binding:"required"`
}

type AnswerItem struct {
	Id    string   `json:"id" bson:"id" binding:"required"`
	Title string   `json:"title" bson:"title" binding:"required"`
	Type  ItemType `json:"type" bson:"type" binding:"required"`
	// Если Type равен MultiQuestion, тогда Value имеет тип [] AnswerItem
	Value any `json:"value" bson:"value" binding:"required"`
}

type GetAnswerRequest struct {
	FormId string `json:"form_id" binding:"required"`
}
