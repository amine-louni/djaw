/** ==================================================================================
 *                                                                                   =
 *                           SERVICE WORKER  Registeration                           =
 *                                                                                   =
 *===================================================================================*/
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("../sw.js")
      .then(reg => console.log("service worker registerd"))
      .catch(err => console.log(`Service worker err: ${err}`));
  });
}
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
    if (cityName !== "") {
      const response = await fetch(
        `${this.prefix}${cityName}&key=${this.key}&pretty=1`
      );
      const resource = await response.json();

      return {
        resource
      };
    }
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
 *       THIS CLASS IS RESPONSIBLE FOR  DISPLAY THE DATA ON THE UI                   =
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
  static createEl(tag, className, content, parent, time = 1500) {
    const box = document.createElement(tag);
    box.className = className;
    box.innerHTML = content;
    document.querySelector(parent).appendChild(box);
    setTimeout(() => {
      $(box).fadeOut();
    }, time);
  }
  static displayBg(bgSrc) {
    const url = `linear-gradient(to bottom, #07456f98,#009f9c71),url("/img/bg-images/${bgSrc}.jpg")`;
    document.querySelector(".main-display").style.backgroundImage = url;
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

    $(".loader-container").hide();
  }
  // display data from the cached cities on the overlay menu
  static displayCachedCities() {
    const cachedCities = ls.fetchCities();

    const overlayBoxContainer = document.querySelector(".overlay__cities");
    while (overlayBoxContainer.lastChild.id !== "cities-header") {
      overlayBoxContainer.removeChild(overlayBoxContainer.lastChild);
    }
    cachedCities.forEach((city, index) => {
      const overlayBox = document.createElement("DIV");
      overlayBox.className = "overlay__box";

      const overlayBoxCityName = document.createElement("SPAN");
      overlayBoxCityName.className = "overlay__box__city-name";
      overlayBoxCityName.innerHTML = city;

      const overlayBoxCityTimes = document.createElement("SPAN");
      overlayBoxCityTimes.className = "overlay__box__del";
      overlayBoxCityTimes.innerHTML = "&times;";
      overlayBoxCityTimes.setAttribute("id", "close");

      overlayBox.appendChild(overlayBoxCityName);
      overlayBox.appendChild(overlayBoxCityTimes);

      overlayBoxContainer.appendChild(overlayBox);
    });
  }
}
/** ==================================================================================
 *                                                                                   =
 *                          JQUERY MAIN FUNCTION FOR  THE UI                         =
 *                                                                                   =
 *===================================================================================*/
$(function() {
  //OVERLAY TOGGLE
  $(".menu").on("click", function() {
    $(".overlay").slideToggle();
    $(this).toggleClass("menu--on");
  });

  $(".overlay__cities").on("click", function(ev) {
    if (ev.target.id === "close") {
      const cityName = ev.target.previousElementSibling.textContent.toLocaleLowerCase();
      ls.deleteCity(cityName);
      $(ev.target.parentElement).fadeOut();
    } else if ((ev.target.className = "overlay__box__city-name")) {
      main(ev.target.innerHTML);
    }
  });

  /* FETCH WATHER DATA FROM INPUT */
  function getInputVal() {
    const inputCityVal = $("#location-input")
      .val()
      .trim()
      .toLowerCase();
    console.log(inputCityVal);
    return inputCityVal;
  }
  $("#add-city-btn").on("click", function() {
    if (getInputVal() !== "") {
      UI.displayCachedCities();
      main(getInputVal());
      UI.displayCachedCities();
    } else {
      UI.createEl(
        "DIV",
        "alert alert-secondary text-center",
        "you need to fill the field",
        ".overlay"
      );
    }
  });
});
/** ==================================================================================
 *                                                                                   =
 *       THIS CLASS IS RESPONSIBLE FOR LOCAL STORAGE FETHCING/STROTING DATA          =
 *                                                                                   =
 *===================================================================================*/
class Ls {
  constructor(storageName) {
    this.storageName = storageName;
  }

  addCity(city) {
    let cities;
    if (!JSON.parse(localStorage.getItem(this.storageName))) {
      cities = [];
    } else {
      cities = JSON.parse(localStorage.getItem(this.storageName));
    }
    if (!cities.includes(city)) {
      if (city !== "") {
        cities.push(city);
        localStorage.setItem(this.storageName, JSON.stringify(cities));
      } else {
        console.error("empty string");
      }
    }
  }

  fetchCity() {
    let city;
    let cachedCities = JSON.parse(localStorage.getItem(this.storageName));
    if (cachedCities && cachedCities.length) {
      cachedCities = JSON.parse(localStorage.getItem(this.storageName));
      city = cachedCities[cachedCities.length - 1];
    } else {
      $(".overlay").slideDown();
      UI.createEl(
        "DIV",
        "alert alert-danger text-center",
        "you need to add your location !",
        ".overlay",
        4000
      );
      $(".menu").addClass("menu--on");

      city = "alger";
    }
    return city;
  }
  fetchCities() {
    let cachedCities = JSON.parse(localStorage.getItem(this.storageName));

    if (cachedCities && cachedCities !== []) {
      const cities = JSON.parse(localStorage.getItem(this.storageName));
      return cities;
    } else {
      return ["paris"];
    }
  }
  deleteCity(cityName) {
    if (JSON.parse(localStorage.getItem(this.storageName))) {
      const cities = JSON.parse(localStorage.getItem(this.storageName));
      cities.splice(cities.indexOf(cityName), 1);
      localStorage.setItem(this.storageName, JSON.stringify(cities));
    }
  }
}

/*INIT OBJECTS */
const getCityGeo = new Geo();
const getWeather = new Weather();
const ls = new Ls("cities");

/** ==================================================================================
 *                                                                                   =
 *                                 MAIN FUNCTION:                                    =
 *                                                                                   =
 *===================================================================================*/
function main(city) {
  UI.display(
    `<i class="fas fa-map-marker-alt"></i> ` + city,
    ".main-display__city"
  );
  ls.addCity(city);

  const geoLocation = getCityGeo.getLocationRes(city);
  geoLocation
    .then(data => {
      if (data !== undefined) {
        return data.resource.results[0].geometry;
      }
    })
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
        `img/summary-icons/${data.currently.icon}-white.png`,
        "main-display__description-icon",
        ".main-display__deg-desc-wrapper"
      );
      //BOTTOM PANEL
      UI.displayHourly(data.hourly.data);
      UI.displayDaily(data.daily.data);
      $(".overlay").slideUp();
      $(".menu").removeClass("menu--on");
    });
}

/** ==================================================================================
 *                                                                                   =
 *                                 ONLOAD FUNCTION:                                  =
 *                                                                                   =
 *===================================================================================*/
window.onload = function() {
  main(ls.fetchCity());
  UI.displayCachedCities();
};
