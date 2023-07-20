package services

import (
	"fmt"
	"server/internal/model"
	"server/internal/pkg/helper/converter"

	"go.mongodb.org/mongo-driver/bson/primitive"
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

func (s *AnswerService) GetStatisticsByFormId(formId string) (string, error) {
	res, err := s.answerRepository.GetAllByFormId(formId)

	if err != nil {
		return "", fmt.Errorf("service.Answer.GetAllByFormId failed: %v", err)
	}

	name, err := converter.ToExcel(res)

	if err != nil {
		return "", fmt.Errorf("service.Answer.GetAllByFormId converted failed: %v", err)
	}

	return name, nil
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

func (r *AnswerService) GetAllByFormId(formId string) ([]model.Answer, error) {
	res, err := r.answerRepository.GetAllByFormId(formId)

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
