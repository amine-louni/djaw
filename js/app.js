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
  static formatAMPM(date) {
    var hours = date.getHours();

    var ampm = hours >= 12 ? "pm" : "am";
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'

    var strTime = hours + ampm;
    return strTime;
  }
  static displayBg(bgSrc) {
    const url = `url("/img/bg-images/${bgSrc}.jpg")`;
    document.querySelector(".main-display").style.backgroundImage = url;
    console.log(url);
  }
  static display(content, target) {
    document.querySelector(target).innerHTML = content;
  }
  static displayImg(src, className, parent) {
    const parentElement = document.querySelector(parent);
    while (parentElement.contains(document.querySelector("." + className))) {
      parentElement.removeChild(document.querySelector("." + className));
    }

    const img = document.createElement("IMG");
    img.className = className;
    img.src = src;

    parentElement.appendChild(img);
  }
  static displayHourly(array) {
    let box, time, degree, icon;
    const parentElement = document.querySelector(".sub-display--hourly");
    parentElement.innerHTML = ``;
    array.every((element, index) => {
      box = document.createElement("DIV");
      box.className = "sub-display__box text-center d-flex  flex-column";

      time = document.createElement("DIV");
      time.classList.add("sub-display__box__time");
      time.textContent = this.formatAMPM(new Date(element.time * 1000));

      degree = document.createElement("DIV");
      degree.classList.add("sub-display__box__degree");
      degree.innerHTML = Math.trunc(element.temperature) + "&deg;";

      icon = document.createElement("IMG");
      icon.className = "sub-display__box__icon  ";
      icon.setAttribute("src", `img/summary-icons/${element.icon}-white.png`);

      //append sub-sub boxes to the sub
      box.appendChild(icon);
      box.appendChild(time);
      box.appendChild(degree);

      // add box to parent element
      parentElement.appendChild(box);

      if (index === 6) {
        return false;
      } else {
        return true;
      }
    });
  }
  static displayDaily(array) {
    let box, time, degree, icon, days;
    days = ["Sun", "Mon", "Thu", "Wed", "Thurs", "Fri", "Sat"];
    const parentElement = document.querySelector(".sub-display--daily");
    parentElement.innerHTML = ``;
    array.every((element, index) => {
      box = document.createElement("DIV");
      box.className = "sub-display__box text-center d-flex  flex-column";

      time = document.createElement("DIV");
      time.classList.add("sub-display__box__time");
      time.textContent = days[new Date(element.time * 1000).getDay()];

      degree = document.createElement("DIV");
      degree.classList.add("sub-display__box__degree");
      degree.innerHTML = `${Math.trunc(
        element.temperatureMin
      )}&deg;/ ${Math.trunc(element.temperatureMax)}&deg;`;

      icon = document.createElement("IMG");
      icon.className = "sub-display__box__icon  ";
      icon.setAttribute("src", `img/summary-icons/${element.icon}-white.png`);

      //append sub-sub boxes to the sub
      box.appendChild(icon);
      box.appendChild(time);
      box.appendChild(degree);

      // add box to parent element
      parentElement.appendChild(box);

      if (index === 4) {
        return false;
      } else {
        return true;
      }
    });
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
        //Main Panel
        UI.displayBg(data.currently.icon);
        UI.display(
          Math.trunc(data.currently.temperature) + "&deg;",
          ".main-display__degrees"
        );
        UI.display(data.currently.summary, ".main-display__description-text");
        UI.display(
          Math.trunc(data.currently.windSpeed) + "<span> Km/s<span>",
          "#wind-speed"
        );
        UI.display(
          Math.trunc(data.currently.humidity * 100) + "<span>%<span>",
          "#hum-pers"
        );
        UI.displayImg(
          `/img/summary-icons/${data.currently.icon}-white.png`,
          "main-display__description-icon",
          ".main-display__deg-desc-wrapper"
        );
        //BOTTOM PANEL
        UI.displayHourly(data.hourly.data);
        UI.displayDaily(data.daily.data);
      });
  });
}); /*END OF MAIN FUNCTION */
