package route

import (
	"encoding/xml"
	"fmt"
)

type gpxPoint struct {
	Lat float64 `xml:"lat,attr"`
	Lon float64 `xml:"lon,attr"`
	Ele float64 `xml:"ele"`
}

func parseGPX(data []byte) ([]gpxPoint, error) {
	var gpx struct {
		Points []gpxPoint `xml:"trk>trkseg>trkpt"`
	}

	if err := xml.Unmarshal(data, &gpx); err != nil {
		return nil, fmt.Errorf("failed to unmarshal GPX data: %w", err)
	}

	return gpx.Points, nil
}
