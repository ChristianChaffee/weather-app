const account_button = document.getElementById('account-button-id');
const menu_button = document.getElementById('menu-button-id');
const settings_button = document.getElementById('settings-button-id');
const collapse_button = document.getElementById('collapse-button-id');
const exit_button = document.getElementById('exit-button-id');

const reg_main_container = document.getElementById('registration-main-container-id');
const account_exit_button = document.getElementById('account-exit-button-id');
const main_account_button = document.getElementById('main-account-button-id');
const email_input = document.getElementById('email-input-id');
const password_input = document.getElementById('password-input-id');
const email_error = document.getElementById('email-error-id');
const password_error = document.getElementById('password-error-id');
const registration_success_container = document.getElementById('registration-success-container-id');
const registration_head_container_text = document.getElementById('registration-head-container-text-id');
const account_text_link_label = document.getElementById('account-text-link-label-id');

const account_menu = document.getElementById('account-menu-main-container-id');
const account_menu_container = document.getElementById('account-menu-container-id');
const account_menu_email_label = document.getElementById('account-menu-email-label-id');
const account_settings_button_info = document.getElementById('account-settings-button-info-id');
const account_settings_button_exit = document.getElementById('account-settings-button-exit-id');
const account_settings_button_close = document.getElementById('account-settings-button-close-id');
const account_info_container = document.getElementById('account-info-container-id');
const account_info_label_email = document.getElementById('account-info-label-email-id');
const account_info_label_time = document.getElementById('account-info-label-time-id');
const account_info_exit_button = document.getElementById('account-info-exit-button-id');

const settings_main_container = document.getElementById('settings-main-container-id');
const settings_exit_button = document.getElementById('settings-exit-button-id');
const settings_screen_resolution_button = document.getElementById('settings-screen-resolution-button-id');
const settings_screen_resolution_right = document.getElementById('settings-screen-resolution-right-id');
const settings_screen_resolution_left = document.getElementById('settings-screen-resolution-left-id');
const settings_reset_button = document.getElementById('settings-reset-button-id');

const city_input_field = document.getElementById('city-input-field-id');

const air_pollution_state_label = document.getElementById('air-pollution-state-label-id');

const find_city_button = document.getElementById('find-city-button-id');

const weather_container = document.getElementById('weather-container-id');

const weather_icon_img = document.getElementById('weather-icon-img-id');
const today_weather_city = document.getElementById('today-weather-city-id');
const today_weather_temperature = document.getElementById('today-weather-temperature-id');
const today_weather_feels_like_temperature = document.getElementById('today-weather-feels-like-temperature-id');
const today_wind_speed = document.getElementById('today-wind-speed-id');
const today_humidity = document.getElementById('today-humidity-id');
const today_sunrise = document.getElementById('today-sunrise-id');
const today_sunset = document.getElementById('today-sunset-id');

const co_label = document.getElementById('co-label');
const no_label = document.getElementById('no-label');
const no2_label = document.getElementById('no2-label');
const o3_label = document.getElementById('o3-label');
const so2_label = document.getElementById('so2-label');
const pm25_label = document.getElementById('pm25-label');

const menu_main_container = document.getElementById('menu-main-container-id');
const menu_button_exit = document.getElementById('menu-button-exit-id');
const menu_button_moon = document.getElementById('menu-button-moon-id');
const menu_button_travel = document.getElementById('menu-button-travel-id');

const moon_main_container = document.getElementById('moon-main-container-id');
const moon_container = document.getElementById('moon-container-id');

let settings_render;
let resolutions_render;

function blurElement(element, px){
    element.style.filter = `blur(${px}px)`;
}

function showAccountMenu(){
    if(settings_render.accountId == 0){
        reg_main_container.style.display = 'flex';
    }
    else{
        account_info_container.style.display = 'none';
        account_menu.style.display = 'flex';
        account_menu_email_label.innerHTML = settings_render.accountEmail;
        account_menu_container.style.pointerEvents = 'auto';
    }

    hideMainElements(true);
}

function hideAccountMenu(){
    reg_main_container.style.display = 'none';
    account_menu.style.display = 'none';

    hideMainElements(false);
}

