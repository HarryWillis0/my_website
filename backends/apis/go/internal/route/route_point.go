package route

type RoutePoint struct {
	Lat      float64 `json:"lat"`
	Lon      float64 `json:"lon"`
	Ele      float64 `json:"ele"`
	Distance float64 `json:"distance"` // cumulative meters from the very start
}

func toRoutePoints(gpxPoints []gpxPoint) []RoutePoint {
	routePoints := make([]RoutePoint, len(gpxPoints))

	var cumulativeDistance float64

	for i, p := range gpxPoints {
		if i > 0 {
			cumulativeDistance += calcHaversineDistance(gpxPoints[i-1], gpxPoints[i])
		}

		routePoints[i] = RoutePoint{
			Lat:      p.Lat,
			Lon:      p.Lon,
			Ele:      p.Ele,
			Distance: cumulativeDistance, // cumulative distance from the first point
		}
	}

	return routePoints
}

func elevationGain(routePoints []RoutePoint) float64 {
	var gain float64 = 0.0

	for i := 1; i < len(routePoints); i++ {
		if routePoints[i].Ele > routePoints[i-1].Ele {
			gain += routePoints[i].Ele - routePoints[i-1].Ele
		}
	}

	return gain
}
