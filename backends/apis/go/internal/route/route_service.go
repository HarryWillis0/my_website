package route

import (
	"errors"
	"os"
	"path/filepath"
	"time"

	"golang.org/x/sync/singleflight"
)

type RouteService struct {
	directoryPath string
	sfGroup       singleflight.Group
	routeCache    *routeCache
}

func NewRouteService(directoryPath string) (*RouteService, error) {
	if directoryPath == "" {
		return nil, errors.New("directory path cannot be empty")
	}

	return &RouteService{
		directoryPath: directoryPath,
		routeCache:    NewRouteCache(),
	}, nil
}

func (rs *RouteService) GetRouteByArticleID(articleId string) (Route, error) {
	// Check the cache first
	route, found := rs.routeCache.Get(articleId)
	if found {
		return route, nil
	}

	val, err, _ := rs.sfGroup.Do(articleId, func() (any, error) {
		return rs.computeRoute(articleId)
	})

	if err != nil {
		return Route{}, err
	}

	return val.(Route), nil
}

func (rs *RouteService) getRoutePoints(directoryPath string, data []os.DirEntry) ([]RoutePoint, error) {
	routeGPXPoints, err := rs.getGPXPoints(directoryPath, data)
	if err != nil {
		return nil, err
	}

	if len(routeGPXPoints) == 0 {
		return nil, nil
	}

	routePoints := toRoutePoints(routeGPXPoints)

	return routePoints, nil
}

func (rs *RouteService) getGPXPoints(directoryPath string, data []os.DirEntry) ([]gpxPoint, error) {
	var routeGPXPoints []gpxPoint
	for _, dirEntry := range data {
		if !dirEntry.IsDir() && filepath.Ext(dirEntry.Name()) == ".gpx" {
			gpxPath := filepath.Join(directoryPath, dirEntry.Name())

			fileData, err := os.ReadFile(gpxPath)
			if err != nil {
				return nil, err
			}

			gpxPoints, err := parseGPX(fileData)
			if err != nil {
				return nil, err
			}

			routeGPXPoints = append(routeGPXPoints, gpxPoints...)
		}
	}

	return routeGPXPoints, nil
}

func (rs *RouteService) computeRoute(articleId string) (Route, error) {
	// check cache one more time incase prior flight just finished
	route, found := rs.routeCache.Get(articleId)
	if found {
		return route, nil
	}
	var directoryPath = filepath.Join(rs.directoryPath, articleId)

	data, err := os.ReadDir(directoryPath)
	if err != nil {
		if os.IsNotExist(err) {
			// No route directory for this article is a normal case, not a failure.
			return Route{}, nil
		}
		return Route{}, err
	}

	if len(data) == 0 {
		return Route{}, nil
	}

	routePoints, err := rs.getRoutePoints(directoryPath, data)
	if err != nil {
		return Route{}, err
	}

	if len(routePoints) == 0 {
		return Route{}, nil
	}

	computedRoute := Route{
		Points:        routePoints,
		Distance:      routePoints[len(routePoints)-1].Distance,
		ElevationGain: elevationGain(routePoints),
	}

	rs.routeCache.Set(articleId, computedRoute, 24*time.Hour)

	return computedRoute, nil
}
