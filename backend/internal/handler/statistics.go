package handler

import (
	"github.com/go-chi/chi/v5"
	"github.com/go-chi/render"
	"io"
	"log"
	"net/http"
	"os"
)

func (h *Handler) getStatisticsByFormId(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "form_id")

	path, err := h.answerService.GetStatisticsByFormId(id)

	if err != nil {
		log.Println(err)
		err = render.Render(w, r, ErrNotFound)
		if err != nil {
			w.WriteHeader(http.StatusBadRequest)
			_, _ = w.Write([]byte(ErrNotFound.ErrorText))
		}
	}
	log.Println(path)

	f, err := os.Open(path)
	defer os.Remove(path)
	defer f.Close()

	if err != nil {
		log.Println(err)
		err = render.Render(w, r, ErrNotFound)
		if err != nil {
			w.WriteHeader(http.StatusBadRequest)
			_, _ = w.Write([]byte(ErrNotFound.ErrorText))
		}
	}

	data, err := io.ReadAll(f)

	if err != nil {
		log.Println(err)
		err = render.Render(w, r, ErrNotFound)
		if err != nil {
			w.WriteHeader(http.StatusBadRequest)
			_, _ = w.Write([]byte(ErrNotFound.ErrorText))
		}
	}

	w.Header().Add("Content-disposition", "attachment;filename=answer.xlsx")
	w.Header().Set("Content-Type", "application/vnd.ms-excel")
	w.WriteHeader(http.StatusOK)

	_, err = w.Write(data)
	if err != nil {
		log.Println(err)
		err = render.Render(w, r, ErrNotFound)
		if err != nil {
			w.WriteHeader(http.StatusBadRequest)
			_, _ = w.Write([]byte(ErrNotFound.ErrorText))
		}
	}
}
