package API

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
)

type staticTestData struct {
	Info string `json:"info"`
	Data []int  `json:"data"`
}

type pourDelivery struct {
	Latitude  float64 `json:"lat"`
	Longitude float64 `json:"long"`
	StartTime string  `json:"startTime"`
	EndTime   string  `json:"endTime"`
}

func (h *HttpServer) siteData(w http.ResponseWriter, req *http.Request) {
	location := "west"

	w.Header().Set("Content-Type", "application/json; charset=UTF-8")

	if err := json.NewEncoder(w).Encode(location); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}

	w.WriteHeader(http.StatusOK)

}

func (h *HttpServer) giveMe(ctx context.Context, city string, site string) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {

		fmt.Println("saving data")
		h.db.savePour(ctx)

		var data []pourDelivery

		/*
		* Calling relevant data from db
		* Converting into JSON
		* Sending
		 */

		data1, err := h.db.retriveSite(ctx, city, site)
		data = data1
		if err != nil {
		}

		w.Header().Set("Content-Type", "application/json; charset=UTF-8")

		if err := json.NewEncoder(w).Encode(data); err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
		}

		w.WriteHeader(http.StatusOK)
	}
}
