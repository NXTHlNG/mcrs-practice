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
	UpdateById(id primitive.ObjectID, update model.UpdateAnswer) (primitive.ObjectID, error)
	DeleteById(id primitive.ObjectID) error
	CreateAll(answer []interface{}) ([]interface{}, error)
}

func NewAnswer(s AnswerRepository) *AnswerService {
	return &AnswerService{
		answerRepository: s,
	}
}

func (s *AnswerService) CreateAll(answers []model.CreateAnswer) ([]interface{}, error) {
	res, err := s.answerRepository.CreateAll(interfaceSlice(answers))

	if err != nil {
		return nil, fmt.Errorf("answerService.createAll failed: %v", err)
	}

	return res, nil
}

func (s *AnswerService) DeleteById(id primitive.ObjectID) error {
	if err := s.answerRepository.DeleteById(id); err != nil {
		return fmt.Errorf("answerService.deleteById failed: %v", err)
	}
	return nil
}

func (s *AnswerService) UpdateById(id primitive.ObjectID, answer model.UpdateAnswer) (model.Answer, error) {
	id, err := s.answerRepository.UpdateById(id, answer)

	if err != nil {
		return model.Answer{}, fmt.Errorf("answerService.updateById failed: %v", err)
	}

	return s.GetById(id)
}

func (s *AnswerService) GetStatisticsByFormId(formId string) (string, error) {
	res, err := s.answerRepository.GetAllByFormId(formId)

	if err != nil {
		return "", fmt.Errorf("service.Answer.GetAllByFormId failed: %v", err)
	}

	path, err := converter.ToExcel(res)

	if err != nil {
		return "", fmt.Errorf("service.Answer.GetAllByFormId converted failed: %v", err)
	}

	return path, nil
}

func (s *AnswerService) Create(answer model.CreateAnswer) (model.Answer, error) {
	id, err := s.answerRepository.Create(answer)
	if err != nil {
		return model.Answer{}, fmt.Errorf("answerService.create failed: %v", err)
	}

	a, err := s.answerRepository.GetById(id)
	if err != nil {
		return model.Answer{}, fmt.Errorf("answerService.repo.GetById failed: %v", err)
	}

	return a, nil
}

func (s *AnswerService) GetAllByFormId(formId string) ([]model.Answer, error) {
	res, err := s.answerRepository.GetAllByFormId(formId)

	if err != nil {
		return nil, fmt.Errorf("answerService.getAllByForm failed: %v", err)
	}

	return res, nil
}

func (s *AnswerService) GetById(id primitive.ObjectID) (model.Answer, error) {
	res, err := s.answerRepository.GetById(id)

	if err != nil {
		return model.Answer{}, fmt.Errorf("answerService.getById failed: %v", err)
	}

	return res, nil
}

func interfaceSlice(slice []model.CreateAnswer) []interface{} {
	var res = make([]interface{}, len(slice))

	for i, s := range slice {
		res[i] = s
	}

	return res
}
