package route

import (
	"math"
	"testing"
)

func TestHaversineDistance_ReturnsZeroForSamePoint(t *testing.T) {
	point := gpxPoint{Lat: 37.7749, Lon: -122.4194}

	distance := calcHaversineDistance(point, point)

	if distance != 0 {
		t.Errorf("expected distance to be 0, got %f", distance)
	}
}

func TestHaversineDistance_ReturnsWithinHalfMeterTolerance(t *testing.T) {
	pointA := gpxPoint{Lat: 37.7749, Lon: -122.4194}
	pointB := gpxPoint{Lat: 37.7750, Lon: -122.4195}

	distance := calcHaversineDistance(pointA, pointB)

	expectedDistance := 14.0 // Approximate distance in meters
	tolerance := 0.5         // Half a meter tolerance

	if math.Abs(distance-expectedDistance) > tolerance {
		t.Errorf("expected distance to be within %f meters of %f, got %f", tolerance, expectedDistance, distance)
	}
}
