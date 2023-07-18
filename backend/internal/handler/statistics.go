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
		err = render.Render(w, r, ErrBadRequest)
		if err != nil {
			w.WriteHeader(http.StatusBadRequest)
			_, _ = w.Write([]byte(ErrBadRequest.ErrorText))
		}
	}
	log.Println(path)

	f, _ := os.Open(path)
	data, _ := io.ReadAll(f)
	f.Close()

	os.Remove(path)

	w.Header().Add("Content-disposition", "attachment;filename=answer.xlsx")
	w.Header().Set("Content-Type", "application/vnd.ms-excel")
	w.WriteHeader(http.StatusOK)
	_, _ = w.Write(data)
}
