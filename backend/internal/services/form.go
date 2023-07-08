package services

type FormService struct {
	r FormRepository
}

type FormRepository interface {
}

func NewForm(r FormRepository) *FormService {
	return &FormService{
		r: r,
	}
}
