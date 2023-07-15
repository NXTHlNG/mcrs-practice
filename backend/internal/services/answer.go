package services

import (
	"fmt"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"server/internal/model"
)

type AnswerService struct {
	answerRepository AnswerRepository
}

type AnswerRepository interface {
	Create(answer model.CreateAnswer) (primitive.ObjectID, error)
	GetAllByFormId(id string) ([]model.Answer, error)
	GetById(id primitive.ObjectID) (model.Answer, error)
}

func NewAnswer(r AnswerRepository) *AnswerService {
	return &AnswerService{
		answerRepository: r,
	}
}

func (r *AnswerService) Create(answer model.CreateAnswer) (model.Answer, error) {
	id, err := r.answerRepository.Create(answer)
	if err != nil {
		return model.Answer{}, fmt.Errorf("answerService.create failed: %v", err)
	}

	a, err := r.answerRepository.GetById(primitive.ObjectID(id))
	if err != nil {
		return model.Answer{}, fmt.Errorf("answerService.repo.GetById failed: %v", err)
	}

	return a, nil
}

func (r *AnswerService) GetAllByFormId(req model.GetAnswerRequest) ([]model.Answer, error) {
	res, err := r.answerRepository.GetAllByFormId(req.FormId)

	if err != nil {
		return nil, fmt.Errorf("answerService.getAllByForm failed: %v", err)
	}

	return res, nil
}

func (r *AnswerService) GetById(id primitive.ObjectID) (model.Answer, error) {
	res, err := r.answerRepository.GetById(id)

	if err != nil {
		return model.Answer{}, fmt.Errorf("answerService.getById failed: %v", err)
	}

	return res, nil
}
