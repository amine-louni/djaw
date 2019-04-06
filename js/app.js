/** ==================================================================================
 * THIS CLASS IS RESPONSIBLE FOR FETCHING GEOMETRY  DATA FROM OPEN CAGE API          =
 * OPENCAGE API :                                                                    =
 * purpose : fetch the latitude and longtitude for the city to  add it as a parameter=
 * on the DARKSKY API request                                                        =
 *                                                                                   =
 * The OpenCage Geocoder provides reverse (lat/long to text) and forward-            =
 * -(text to lat/long) geocoding via a RESTful API.                                  =
 *                                                                                   =
 * Forward geocoding                                                                 =
 * END POINT: https://api.opencagedata.com/geocode/v1/json?q=[placename]&key=[key]   =
 *                                                                                   =
 *===================================================================================*/
class Geo {
  constructor() {
    this.key = "b3b648a4404a47d2af82b881894b3634";
    this.prefix = "https://api.opencagedata.com/geocode/v1/json?q=";
  }

  async getLocationRes(cityName) {
    const response = await fetch(
      `${this.prefix}${cityName}&key=${this.key}&pretty=1`
    );
    const resource = await response.json();

    return {
      resource
    };
  }
}
/** ==================================================================================
 * THIS CLASS IS RESPONSIBLE FOR FETCHING WEATHER  DATA FROM DAKSKY API              =
 * DARKSKY API :                                                                     =
 * purpose : fetch wather data to  disply ON the UI                                  =
 * on the DARKSKY API request                                                        =
 * The Dark Sky API allows you to look up the weather anywhere on the globe,         =
 * END POINT:https://api.darksky.net/forecast/[key]/[latitude],[longitude]           =
 *                                                                                   =
 *===================================================================================*/
class Weather {
  constructor() {
    this.key = "54157591944ff3bdefb10c322cccee87";
    this.cors = "https://cors-anywhere.herokuapp.com/";
    this.prefix = `${this.cors}https://api.darksky.net/forecast/${this.key}/`;
  }
  async fetchWeather(geoLocation) {
    console.log(geoLocation);
    const fetchWeatherResponse = await fetch(
      `${this.prefix}${geoLocation.lat},${geoLocation.lng}?units=si`
    );

    const fetchWeatherResourse = await fetchWeatherResponse.json();
    return fetchWeatherResourse;
  }
}

/** ==================================================================================
 *                                                                                   =
 *      THIS CLASS IS RESPONSIBLE FOR DISPLAYING  WEATHER DATA   ON THE UI           =
 *                                                                                   =
 *===================================================================================*/
class UI {
  constructor() {}
  static display(content, target) {
    document.querySelector(target).innerHTML = content;
  }
  static displayImg(src, className, parent) {
    const img = document.createElement("IMG");
    img.className = className;
    img.src = src;
    document.querySelector(parent).appendChild(img);
  }
}

/*INIT OBJECTS */
const getCityGeo = new Geo();
const getWeather = new Weather();

/** ==================================================================================
 *                                                                                   =
 *                                 MAIN FUNCTION:                                    =
 *                                                                                   =
 *===================================================================================*/
$(function() {
  //OVERLAY TOGGLE
  $(".menu").on("click", function() {
    $(".overlay").slideToggle();
    $(this).toggleClass("menu--on");
  });

  /* FETCH WATHER DATA FROM INPUT */
  $("#add-city-btn").on("click", function() {
    const inputCityVal = $("#location-input").val();
    UI.display(inputCityVal, ".main-display__city");

    const geoLocation = getCityGeo.getLocationRes(inputCityVal);
    geoLocation
      .then(data => data.resource.results[0].geometry)
      .then(data => getWeather.fetchWeather(data))
      .then(data => {
        console.log(data);
        UI.display(
          Math.trunc(data.currently.temperature),
          ".main-display__degrees"
        );
        UI.display(data.currently.summary, ".main-display__description-text");
        UI.display(
          Math.trunc(data.currently.windSpeed) + "<span> Km/s<span>",
          "#wind-speed"
        );
        UI.display(
          Math.trunc(data.currently.humidity) + "<span>%<span>",
          "#hum-pers"
        );
        UI.displayImg(
          `/img/summary-icons/${data.currently.icon}-white.png`,
          "main-display__description-icon",
          ".main-display__description"
        );
      });
  });
}); /*END OF MAIN FUNCTION */
