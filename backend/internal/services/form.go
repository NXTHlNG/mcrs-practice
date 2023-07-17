package services

import (
	"fmt"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"log"
	"server/internal/model"
	"server/internal/pkg/helper/alias"
)

type FormService struct {
	formRepository FormRepository
}

type FormRepository interface {
	Create(form model.CreateForm) (primitive.ObjectID, error)
	FindByAlias(alias string) (model.Form, error)
	FindById(id primitive.ObjectID) (model.Form, error)
	Update(id primitive.ObjectID, form model.UpdateForm) (model.Form, error)
	Delete(id primitive.ObjectID) error
	ExistsByAlias(alias string) (bool, error)
	GetAll() ([]model.FormResponse, error)
	GetIdByAlias(alias string) (primitive.ObjectID, error)
}

func (s *FormService) Update(alias string, form model.UpdateForm) (model.Form, error) {
	id, err := s.formRepository.GetIdByAlias(alias)
	log.Println(id, err)
	if err != nil {
		return model.Form{}, fmt.Errorf("service.Form.Update get alias by id failed: %s", err)
	}

	if id == primitive.NilObjectID {
		return model.Form{}, fmt.Errorf("service.Form.Update not found by alias")
	}

	return s.formRepository.Update(id, form)
}

func (s *FormService) Create(form model.CreateForm) (model.Form, error) {
	var a string

	for {
		a = alias.New()
		if ok, err := s.formRepository.ExistsByAlias(a); !ok {
			if err != nil {
				return model.Form{}, err
			}
			break
		}
	}

	form.Alias = a

	id, err := s.formRepository.Create(form)
	if err != nil {
		return model.Form{}, err
	}

	return s.formRepository.FindById(id)
}

func (s *FormService) FindByAlias(alias string) (model.Form, error) {
	return s.formRepository.FindByAlias(alias)
}

func (s *FormService) FindById(id primitive.ObjectID) (model.Form, error) {
	return s.formRepository.FindById(id)
}

func (s *FormService) Delete(alias string) error {
	id, err := s.formRepository.GetIdByAlias(alias)
	if err != nil {
		return fmt.Errorf("service.Form.Update get alias by id failed: %s", err)
	}

	if id == primitive.NilObjectID {
		return fmt.Errorf("service.Form.Update not found by alias")
	}

	return s.formRepository.Delete(id)
}

func (s *FormService) GetAll() ([]model.FormResponse, error) {
	res, err := s.formRepository.GetAll()

	if err != nil {
		return nil, fmt.Errorf("service.form.GetAll failed: %s", err)
	}

	return res, nil
}

func NewForm(r FormRepository) *FormService {
	return &FormService{
		formRepository: r,
	}
}
