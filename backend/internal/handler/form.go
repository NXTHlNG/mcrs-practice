package handler

import (
	"github.com/go-chi/chi/v5"
	"github.com/go-chi/render"
	"log"
	"net/http"
	"server/internal/model"
)

func (h *Handler) getAll(w http.ResponseWriter, r *http.Request) {
	res, err := h.formService.GetAll()
	if err != nil {
		err = render.Render(w, r, ErrBadRequest)
		if err != nil {
			log.Println("Error rendering")
			w.WriteHeader(http.StatusBadRequest)
			_, _ = w.Write([]byte("bad request"))
		}
		log.Println(err)
		return
	}

	render.JSON(w, r, &res)
}

func (h *Handler) deleteForm(w http.ResponseWriter, r *http.Request) {
	alias := chi.URLParam(r, "alias")

	if alias == "" {
		err := render.Render(w, r, ErrNotFound)
		if err != nil {
			log.Println("Error rendering")
			w.WriteHeader(http.StatusBadRequest)
			_, _ = w.Write([]byte("bad alias"))
		}
		log.Println(err)
		return
	}

	if err := h.formService.Delete(alias); err != nil {
		err = render.Render(w, r, ErrNotFound)
		if err != nil {
			log.Println("Error rendering")
			w.WriteHeader(http.StatusNotFound)
			_, _ = w.Write([]byte("not found"))
		}
		log.Println(err)
		return
	}

	w.WriteHeader(http.StatusOK)
	_, _ = w.Write([]byte("ok"))
}

func (h *Handler) updateForm(w http.ResponseWriter, r *http.Request) {
	alias := chi.URLParam(r, "alias")

	if alias == "" {
		err := render.Render(w, r, ErrBadRequest)
		if err != nil {
			log.Println("Error rendering")
			w.WriteHeader(http.StatusBadRequest)
			_, _ = w.Write([]byte("bad alias"))
		}
		log.Println(err)
		return
	}

	var data model.UpdateForm

	err := render.DecodeJSON(r.Body, &data)
	if err != nil {
		err = render.Render(w, r, ErrBadRequest)
		if err != nil {
			w.WriteHeader(http.StatusBadRequest)
			_, _ = w.Write([]byte("bad data format"))
		}
		log.Println(err)
		return
	}

	res, err := h.formService.Update(alias, data)

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

func (h *Handler) getFormByAlias(w http.ResponseWriter, r *http.Request) {
	alias := chi.URLParam(r, "alias")

	if alias == "" {
		err := render.Render(w, r, ErrNotFound)
		if err != nil {
			log.Println("Error rendering")
			w.WriteHeader(http.StatusBadRequest)
			_, _ = w.Write([]byte("bad alias"))
		}
		log.Println(err)
		return
	}

	form, err := h.formService.FindByAlias(alias)

	if err != nil {
		err = render.Render(w, r, ErrNotFound)
		if err != nil {
			log.Println("Error rendering")
			w.WriteHeader(http.StatusNotFound)
			_, _ = w.Write([]byte("not found"))
		}
		log.Println(err)
		return
	}

	render.JSON(w, r, &form)
	return
}

func (h *Handler) createForm(w http.ResponseWriter, r *http.Request) {
	var form model.CreateForm

	err := render.DecodeJSON(r.Body, &form)
	if err != nil {
		err = render.Render(w, r, ErrBadRequest)
		if err != nil {
			w.WriteHeader(http.StatusBadRequest)
			_, _ = w.Write([]byte("bad form format"))
		}
		log.Println(err)
		return
	}

	save, err := h.formService.Create(form)
	if err != nil {
		err = render.Render(w, r, ErrBadRequest)
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
