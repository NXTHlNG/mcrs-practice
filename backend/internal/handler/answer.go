package handler

import (
	"github.com/go-chi/render"
	"log"
	"net/http"
	"server/internal/model"
)

func (h *Handler) getAnswerByFormId(w http.ResponseWriter, r *http.Request) {
	var req model.GetAnswerRequest
	err := render.DecodeJSON(r.Body, &req)
	if err != nil {
		err := render.Render(w, r, ErrBadRequest)
		if err != nil {
			_, _ = w.Write([]byte("Bad request"))
			w.WriteHeader(http.StatusBadRequest)
		}
		log.Println(err)
		return
	}

	res, err := h.answerService.GetAllByFormId(req)
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
