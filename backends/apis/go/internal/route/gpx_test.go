package route

import (
	"os"
	"path/filepath"
	"testing"
)

func TestParseGPX_ParsesCorrectPoints(t *testing.T) {
	fixturePath := filepath.Join("testdata", "two_points.gpx")

	gpxData, err := os.ReadFile(fixturePath)
	if err != nil {
		t.Fatalf("failed to load fixture: %v", err)
	}

	points, err := parseGPX(gpxData)
	if err != nil {
		t.Fatalf("expected no error, got %v", err)
	}

	if len(points) != 2 {
		t.Fatalf("expected 2 points, got %d", len(points))
	}

	if points[0].Lat != 37.7749 || points[0].Lon != -122.4194 || points[0].Ele != 10 {
		t.Errorf("unexpected first point: %+v", points[0])
	}

	if points[1].Lat != 37.7750 || points[1].Lon != -122.4195 || points[1].Ele != 20 {
		t.Errorf("unexpected second point: %+v", points[1])
	}
}
