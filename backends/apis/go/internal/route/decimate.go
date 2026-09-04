package route

// maxRoutePoints caps how many points a route sends to clients. A raw GPX
// track can carry hundreds of thousands of points (one per second or so);
// a map line or a chart a few hundred pixels wide looks identical with a
// few thousand, and everything past that is wasted bandwidth and render time.
const maxRoutePoints = 2000

// decimatePoints reduces points to at most maxPoints by evenly sampling
// across the track, always keeping the first and last point so distance
// and map bounds still line up with the full-resolution route.
func decimatePoints(points []RoutePoint, maxPoints int) []RoutePoint {
	if maxPoints < 2 || len(points) <= maxPoints {
		return points
	}

	decimated := make([]RoutePoint, maxPoints)
	step := float64(len(points)-1) / float64(maxPoints-1)

	for i := 0; i < maxPoints; i++ {
		idx := int(float64(i) * step)
		if idx >= len(points) {
			idx = len(points) - 1
		}
		decimated[i] = points[idx]
	}

	return decimated
}
