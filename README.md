# djaw - weather forecast app written in Javascript

> ps : this app is not finished yet !, you can follow the changes by watching the repo .
 

 
 
 
"Djaw" is a small Javascript  project that makes use of the [Dark Sky](https://darksky.net)
service for fetching and displaying weather data and forecasts based on a given location (latitude & longtitude).

 


## Demo

A demo site running this little app can be found [here](https://amine-louni.github.io/djaw/).


## Why?

Points of interests:

* Building an app with Javascript (of course!)
* Building an app based on the [OpenWeatherMap API](https://darksky.net/)
* Building an app based on the [Open Cage API](https://opencagedata.com/api/)
* customizing bootstrap
* Defining a service for fetching weather data from openweathermap.com  using async/await and promises
* Defining a custom directive for instantly embedding sort of "weather data day panel"
 

Djaw-app uses:
* [Bootstrap v4.0.0](https://github.com/twbs/bootstrap)
* [font awsome](https://fontawesome.com/)
* [google fonts](https://fonts.google.com/)


## Installation

### Clone repository and install dependencies

via git and npm:

```
$ git clone https://github.com/amine-louni/djaw.git
$ cd [djaw]
$ npm install
```

### Run application via server

You can pick one of these options:

1. serve this repository with a webserver of-your-choice.

2. install live-server npm 

2. use vscode plugin live-server

 

## Contribute!

Ideas, suggestions and pull requests are welcome. Someone willing to suggest a fancy (responsive) design
for desktop and mobile use?


## Todo

* Make use (and parse) more provided weather data (+ add filters, formatting)
* Internationalization / Localization
* Provide "use current location" and fetch data via lat/lon
* Build a view with n-day-forecast in typical weather app style
* Improve UI/UX by integrating a fancy design, transitions, effects


## License

[The MIT License](http://opensource.org/licenses/MIT)

All data provided by the great service and API of [OpenWeatherMap](http://openweathermap.org/).

Copyright (c) 2019 Amine Louni 

