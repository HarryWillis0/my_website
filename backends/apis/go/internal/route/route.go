package route

type Route struct {
	Points        []RoutePoint `json:"points"`
	Distance      float64      `json:"distance"`      // total meters
	ElevationGain float64      `json:"elevationGain"` // total meters climbed
}

func (r Route) IsEmpty() bool {
	return len(r.Points) == 0 && r.Distance == 0 && r.ElevationGain == 0
}
