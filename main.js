const API_KEY = "2b23c28b61c36ae765e53fa3fa73c6c6";

const getCurrentWeatherData = async () =>{
    const city = "pune";
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
    return response.json();
}

const getHourlyForecast = async({ name: city }) => {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`)
    const data = await response.json();
    return data.list.map(forecast=>{
        const {main:{temp,temp_max,temp_min},dt ,dt_txt, weather:[{description,icon}]  } = forecast;
        return {temp, temp_max, temp_min, dt, dt_txt, description, icon}
    });
}

const formatTemperature = (temp) => `${temp?.toFixed(1)}°`;

const createIconUrl = (icon) => `http://openweathermap.org/img/wn/${icon}@2x.png`

const loadCurrentForecast = ({name,main:{temp,temp_max,temp_min},weather:[{description}]}) =>{
    const currentforecastElement = document.querySelector("#current-forecast")
    currentforecastElement.querySelector(".city").textContent = name;
    currentforecastElement.querySelector(".temp").textContent = formatTemperature(temp);
    currentforecastElement.querySelector(".description").textContent = description;
    currentforecastElement.querySelector(".min-max-temp").textContent = `H: ${formatTemperature(temp_max)} L:${formatTemperature(temp_min)}`;
    // <p class="temp">Temp</p>
    // <p class="description">Description</p>
    // <p class="min-max-temp">H L</p>
}

const loadHourlyForecast = (hourlyForecast) => {
    console.log(hourlyForecast);
    let dataFor12Hours = hourlyForecast.slice(1, 13);
    const hourlyContainer = document.querySelector(".hourly-container");
    let innerHTMLString = ``;

    for(let {temp, icon, dt_txt} of dataFor12Hours){
        innerHTMLString += ` <article>
        <h3 class="time">${dt_txt.split(" ")[1]}</h3>
        <img class="icon" src="${createIconUrl(icon)}" />
        <p class="hourly-temp">${formatTemperature(temp)}</p>
    </article>`
    }
    hourlyContainer.innerHTML = innerHTMLString
}

const loadFeelsLike = ({main : {feels_like}}) => {
    let container = document.querySelector("#feels-like");
    container.querySelector(".feels-like-temp").textContent = formatTemperature(feels_like);
}

const loadHumidity = ({main : {humidity}}) => {
    let container = document.querySelector("#humidity");
    container.querySelector(".humidity-value").textContent = `${humidity} %`;
}

document.addEventListener("DOMContentLoaded", async() => {
    const currentWeather =  await getCurrentWeatherData();
    loadCurrentForecast(currentWeather);
    const hourlyForecast = await getHourlyForecast(currentWeather);
    loadHourlyForecast(hourlyForecast);
    loadFeelsLike(currentWeather);
    loadHumidity(currentWeather);
})