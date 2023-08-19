package model

import "go.mongodb.org/mongo-driver/bson/primitive"

const (
	Text     ItemType = "text"
	Date     ItemType = "date"
	Time     ItemType = "time"
	Radio    ItemType = "radio"
	Checkbox ItemType = "checkbox"
	Multi    ItemType = "multi"
)

type ItemType string

type Form struct {
	Id          primitive.ObjectID `json:"id" bson:"_id" binding:"required"`
	Title       string             `json:"title" bson:"title" binding:"required"`
	Description string             `json:"description" bson:"description" binding:"required"`
	Alias       string             `json:"alias" bson:"alias" binding:"required"`
	Items       []Item             `json:"items" bson:"items" binding:"required"`
}

type CreateForm struct {
	Title       string `json:"title" bson:"title"`
	Description string `json:"description" bson:"description"`
	Alias       string `json:"alias" bson:"alias"`
	Items       []Item `json:"items" bson:"items"`
}

type UpdateForm struct {
	Title       string `json:"title" bson:"title" binding:"required"`
	Description string `json:"description" bson:"description" binding:"required"`
	Items       []Item `json:"items" bson:"items" binding:"required"`
}

type Item struct {
	Id       int64    `json:"id" bson:"id" binding:"required"`
	Title    string   `json:"title" bson:"title" binding:"required"`
	Type     ItemType `json:"type" bson:"type" binding:"required"`
	Required bool     `json:"required" bson:"required:" binding:"required"`
	Options  []Option `json:"options" bson:"options"`
}

type FormResponse struct {
	Id          primitive.ObjectID `json:"id" bson:"_id" binding:"required"`
	Title       string             `json:"title" bson:"title"`
	Description string             `json:"description" bson:"description"`
	Alias       string             `json:"alias" bson:"alias"`
}

type Option struct {
	Id       int64    `json:"id" bson:"id" binding:"required"`
	Title    string   `json:"title" bson:"title" binding:"required"`
	Type     ItemType `json:"type" bson:"type" binding:"required"`
	Required bool     `json:"required" bson:"required:" binding:"required"`
}
