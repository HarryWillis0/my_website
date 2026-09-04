package route

import "testing"

func makeRoutePoints(n int) []RoutePoint {
	points := make([]RoutePoint, n)
	for i := range points {
		points[i] = RoutePoint{Lat: float64(i), Lon: float64(i), Ele: float64(i), Distance: float64(i)}
	}
	return points
}

func TestDecimatePoints_FewerThanMax_ReturnsUnchanged(t *testing.T) {
	points := makeRoutePoints(10)

	result := decimatePoints(points, 2000)

	if len(result) != len(points) {
		t.Errorf("expected %d points, got %d", len(points), len(result))
	}
}

func TestDecimatePoints_MoreThanMax_ReturnsCappedCount(t *testing.T) {
	points := makeRoutePoints(500_000)

	result := decimatePoints(points, 2000)

	if len(result) != 2000 {
		t.Errorf("expected 2000 points, got %d", len(result))
	}
}

func TestDecimatePoints_MoreThanMax_KeepsFirstAndLastPoint(t *testing.T) {
	points := makeRoutePoints(500_000)

	result := decimatePoints(points, 2000)

	if result[0] != points[0] {
		t.Errorf("expected first point to be preserved, got %+v", result[0])
	}

	if result[len(result)-1] != points[len(points)-1] {
		t.Errorf("expected last point to be preserved, got %+v", result[len(result)-1])
	}
}

func TestDecimatePoints_MaxPointsLessThanTwo_ReturnsUnchanged(t *testing.T) {
	points := makeRoutePoints(10)

	result := decimatePoints(points, 1)

	if len(result) != len(points) {
		t.Errorf("expected points to be returned unchanged, got %d points", len(result))
	}
}
