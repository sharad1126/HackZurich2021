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
			data := pourDelivery{
				Latitude:  53.2734,
				Longitude: -7.77832031,
				StartTime: "2021-09-25 19:53:00+00",
				EndTime:   "2021-09-25 20:00:00+00",
			}
		*/
		/*
		* Calling relevant data from db
		* Converting into JSON
		* Sending
		 */

		if city == "boston" {

			if site == "1" {
				//data = "boston1"
				fmt.Println("retriving boston 1")
				data1, err := h.db.retriveSite(ctx, city, site)
				data = data1
				if err != nil {
				}

			} else if site == "2" {
				//data = "boston2"
				data1, err := h.db.retriveSite(ctx, city, site)
				data = data1
				if err != nil {
				}

			} else {
				//data = "bostonAll"
			}

		} else if city == "toronto" {

			if site == "1" {
				//data = "toronto1"
			} else if site == "2" {

			} else {

			}
		} else if city == "dc" {

			if site == "1" {

			} else if site == "2" {

			} else {

			}
		}

		w.Header().Set("Content-Type", "application/json; charset=UTF-8")

		if err := json.NewEncoder(w).Encode(data); err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
		}

		w.WriteHeader(http.StatusOK)
	}
}
