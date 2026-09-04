package route

import "math"

// Haversine formula calculates the distance between two points
// taking into account the curvature of the earth.
func calcHaversineDistance(p1, p2 gpxPoint) float64 {
	const earthRadiusKm = 6371.0

	// Convert degrees to radians
	lat1Rad := p1.Lat * math.Pi / 180
	lat2Rad := p2.Lat * math.Pi / 180
	dLatRad := (p2.Lat - p1.Lat) * math.Pi / 180
	dLonRad := (p2.Lon - p1.Lon) * math.Pi / 180

	// Haversine formula
	// a = sin²(Δφ/2) + cos φ1 * cos φ2 * sin²(Δλ/2)
	a := math.Sin(dLatRad/2)*math.Sin(dLatRad/2) +
		math.Cos(lat1Rad)*math.Cos(lat2Rad)*
			math.Sin(dLonRad/2)*math.Sin(dLonRad/2)

	// Convert to distance
	c := 2 * math.Atan2(math.Sqrt(a), math.Sqrt(1-a))

	distance := earthRadiusKm * c * 1000

	return distance
}
