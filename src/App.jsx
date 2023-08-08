/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [data, setData] = useState({});
  const [location, setLocation] = useState("");
  const [temp, setTemp] = useState("");
  const [windSpeed, setWindSpeed] = useState("");
  const [feelsLike, setFeelsLike] = useState("");
  const [humidity, setHumidity] = useState("");
  const [description, setDescription] = useState("");
  const [enteredLocation, setEnteredLocation] = useState("");
  const [celsiusOrFarenheit, setCelsiusOrFarenheit] = useState("C")

  const today = new Date();
  const day = today.toString();
  const arrayOfWords = day.split(" ");
  const myDate =
    arrayOfWords[0] + ", " + arrayOfWords[1] + " " + arrayOfWords[2];

  const convertCelsius = (temp) => {
    return ((temp - 32) * 0.5556).toFixed(2);
  };

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=imperial&appid=67976d3f73c8c020f42d420289745def`;

  const searchLocation = async (event) => {
    if (event.key === "Enter") {
      try {
        const response = await fetch(url);
        if (response.ok) {
          const data = await response.json();
          setData(data);

          let cityAndCountry = data.name + ", " + data.sys.country;
          setEnteredLocation(cityAndCountry);
          if (data.sys.country == 'US'){
            setCelsiusOrFarenheit("F");
          } else setCelsiusOrFarenheit("C");
          setHumidity(data.main.humidity);
          setWindSpeed(data.wind.speed);
          setTemp(convertCelsius(data.main.temp));
          setFeelsLike(convertCelsius(data.main.feels_like));

          const iconData = data.weather[0].icon;
          document.querySelector(".icon").src =
            "https://openweathermap.org/img/wn/" + iconData + "@2x.png";
        } else {
          console.error("Failed to fetch weather data");
        }
      } catch (error) {
        console.error("An error occurred:", error);
      }
      setLocation("");
    }
  };

  async function fetchWeatherAtHome() {
    try {
      const response = await fetch(
        "https://api.openweathermap.org/data/2.5/weather?lat=45.47&lon=-73.83&units=metric&appid=67976d3f73c8c020f42d420289745def"
      );

      if (response.ok) {
        const data = await response.json();
        let cityAndCountry = data.name + ", " + data.sys.country;
        setEnteredLocation(cityAndCountry);
        setTemp(data.main.temp);
        setFeelsLike(data.main.feels_like);
        setWindSpeed(data.wind.speed);
        setHumidity(data.main.humidity);
        setDescription(data.weather[0].main);
      } else {
        console.error("Failed to fetch weather data");
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  }

  useEffect(() => {
    fetchWeatherAtHome();
  }, []);

  return (
    <div className="app">
      <div className="container">
        <div className="search">
          <input
            id="searchInput"
            value={location}
            onChange={(event) => setLocation(event.target.value)}
            onKeyPress={searchLocation}
            placeholder="Enter Location"
            type="text"
          />
        </div>
        <h2 className="location">
          {" "}
          {myDate}
          &nbsp;&nbsp;&nbsp;
          {enteredLocation}
        </h2>
        <div className="temp">
          {temp} °<span id="tempSpan">{celsiusOrFarenheit}</span>{" "}
        </div>
        <img src="" className="icon"></img>
        <div className="description">{description}</div>
        <div className="bottom">
          <div className="feelsLike">
            Feels like:
            {feelsLike} °<span id="celsiusBtm">C</span>
          </div>
          <div className="humidity">Humidity: {humidity}%</div>
          <div className="wind">Wind speed: {windSpeed}</div>
        </div>
      </div>
    </div>
  );
}

export default App;