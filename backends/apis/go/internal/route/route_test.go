package route

import (
	"testing"
)

func TestIsEmpty_EmptyRoute_ReturnsTrue(t *testing.T) {
	route := Route{}
	if !route.IsEmpty() {
		t.Errorf("expected empty route, got %v", route)
	}
}

func TestIsEmpty_NonEmptyRoute_ReturnsFalse(t *testing.T) {
	route := Route{
		Points: []RoutePoint{
			{Lat: 1.0, Lon: 2.0, Ele: 3.0, Distance: 4.0},
		},
		Distance:      4.0,
		ElevationGain: 3.0,
	}
	if route.IsEmpty() {
		t.Errorf("expected non-empty route, got empty route")
	}
}

func TestIsEmpty_EmptyPoints_ReturnsTrue(t *testing.T) {
	route := Route{
		Points:        []RoutePoint{},
		Distance:      0.0,
		ElevationGain: 0.0,
	}
	if !route.IsEmpty() {
		t.Errorf("expected empty route, got %v", route)
	}
}
