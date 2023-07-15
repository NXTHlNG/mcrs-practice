package handler

import (
	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/render"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"net/http"
	"server/internal/model"
)

type ErrResponse struct {
	Err            error `json:"-"`
	HTTPStatusCode int   `json:"-"` // http response status code

	StatusText string `json:"status"`          // user-level status message
	AppCode    int64  `json:"code,omitempty"`  // application-specific error code
	ErrorText  string `json:"error,omitempty"` // application-level error message, for debugging
}

var ErrNotFound = &ErrResponse{HTTPStatusCode: http.StatusNotFound, StatusText: "Resource not found."}
var ErrBadRequest = &ErrResponse{HTTPStatusCode: http.StatusBadRequest, StatusText: "Bad form format"}

func (e *ErrResponse) Render(w http.ResponseWriter, r *http.Request) error {
	render.Status(r, e.HTTPStatusCode)
	return nil
}

type Handler struct {
	formService   FormService
	answerService AnswerService
}

type FormService interface {
	Create(form model.CreateForm) (model.Form, error)
	Update(id primitive.ObjectID, form model.UpdateForm) (model.Form, error)
	Delete(id primitive.ObjectID) error
	FindById(id primitive.ObjectID) (model.Form, error)
	FindByAlias(alias string) (model.Form, error)
}

type AnswerService interface {
	Create(answer model.CreateAnswer) (model.Answer, error)
	GetAllByFormId(req model.GetAnswerRequest) ([]model.Answer, error)
	GetById(id primitive.ObjectID) (model.Answer, error)
}

func New(fs FormService, as AnswerService) *Handler {
	return &Handler{
		formService:   fs,
		answerService: as,
	}
}

func (h *Handler) InitRoutes() *chi.Mux {
	r := chi.NewRouter()

	r.Use(middleware.DefaultLogger)
	r.Use(render.SetContentType(render.ContentTypeJSON))

	r.Get("/ping", func(w http.ResponseWriter, r *http.Request) {
		_, _ = w.Write([]byte("ok"))
		w.WriteHeader(http.StatusOK)
	})
	r.Route("/api", func(r chi.Router) {
		r.Route("/form", func(r chi.Router) {
			r.Post("/", h.createForm)
			r.Route("/{id}", func(r chi.Router) {
				r.Get("/", h.getFormByAlias)
			})
		})
		r.Route("/answer", func(r chi.Router) {
			r.Get("/", h.getAnswerByFormId)
			r.Post("/", h.createAnswer)
			r.Route("/{id}", func(r chi.Router) {
				
			})
		})
	})

	return r
}
