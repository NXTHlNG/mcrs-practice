package handler

import (
	"fmt"
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
		if err != nil {
			w.WriteHeader(http.StatusBadRequest)
			_, _ = w.Write([]byte("bad form format"))
		}
		log.Println(err)
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
