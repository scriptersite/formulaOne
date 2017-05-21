// create the module
var formulaOneApp = angular.module('formulaOneApp', ['ngRoute']);
// configure our routes
formulaOneApp.config(function ($routeProvider) {
    $routeProvider
    // route for the seasons page
        .when('/', {
            templateUrl: 'pages/seasons.html',
            controller: 'seasonsController'
        })

        // route for the races page
        .when('/races', {
            templateUrl: 'pages/races.html',
            controller: 'racesController'
        })
});
// create the controller and inject Angular's $scope
formulaOneApp.controller('racesController', function ($scope, $http, $location) {
    // accessing the api with $http for data fetching
    var selectedSeason = $location.search().selectedSeason;
    $http.get("http://ergast.com/api/f1/" + selectedSeason + "/results/1.json")
        .then(function (response) {
            $http.get("http://ergast.com/api/f1/" + selectedSeason + "/driverStandings.json?limit=1")
                .then(function (response2) {
                    $scope.seasonWinner = response2.data.MRData.StandingsTable.StandingsLists[0].DriverStandings[0].Driver;
                    $scope.season = selectedSeason;
                    $scope.races = response.data.MRData.RaceTable.Races;
                })
        });
    $scope.checkIfSeasonWinner = function (SeasonWinnerName, currentName) {
        if (SeasonWinnerName == currentName)
            return true;
        else
            return false;
    }
});
formulaOneApp.controller('seasonsController', function ($scope, $http, $location) {
    $scope.seasonFrom = 2005;
    $scope.seasonTo = 2015;
    $http.get("http://ergast.com/api/f1/seasons.json?limit=1000")
        .then(function (response) {
            //  console.log(response.data.MRData.SeasonTable.Seasons)
            $scope.seasons = response.data.MRData.SeasonTable.Seasons;
        });
    $scope.seasonsRange = function (prop) {
        return function (item) {
            return item[prop] >= $scope.seasonFrom && item[prop] <= $scope.seasonTo;
        }
    };
    $scope.goFetchSeason = function (selectedSeason) {
        $location.path('/races/').search({selectedSeason: selectedSeason});
    }
});
