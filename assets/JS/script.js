var apiKey = "6c2b8de8ee027fb6f7f5fbbc52cf3406";
var city;
var fetchButton = document.getElementById('searchBtn');
var currentDay = document.getElementById('currentDay');
var currentTemp = document.getElementById('currentTempt');
var currentWind = document.getElementById('currentWind');
var currentHumidity = document.getElementById('currentHumidity');
var currentUV = document.getElementById('currentUV');
var searchHistory = document.getElementById('searchHistory');
var storedCity = [];
var latLocation;
var lonLocation;

//Displays the citys current weather and five day forecast
function getApi(cityN) {

    //Display the current weather
    var queryUrl = "http://api.openweathermap.org/data/2.5/weather?q=" + cityN + "&appid=" + apiKey + "&units=imperial";

    fetch(queryUrl)
        .then(function (response) {
            if (response.status !== 200) {
                alert("Enter valid city");
            } else {
                return response.json();
            }
        })

        .then(function (data) {
            //Using console.log to examine the data
            console.log(data);
            var dt = new Date(data.dt * 1000);
            var day = dt.getUTCDate();
            var year = dt.getUTCFullYear();
            var month = dt.getUTCMonth() + 1;
            var iconcode = data.weather[0].icon;
            var iconurl = "http://openweathermap.org/img/w/" + iconcode + ".png";
            document.getElementById('wicon').setAttribute("class", "");
            document.getElementById('wicon').src = iconurl;
            currentDay.textContent = data.name + " (" + month + "/" + day + "/" + year + ")";
            currentTemp.textContent = data.main.temp + " °F";
            currentWind.textContent = data.wind.speed + " MPH";
            currentHumidity.textContent = data.main.humidity + " %";
            latLocation = data.coord['lat'];
            lonLocation = data.coord['lon'];
            var uvUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + latLocation + "&lon=" + lonLocation + "&exclude=minutely,hourly,daily,alerts&appid=" + apiKey;
            fetch(uvUrl)
                .then(function (response) {
                    return response.json();
                })

                .then(function (data) {
                    console.log(data);
                    uviNum = Math.round(data.current.uvi);
                    var uviIndex = document.createElement('span');
                    if (uviNum >= 0 && uviNum <= 2) {
                        uviIndex.setAttribute("class", "badge badge-success");
                    } else if (uviNum >= 3 && uviNum <= 7) {
                        uviIndex.setAttribute("class", "badge badge-warning");
                    } else if (uviNum <= 8) {
                        uviIndex.setAttribute("class", "badge badge-danger");
                    }
                    uviIndex.textContent = uviNum;
                    currentUV.innerHTML = "UV Index: ";
                    currentUV.appendChild(uviIndex);
                })
        })
    //Displays citys five day forecast
    var fiveDayW = "http://api.openweathermap.org/data/2.5/forecast?q=" + cityN + "&cnt=5&appid=" + apiKey + "&units=imperial";
    fetch(fiveDayW)
        .then(function (response) {
            return response.json();
        })

        .then(function (data) {
            //Using console.log to examine the data
            console.log(data);
            for (let b = 0; b < 5; b++) {
                console.log(data.list[b])
                var dtF = new Date(data.list[b].dt * 1000);
                var dayF = dtF.getUTCDate();
                var yearF = dtF.getUTCFullYear();
                var monthF = dtF.getUTCMonth() + 1;
                var iconcode = data.list[b].weather[0].icon;
                var iconurl = "http://openweathermap.org/img/w/" + iconcode + ".png";
                document.getElementById('wiconF' + [b]).setAttribute("class", "");
                document.getElementById('wiconF' + [b]).src = iconurl;
                document.getElementById('forecastD' + [b]).textContent = " (" + monthF + "/" + dayF + "/" + yearF + ")";
                document.getElementById('tempt' + [b]).textContent = "Temp: " + data.list[b].main.temp + " °F";
                document.getElementById('wind' + [b]).textContent = "Wind: " + data.list[b].wind.speed + " MPH";
                document.getElementById('humidity' + [b]).textContent = "Humidity: " + data.list[b].main.humidity + " %";
            }
        })
}
//When submit button is clicked displays users city current weather and 5 day forecast
fetchButton.addEventListener('click', function () {
    var city = document.getElementById('city').value;
    if (city) {
        getApi(city);
        //Saves users city to local storage
        storedCity.push(city);
        localStorage.setItem('storedCity', JSON.stringify(storedCity));
        searchH();
    } else {
        alert("Please enter a City");
    }
});

//Retrieves user city from local storage and appears as button
function searchH() {
    searchHistory.innerHTML = "";
    storedCity = JSON.parse(localStorage.getItem('storedCity'));
    var cityList = document.createElement('ul');
    cityList.setAttribute("class", "m- p-0");
    searchHistory.appendChild(cityList);
    if (!storedCity) {
        storedCity = [];
        return false;
    }
    for (let i = 0; i < storedCity.length; i++) {
        var historyBtn = document.createElement('button');
        historyBtn.setAttribute("class", "btn-secondary btn-block");
        console.log(storedCity[i]);
        historyBtn.value = storedCity[i];
        historyBtn.textContent = historyBtn.value;
        historyBtn.addEventListener("click", function () {
            getApi(storedCity[i]);
        })
        cityList.prepend(historyBtn);
    }
    //When refreshed users last city input is displayed
    if (storedCity.length > 0) {
        getApi(storedCity[storedCity.length - 1]);
    }

}
searchH();


