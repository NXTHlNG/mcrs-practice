package handler

import (
	"net/http"
	"server/internal/model"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/cors"
	"github.com/go-chi/render"
	"go.mongodb.org/mongo-driver/bson/primitive"
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
	Update(alias string, form model.UpdateForm) (model.Form, error)
	Delete(alias string) error
	FindById(id primitive.ObjectID) (model.Form, error)
	FindByAlias(alias string) (model.Form, error)
	GetAll() ([]model.FormResponse, error)
}

type AnswerService interface {
	UpdateById(id primitive.ObjectID, update model.UpdateAnswer) (model.Answer, error)
	DeleteById(id primitive.ObjectID) error
	Create(answer model.CreateAnswer) (model.Answer, error)
	GetAllByFormId(id string) ([]model.Answer, error)
	GetById(id primitive.ObjectID) (model.Answer, error)
	GetStatisticsByFormId(id string) (string, error)
	CreateAll([]model.CreateAnswer) ([]interface{}, error)
}

func New(fs FormService, as AnswerService) *Handler {
	return &Handler{
		formService:   fs,
		answerService: as,
	}
}

func (h *Handler) InitRoutes() *chi.Mux {
	r := chi.NewRouter()

	r.Use(cors.Handler(cors.Options{
		AllowOriginFunc: func(r *http.Request, origin string) bool { return true },
		AllowedMethods:  []string{"GET", "POST", "PUT", "DELETE"},
	}))
	r.Use(middleware.DefaultLogger)
	r.Use(render.SetContentType(render.ContentTypeJSON))

	r.Get("/ping", func(w http.ResponseWriter, r *http.Request) {
		_, _ = w.Write([]byte("ok"))
		w.WriteHeader(http.StatusOK)
	})

	r.Route("/api", func(r chi.Router) {
		r.Route("/form", func(r chi.Router) {
			r.Get("/", h.getAll)
			r.Post("/", h.createForm)
			r.Route("/{alias}", func(r chi.Router) {
				r.Put("/", h.updateForm)
				r.Delete("/", h.deleteForm)
				r.Get("/", h.getFormByAlias)
			})
		})
		r.Route("/statistics/{form_id}", func(r chi.Router) {
			r.Get("/", h.getStatisticsByFormId)
		})
		r.Route("/answer", func(r chi.Router) {
			r.Get("/{form_id}", h.getAnswerByFormId)
			r.Post("/", h.createAnswer)
			r.Post("/all", h.createAllAnswers)
			r.Delete("/{id}", h.deleteAnswer)
			r.Put("/{id}", h.updateAnswer)
		})
	})

	return r
}