function showAccountError(show, type, text){
    switch(show){
        case 0:{
            switch(type){
                case 0:{
                    email_error.style.display = 'none';
                    break;
                }
                case 1:{
                    password_error.style.display = 'none';
                }
            }
            break;
        }
        case 1:{
            switch(type){
                case 0:{
                    email_error.innerHTML = text;
                    email_error.style.display = 'block';
                    break;
                }
                case 1:{
                    password_error.innerHTML = text;
                    password_error.style.display = 'block';
                    break;
                }
            }
            break;
        }
    }
}

function validatePassword(password) {
    const minLength = 8;
    const lengthCheck = new RegExp(`^.{${minLength},}$`);
    const uppercaseCheck = /[A-Z]/;
    const lowercaseCheck = /[a-z]/;
    const digitCheck = /\d/;
    const specialCharCheck = /[!@#$%^&*]/;
  
    if (!lengthCheck.test(password)) {
      return `Пароль должен быть не менее ${minLength} символов.`;
    }
    if (!uppercaseCheck.test(password)) {
      return "Пароль должен содержать хотя бы одну букву в верхнем регистре.";
    }
    if (!lowercaseCheck.test(password)) {
      return "Пароль должен содержать хотя бы одну букву в нижнем регистре.";
    }
    if (!digitCheck.test(password)) {
      return "Пароль должен содержать хотя бы одну цифру.";
    }
    if (!specialCharCheck.test(password)) {
      return "Пароль должен содержать хотя бы один специальный символ (!@#$%^&*).";
    }
  
    return "";
  }

function showNotification(backgroundColor, text){
    const newNotification = document.createElement('div');
    newNotification.classList.add('notification-container');
    newNotification.textContent = text;
    newNotification.style.backgroundColor = backgroundColor;
    document.getElementById('notification-main-container-id').appendChild(newNotification);

    setTimeout(() => {
        newNotification.style.opacity = '0';
    }, 3000);
}

function updateTodayWeather(data_weather){
    weather_icon_img.src = `./assets/${data_weather.weather[0].icon}.png`;
    
    if(Math.round(data_weather.main.temp) > 0){
        today_weather_temperature.innerHTML = `+${Math.round(data_weather.main.temp)} °C`;
    }
    else{
        today_weather_temperature.innerHTML = `${Math.round(data_weather.main.temp)} °C`;
    }

    if(Math.round(data_weather.main.feels_like) > 0){
        today_weather_feels_like_temperature.innerHTML = `Ощущается как: +${Math.round(data_weather.main.feels_like)} °C`;
    }
    else{
        today_weather_feels_like_temperature.innerHTML = `Ощущается как: ${Math.round(data_weather.main.feels_like)} °C`;
    }

    today_wind_speed.innerHTML = `${Math.round(data_weather.wind.speed)} М/С`;
    today_humidity.innerHTML = `${Math.round(data_weather.main.humidity)}%`;
    today_weather_city.innerHTML = settings_render.city;

    let date = new Date(data_weather.sys.sunrise * 1000);
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    today_sunrise.innerHTML = formattedTime;

    date = new Date(data_weather.sys.sunset * 1000);
    hours = date.getHours();
    minutes = date.getMinutes();
    formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    today_sunset.innerHTML = formattedTime;
}

function updateAirPollution(air_data){
    switch(air_data.list[0].main.aqi){
        case 1:{
            air_pollution_state_label.style.color = '#34cf5d';
            air_pollution_state_label.innerHTML = 'Хорошее';
            break;
        }
        case 2:{
            air_pollution_state_label.style.color = '#7ed56f';
            air_pollution_state_label.innerHTML = 'Нормальное';
            break;
        }
        case 3:{
            air_pollution_state_label.style.color = '#f1c40f';
            air_pollution_state_label.innerHTML = 'Умеренное';
            break;
        }
        case 4:{
            air_pollution_state_label.style.color = '#e67e22';
            air_pollution_state_label.innerHTML = 'Плохое';
            break;
        }
        case 5:{
            air_pollution_state_label.style.color = '#c0392b';
            air_pollution_state_label.innerHTML = 'Очень плохое';
            break;
        }
    }

    let color_co, color_no, color_no2, color_03, color_so2, color_pm25;
    if(air_data.list[0].components.co <= 4399.0){
        color_co = '#34cf5d';
    }
    else if(air_data.list[0].components.co <= 9399.0){
        color_co = '#7ed56f';
    }
    else if(air_data.list[0].components.co <= 12399.0){
        color_co = '#f1c40f';
    }
    else if(air_data.list[0].components.co <= 15399.0){
        color_co = '#e67e22';
    }
    else{
        color_co = '#c0392b'; 
    }

    color_no = '#34cf5d';

    if(air_data.list[0].components.no2 <= 39.0){
        color_no2 = '#34cf5d';
    }
    else if(air_data.list[0].components.no2 <= 69.0){
        color_no2 = '#7ed56f';
    }
    else if(air_data.list[0].components.no2 <= 149.9){
        color_no2 = '#f1c40f';
    }
    else if(air_data.list[0].components.no2 <= 199.0){
        color_no2 = '#e67e22';
    }
    else{
        color_no2 = '#c0392b'; 
    }

    if(air_data.list[0].components.o3 <= 59.0){
        color_03 = '#34cf5d';
    }
    else if(air_data.list[0].components.o3 <= 99.0){
        color_03 = '#7ed56f';
    }
    else if(air_data.list[0].components.o3 <= 139.9){
        color_03 = '#f1c40f';
    }
    else if(air_data.list[0].components.o3 <= 179.0){
        color_03 = '#e67e22';
    }
    else{
        color_03 = '#c0392b'; 
    }

    if(air_data.list[0].components.so2 <= 19.0){
        color_so2 = '#34cf5d';
    }
    else if(air_data.list[0].components.so2 <= 79.0){
        color_so2 = '#7ed56f';
    }
    else if(air_data.list[0].components.so2 <= 249.9){
        color_so2 = '#f1c40f';
    }
    else if(air_data.list[0].components.so2 <= 349.0){
        color_so2 = '#e67e22';
    }
    else{
        color_so2 = '#c0392b'; 
    }

    if(air_data.list[0].components.pm2_5 <= 9.0){
        color_pm25 = '#34cf5d';
    }
    else if(air_data.list[0].components.pm2_5 <= 24.0){
        color_pm25 = '#7ed56f';
    }
    else if(air_data.list[0].components.pm2_5 <= 49.9){
        color_pm25 = '#f1c40f';
    }
    else if(air_data.list[0].components.pm2_5 <= 74.0){
        color_pm25 = '#e67e22';
    }
    else{
        color_pm25 = '#c0392b'; 
    }

    co_label.innerHTML = `CO: <span style="color: ${color_co};">${air_data.list[0].components.co.toFixed(2)}</span> μg/m<sup>3</sup>`;
    no_label.innerHTML = `NO: <span style="color: ${color_no};">${air_data.list[0].components.no.toFixed(2)}</span> μg/m<sup>3</sup>`;
    no2_label.innerHTML = `NO<sub>2</sub>: <span style="color: ${color_no2};">${air_data.list[0].components.no2.toFixed(2)}</span> μg/m<sup>3</sup>`;
    o3_label.innerHTML = `O<sub>3</sub>: <span style="color: ${color_03};">${air_data.list[0].components.o3.toFixed(2)}</span> μg/m<sup>3</sup>`;
    so2_label.innerHTML = `SO<sub>2</sub>: <span style="color: ${color_so2};">${air_data.list[0].components.so2.toFixed(2)}</span> μg/m<sup>3</sup>`;
    pm25_label.innerHTML = `PM<sub>2.5</sub>: <span style="color: ${color_pm25};">${air_data.list[0].components.pm2_5.toFixed(2)}</span> μg/m<sup>3</sup>`;
}

function updateFontsResolution(){
    switch(settings_render.resolutionId){
        case 0:{
            document.getElementById('air-pollution-other-info-container-id').style.fontSize = '15px';
            today_weather_city.style.fontSize = '25px';
            today_weather_temperature.style.fontSize = '20px';
            today_weather_feels_like_temperature.style.fontSize = '13px';
            today_wind_speed.style.fontSize = '13px';
            today_humidity.style.fontSize = '13px';
            today_sunrise.style.fontSize = '13px';
            today_sunset.style.fontSize = '13px';
            document.querySelectorAll('#forecast-weather-container-id label').forEach(label => {
                label.style.fontSize = '22px';
            });
            break;
        }
        case 1:{
            document.getElementById('air-pollution-other-info-container-id').style.fontSize = '19px';
            today_weather_city.style.fontSize = '32px';
            today_weather_temperature.style.fontSize = '25px';
            today_weather_feels_like_temperature.style.fontSize = '16px';
            today_wind_speed.style.fontSize = '16px';
            today_humidity.style.fontSize = '16px';
            today_sunrise.style.fontSize = '16px';
            today_sunset.style.fontSize = '16px';
            document.querySelectorAll('#forecast-weather-container-id label').forEach(label => {
                label.style.fontSize = '28px';
            });
            break;
        }
        case 2:{
            document.getElementById('air-pollution-other-info-container-id').style.fontSize = '24px';
            today_weather_city.style.fontSize = '40px';
            today_weather_temperature.style.fontSize = '32px';
            today_weather_feels_like_temperature.style.fontSize = '20px';
            today_wind_speed.style.fontSize = '20px';
            today_humidity.style.fontSize = '20px';
            today_sunrise.style.fontSize = '20px';
            today_sunset.style.fontSize = '20px';
            document.querySelectorAll('#forecast-weather-container-id label').forEach(label => {
                label.style.fontSize = '35px';
            });
            break;
        }
        case 3:{
            document.getElementById('air-pollution-other-info-container-id').style.fontSize = '26px';
            today_weather_city.style.fontSize = '43px';
            today_weather_temperature.style.fontSize = '32px';
            today_weather_feels_like_temperature.style.fontSize = '22px';
            today_wind_speed.style.fontSize = '22px';
            today_humidity.style.fontSize = '22px';
            today_sunrise.style.fontSize = '22px';
            today_sunset.style.fontSize = '22px';
            document.querySelectorAll('#forecast-weather-container-id label').forEach(label => {
                label.style.fontSize = '38px';
            });
            break;
        }
    }
}

function hideMainElements(hide){
    if(hide){
        blurElement(account_button, 8);
        blurElement(menu_button, 8);
        blurElement(settings_button, 8);
        blurElement(collapse_button, 8);
        blurElement(exit_button, 8);

        weather_container.style.display = 'none';
        document.getElementById('city-container-id').style.display = 'none';
    }
    else{
        blurElement(account_button, 0);
        blurElement(menu_button, 0);
        blurElement(settings_button, 0);
        blurElement(collapse_button, 0);
        blurElement(exit_button, 0);

        weather_container.style.display = 'flex';
        document.getElementById('city-container-id').style.display = 'flex';
    }
}

function getFormattedDate() {
    const today = new Date();

    const months = [
        "января", "февраля", "марта", "апреля", "мая", "июня",
        "июля", "августа", "сентября", "октября", "ноября", "декабря"
    ];

    const day = today.getDate(); 
    const month = months[today.getMonth()]; 

    return `${day} ${month}`;
}

function updateFiveDaysWeather(five_days_result){
    const days = ["Воскресенье", "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"];
    let is_first = true;
    let day_id = 0;
    let count = 0;

    document.getElementById('five-days-list-container-id').innerHTML = '';

    for(let i = 0; i < five_days_result.list.length; i++){
        if(count > 4){
            break;
        }

        if(is_first){
            const date = new Date(five_days_result.list[i].dt * 1000);
            day_id = date.getDay();
            is_first = false;
            count++;

            let divElementMainContainer = document.createElement("div");
            divElementMainContainer.classList.add("day-weather-main-container");
            divElementMainContainer.innerHTML = `${days[day_id]}`;

            let divElementContainer = document.createElement("div");
            divElementContainer.classList.add('day-weather-container');

            five_days_result.list[i].main.temp -= 273.15;
            five_days_result.list[i].main.feels_like -= 273.15;
            divElementContainer.innerHTML = `<img src="./assets/${five_days_result.list[i].weather[0].icon}.png">`;

            if(five_days_result.list[i].main.temp  > 0){
                divElementContainer.innerHTML = `${divElementContainer.innerHTML} +${Math.round(five_days_result.list[i].main.temp)} °C`;
            }
            else{
                divElementContainer.innerHTML = `${divElementContainer.innerHTML} ${Math.round(five_days_result.list[i].main.temp)} °C`;
            }

            if(five_days_result.list[i].main.feels_like  > 0){
                divElementContainer.innerHTML = `${divElementContainer.innerHTML} (как: +${Math.round(five_days_result.list[i].main.feels_like)} °C)`;
            }
            else{
                divElementContainer.innerHTML = `${divElementContainer.innerHTML} (как: ${Math.round(five_days_result.list[i].main.feels_like)} °C)`;
            }

            divElementMainContainer.appendChild(divElementContainer);
            document.getElementById('five-days-list-container-id').appendChild(divElementMainContainer);
        }
        else{
            const date = new Date(five_days_result.list[i].dt * 1000);
            if(date.getDay() != day_id){
                day_id = date.getDay()
                count++;

                let divElementMainContainer = document.createElement("div");
                divElementMainContainer.classList.add("day-weather-main-container");
                divElementMainContainer.innerHTML = `${days[day_id]}`;

                let divElementContainer = document.createElement("div");
                divElementContainer.classList.add('day-weather-container');

                five_days_result.list[i].main.temp -= 273.15;
                five_days_result.list[i].main.feels_like -= 273.15;
                divElementContainer.innerHTML = `<img src="./assets/${five_days_result.list[i].weather[0].icon}.png">`;

                if(five_days_result.list[i].main.temp  > 0){
                    divElementContainer.innerHTML = `${divElementContainer.innerHTML} +${Math.round(five_days_result.list[i].main.temp)} °C`;
                }
                else{
                    divElementContainer.innerHTML = `${divElementContainer.innerHTML} ${Math.round(five_days_result.list[i].main.temp)} °C`;
                }

                if(five_days_result.list[i].main.feels_like  > 0){
                    divElementContainer.innerHTML = `${divElementContainer.innerHTML} (как: +${Math.round(five_days_result.list[i].main.feels_like)} °C)`;
                }
                else{
                    divElementContainer.innerHTML = `${divElementContainer.innerHTML} (как: ${Math.round(five_days_result.list[i].main.feels_like)} °C)`;
                }

                divElementMainContainer.appendChild(divElementContainer);
                document.getElementById('five-days-list-container-id').appendChild(divElementMainContainer);
            }
        }
    }
}

//=====================================================================================
account_button.addEventListener("click", (event) => {
    showAccountMenu();
});

account_exit_button.addEventListener("click", (event) => {
    hideAccountMenu();
});

main_account_button.addEventListener("click", (event) => {
    if(registration_head_container_text.innerHTML == 'Регистрация'){
        const email_regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        if(email_regex.test(email_input.value) == false){
            showAccountError(1, 0, "* Вы некорректно ввели E-Mail");
            return false;
        }
        else{
            showAccountError(0, 0, "");
        }

        const valid_password_text = validatePassword(password_input.value);
        if(valid_password_text.length <= 0){
            showAccountError(0, 1, "");
        }
        else{
            showAccountError(1, 1, valid_password_text);
            return false;
        }

        window.api.sendToMain('check-valid-account', { email: email_input.value });
    }
    else{
        window.api.sendToMain('check-valid-account-password', { email: email_input.value, password: password_input.value });
    }
});

registration_success_container.addEventListener("click", (event) => {
    registration_success_container.style.display = 'none';
    hideAccountMenu();
});

document.getElementById("account-text-link-id").addEventListener("click", function(event) {
    event.preventDefault();
    if(registration_head_container_text.innerHTML == 'Регистрация'){
        registration_head_container_text.innerHTML = 'Авторизация';
        main_account_button.innerHTML = 'Авторизоваться';
        document.getElementById('account-text-link-id').textContent = 'Назад к регистрации';
    }
    else{
        registration_head_container_text.innerHTML = 'Регистрация';
        main_account_button.innerHTML = 'Регистрация';
        document.getElementById('account-text-link-id').textContent = 'Авторизация';
    }
});

account_settings_button_close.addEventListener("click", function(event) {
    hideAccountMenu();
});

account_settings_button_info.addEventListener("click", function(event) {
    account_menu_container.style.pointerEvents = 'none';

    account_info_label_email.innerHTML = `Эл. почта:<br> ${settings_render.accountEmail}`;
    account_info_label_time.innerHTML = `Дата и время создания аккаунта:<br> ${settings_render.accountCreateTime}`;

    blurElement(account_menu_container, 8);
    account_info_container.style.display = 'flex';
});

account_settings_button_exit.addEventListener("click", function(event) {
    showNotification('#4caf50', "Вы успешно вышли из аккаунта");
    hideAccountMenu();
    window.api.sendToMain('exit-account', { });
});

account_info_exit_button.addEventListener("click", function(event) {
    account_menu_container.style.pointerEvents = 'auto';

    blurElement(account_menu_container, 0);
    account_info_container.style.display = 'none';
});

settings_button.addEventListener("click", function(event) {
    hideMainElements(true);
    settings_main_container.style.display = 'flex';

    settings_screen_resolution_button.innerHTML = `${resolutions_render[settings_render.resolutionId][0]}x${resolutions_render[settings_render.resolutionId][1]}`;
});

settings_screen_resolution_right.addEventListener("click", function(event) {
    settings_render.resolutionId++;
    if(settings_render.resolutionId >= resolutions_render.length){
        settings_render.resolutionId = 0;
    }
    settings_screen_resolution_button.innerHTML = `${resolutions_render[settings_render.resolutionId][0]}x${resolutions_render[settings_render.resolutionId][1]}`;
    window.api.sendToMain('update-resolution', { resolution_id: settings_render.resolutionId });

    updateFontsResolution();
});

settings_screen_resolution_left.addEventListener("click", function(event) {
    settings_render.resolutionId--;
    if(settings_render.resolutionId < 0){
        settings_render.resolutionId = resolutions_render.length - 1;
    }
    settings_screen_resolution_button.innerHTML = `${resolutions_render[settings_render.resolutionId][0]}x${resolutions_render[settings_render.resolutionId][1]}`;
    window.api.sendToMain('update-resolution', { resolution_id: settings_render.resolutionId });

    updateFontsResolution();
});

settings_exit_button.addEventListener("click", function(event) {
    hideMainElements(false);
    settings_main_container.style.display = 'none';
});

settings_reset_button.addEventListener("click", function(event) {
    window.api.sendToMain('reset-settings');
});

exit_button.addEventListener("click", function(event) {
    window.api.sendToMain('close-app');
});

collapse_button.addEventListener("click", function(event) {
    window.api.sendToMain('collapse-app');
});

find_city_button.addEventListener("click", function(event) {
    if(city_input_field.value.length <= 0){
        showNotification('#c0392b', "Введите город");
    }
    else{
        window.api.sendToMain('update-city', {enter_city: city_input_field.value});
    }
});

menu_button.addEventListener("click", function(event) {
    menu_main_container.style.display = 'flex';
    hideMainElements(true);
});

menu_button_exit.addEventListener("click", function(event) {
    menu_main_container.style.display = 'none';
    hideMainElements(false);
});

menu_button_moon.addEventListener("click", function(event) {
    if(settings_render.accountId == 0){
        return showNotification('#c0392b', "Данная функция доступна только после регистрации/авторизации");
    }

    menu_main_container.style.display = 'none';
    moon_main_container.style.display = 'flex';
});

menu_button_travel.addEventListener("click", function(event) {
    if(settings_render.accountId == 0){
        return showNotification('#c0392b', "Данная функция доступна только после регистрации/авторизации");
    }
    document.getElementById('day-of-cities-main-container-id').style.display = 'flex';
    menu_main_container.style.display = 'none';
    hideMainElements(true);
});

moon_container.addEventListener("click", function(event) {
    moon_main_container.style.display = 'none';
    menu_main_container.style.display = 'flex';
});

document.getElementById('day-of-cities-container-id').addEventListener("click", function(event) {
    document.getElementById('day-of-cities-main-container-id').style.display = 'none';
    menu_main_container.style.display = 'flex';
});

//===============================================================================================
window.api.onReceive('valid-account-reply', (data) => {
    const { isValid } = data;
    if(isValid){
        showAccountError(1, 1, "Данный аккаунт уже существует"); 
    }
    else{
        window.api.sendToMain('create-account', { email: email_input.value, password: password_input.value });
    }
});

window.api.onReceive('valid-account-password-reply', (data) => {
    const { isValid } = data;
    if(!isValid){
        showAccountError(1, 1, "Данного аккаунта не существует или пароль неверный"); 
    }
    else{
        document.getElementById('thank-login-label-id').textContent = 'Спасибо за авторизацию!'
        registration_success_container.style.display = 'flex';
    }
});

window.api.onReceive('account-created-reply', (data) => {
    const { created } = data;
    if(created){
        document.getElementById('thank-login-label-id').textContent = 'Спасибо за регистрацию!'
        registration_success_container.style.display = 'flex';
    }
});

window.api.onReceive('load-settings', (data, resolutions, data_weather, air_data, five_days_result) => {
    settings_render = data;
    resolutions_render = resolutions;

    city_input_field.value = settings_render.city;
    updateTodayWeather(data_weather);
    updateAirPollution(air_data);
    updateFontsResolution();
    updateFiveDaysWeather(five_days_result);
    console.log(five_days_result);
});

window.api.onReceive('weather-update-error', () => {
    showNotification('#c0392b', "Данного города не найдено");
});

window.api.onReceive('moon-update', (moonPhase, dayCharacteristic, impactOnPersonality) => {
    moonPhase = moonPhase.replace("Фаза Луны:", "<b>Фаза Луны:</b>");
    dayCharacteristic = dayCharacteristic.replace("Характеристика дня:", "<b>Характеристика дня:</b>");
    impactOnPersonality = impactOnPersonality.replace("Влияние на личность:", "<b>Влияние на личность:</b>");

    document.getElementById('moon-phase-id').innerHTML = moonPhase;
    document.getElementById('moon-day-characteristics-id').innerHTML = dayCharacteristic;
    document.getElementById('moon-impact-on-personality-id').innerHTML = impactOnPersonality;
    document.getElementById('moon-date-id').innerHTML = getFormattedDate();
});

window.api.onReceive('travel-update', (listItems) => {
    let count = 0;
    listItems.some(item => {
        let cityInfo = item.split("   ");
        
        let cityNameAndDate = cityInfo[0].split(" ", 2); 
        
        cityNameAndDate[0] = cityNameAndDate.join(" "); 
        
        cityNameAndDate[1] = cityInfo[0].slice(cityNameAndDate[0].length).trim();
    
        let cityNameElement = document.createElement("label");
        cityNameElement.classList.add("day-of-citites-city-name");

        let dateElement = document.createElement("label");
        dateElement.classList.add("day-of-citites-date");

        let descriptionElement = document.createElement("label");
        descriptionElement.classList.add("day-of-citites-info");

        let descriptionText = `${cityInfo[1]} ${cityInfo[2]}`;
        if(descriptionText.length > 128){
            descriptionText = descriptionText.slice(0, 128);
            let spaceIndex = descriptionText.lastIndexOf(" ");
            if(spaceIndex > -1){
                descriptionText = descriptionText.slice(0, spaceIndex);
            }
            descriptionText = descriptionText + "...";
        }

        cityNameElement.innerHTML = cityNameAndDate[1];
        dateElement.innerHTML = cityNameAndDate[0];
        descriptionElement.innerHTML = descriptionText;

        let divElement = document.createElement("div");
        divElement.classList.add("day-of-cities");

        divElement.appendChild(cityNameElement);
        divElement.appendChild(dateElement);
        divElement.appendChild(descriptionElement);

        document.getElementById('day-of-cities-container-id').appendChild(divElement);
        count++;
        if(count >= 4){
            return true;
        }
    });
    
    
});

//===============================================================================================