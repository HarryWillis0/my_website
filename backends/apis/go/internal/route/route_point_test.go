package route

import "testing"

func TestParseGPXPoints_ReturnsMappedRoutePoints(t *testing.T) {
	pointA := gpxPoint{Lat: 37.7749, Lon: -122.4194}
	pointB := gpxPoint{Lat: 37.7750, Lon: -122.4195}

	gpxPoints := []gpxPoint{pointA, pointB}

	routePoints := toRoutePoints(gpxPoints)

	if len(routePoints) != 2 {
		t.Fatalf("expected 2 route points, got %d", len(routePoints))
	}

	if routePoints[0].Lat != pointA.Lat || routePoints[0].Lon != pointA.Lon {
		t.Errorf("unexpected first route point: %+v", routePoints[0])
	}
}

func TestParseGPXPoints_CalculatesCumulativeDistance(t *testing.T) {
	pointA := gpxPoint{Lat: 37.7749, Lon: -122.4194}
	pointB := gpxPoint{Lat: 37.7750, Lon: -122.4195}
	pointC := gpxPoint{Lat: 37.7751, Lon: -122.4196}

	gpxPoints := []gpxPoint{pointA, pointB, pointC}

	routePoints := toRoutePoints(gpxPoints)

	if routePoints[0].Distance != 0 {
		t.Errorf("expected first route point distance to be 0, got %f", routePoints[0].Distance)
	}

	expectedDistance := calcHaversineDistance(pointA, pointB) + calcHaversineDistance(pointB, pointC)
	if routePoints[2].Distance != expectedDistance {
		t.Errorf("expected third route point distance to be %f, got %f", expectedDistance, routePoints[2].Distance)
	}
}

func TestParseGPXPoints_ElevationIsMappedCorrectly(t *testing.T) {
	pointA := gpxPoint{Lat: 37.7749, Lon: -122.4194, Ele: 10}
	pointB := gpxPoint{Lat: 37.7750, Lon: -122.4195, Ele: 20}

	gpxPoints := []gpxPoint{pointA, pointB}

	routePoints := toRoutePoints(gpxPoints)

	if routePoints[0].Ele != pointA.Ele {
		t.Errorf("expected first route point elevation to be %f, got %f", pointA.Ele, routePoints[0].Ele)
	}

	if routePoints[1].Ele != pointB.Ele {
		t.Errorf("expected second route point elevation to be %f, got %f", pointB.Ele, routePoints[1].Ele)
	}
}

func TestElevationGain_CalculatesCorrectly(t *testing.T) {
	routePoints := []RoutePoint{
		{Lat: 37.7749, Lon: -122.4194, Ele: 10},
		{Lat: 37.7750, Lon: -122.4195, Ele: 20},
		{Lat: 37.7751, Lon: -122.4196, Ele: 15},
		{Lat: 37.7752, Lon: -122.4197, Ele: 25},
	}

	expectedGain := (20.0 - 10) + (25 - 15) // Only consider positive elevation changes
	actualGain := elevationGain(routePoints)

	if actualGain != expectedGain {
		t.Errorf("expected elevation gain to be %f, got %f", expectedGain, actualGain)
	}
}
