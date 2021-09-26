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
	StartTime string `json:"startTime"`
	EndTime   string `json:"endTime"`
}

type pourDeliveries struct {
	Latitude   float64        `json:"lat"`
	Longitude  float64        `json:"long"`
	Deliveries []pourDelivery `json:"deliveries"`
}

type cityDeliveries struct {
	Site  string         `json:"project"`
	Pours pourDeliveries `json:"delieries"`
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

		// Checking if city or site

		// City:
		if site == "0" {
			var data []cityDeliveries

			// Retriving data from project 1
			var dataone cityDeliveries
			data1, err := h.db.retriveSite(ctx, city, "1")
			if err != nil {
			}
			dataone.Pours = data1
			dataone.Site = "1"

			// Retriving data from project 2
			var datatwo cityDeliveries
			data2, err := h.db.retriveSite(ctx, city, "2")
			if err != nil {
			}
			datatwo.Pours = data2
			datatwo.Site = "2"

			// Combining data
			data = append(data, dataone)
			data = append(data, datatwo)

			// Sending data
			w.Header().Set("Content-Type", "application/json; charset=UTF-8")

			if err := json.NewEncoder(w).Encode(data); err != nil {
				http.Error(w, err.Error(), http.StatusInternalServerError)
			}

			w.WriteHeader(http.StatusOK)

		} else {
			// Site:

			var data pourDeliveries

			// Retriving data:
			data1, err := h.db.retriveSite(ctx, city, site)
			data = data1
			if err != nil {
			}

			// Sending data
			w.Header().Set("Content-Type", "application/json; charset=UTF-8")

			if err := json.NewEncoder(w).Encode(data); err != nil {
				http.Error(w, err.Error(), http.StatusInternalServerError)
			}

			w.WriteHeader(http.StatusOK)
		}
	}
}
