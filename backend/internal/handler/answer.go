package handler

import (
	"fmt"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"log"
	"net/http"
	"server/internal/model"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/render"
)

func (h *Handler) getAnswerByFormId(w http.ResponseWriter, r *http.Request) {
	formId := chi.URLParam(r, "form_id")
	fmt.Println(formId)
	if formId == "" {
		err := render.Render(w, r, ErrBadRequest)
		if err != nil {
			_, _ = w.Write([]byte("Bad request"))
			w.WriteHeader(http.StatusBadRequest)
		}
		log.Println(err)
		return
	}

	res, err := h.answerService.GetAllByFormId(formId)
	if err != nil {
		err := render.Render(w, r, ErrNotFound)
		if err != nil {
			_, _ = w.Write([]byte("Not found"))
			w.WriteHeader(http.StatusNotFound)
		}
		log.Println(err)
		return
	}

	render.JSON(w, r, res)
}

func (h *Handler) createAnswer(w http.ResponseWriter, r *http.Request) {
	var answer model.CreateAnswer

	err := render.DecodeJSON(r.Body, &answer)
	if err != nil {
		err := render.Render(w, r, ErrBadRequest)
		log.Println(err)
		if err != nil {
			log.Println(err)
			w.WriteHeader(http.StatusBadRequest)
			_, _ = w.Write([]byte("bad form format"))
		}
		return
	}

	save, err := h.answerService.Create(answer)
	if err != nil {
		err := render.Render(w, r, ErrBadRequest)
		if err != nil {
			w.WriteHeader(http.StatusBadRequest)
			_, _ = w.Write([]byte("bad form format"))
		}
		log.Println(err)
		return
	}
	render.JSON(w, r, &save)
	return
}

func (h *Handler) deleteAnswer(w http.ResponseWriter, r *http.Request) {
	param := chi.URLParam(r, "id")
	var id = primitive.ObjectID{}

	err := id.UnmarshalText([]byte(param))

	if err != nil {
		log.Println(err)
		err := render.Render(w, r, ErrBadRequest)
		if err != nil {
			_, _ = w.Write([]byte("Bad request"))
			w.WriteHeader(http.StatusBadRequest)
			log.Println(err)
		}
		return
	}

	if err := h.answerService.DeleteById(id); err != nil {
		err := render.Render(w, r, ErrBadRequest)
		if err != nil {
			_, _ = w.Write([]byte("Bad request"))
			w.WriteHeader(http.StatusBadRequest)
		}
		log.Println(err)
		return
	}

	w.WriteHeader(http.StatusOK)
	_, _ = w.Write([]byte("ok"))
}

func (h *Handler) updateAnswer(w http.ResponseWriter, r *http.Request) {
	param := chi.URLParam(r, "id")
	var id = primitive.ObjectID{}

	if err := id.UnmarshalText([]byte(param)); err != nil {
		log.Println(err)
		err := render.Render(w, r, ErrBadRequest)
		if err != nil {
			_, _ = w.Write([]byte("Bad request"))
			w.WriteHeader(http.StatusBadRequest)
			log.Println(err)
		}
		return
	}

	var data model.UpdateAnswer

	if err := render.DecodeJSON(r.Body, &data); err != nil {
		err = render.Render(w, r, ErrBadRequest)
		if err != nil {
			w.WriteHeader(http.StatusBadRequest)
			_, _ = w.Write([]byte("bad data format"))
		}
		log.Println(err)
		return
	}

	res, err := h.answerService.UpdateById(id, data)

	if err != nil {
		log.Println(err)
		err = render.Render(w, r, ErrNotFound)
		if err != nil {
			log.Println("Error rendering")
			w.WriteHeader(http.StatusNotFound)
			_, _ = w.Write([]byte("not found"))
		}
		return
	}

	render.JSON(w, r, &res)
	return
}

func (h *Handler) createAllAnswers(w http.ResponseWriter, r *http.Request) {
	var answer model.CreateAllAnswer

	err := render.DecodeJSON(r.Body, &answer)
	if err != nil {
		err := render.Render(w, r, ErrBadRequest)
		if err != nil {
			w.WriteHeader(http.StatusBadRequest)
			_, _ = w.Write([]byte("bad form format"))
		}
		log.Println(err)
		return
	}

	save, err := h.answerService.CreateAll(answer.Answers)
	if err != nil {
		err := render.Render(w, r, ErrBadRequest)
		if err != nil {
			w.WriteHeader(http.StatusBadRequest)
			_, _ = w.Write([]byte("bad form format"))
		}
		log.Println(err)
		return
	}
	render.JSON(w, r, &save)
	return
}
