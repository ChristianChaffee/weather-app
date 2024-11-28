const { app, BrowserWindow, ipcMain, screen } = require('electron');
const mysql = require('mysql2');
const path = require('path');
const fs = require('fs');
const axios = require('axios');
const puppeteer = require('puppeteer');

const API_KEY = 'bdd8036c665b851648db5749d63bb654';
const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";
const BASE_AIR_POLLUTION_URL = "https://api.openweathermap.org/data/2.5/air_pollution";
const BASE_FIVE_DAYS_WEATHER_URL = "https://api.openweathermap.org/data/2.5/forecast";
const GEOLOCATION_URL = "http://ip-api.com/json/";

const screens_resolutions = [[800, 600], [1024, 768], [1280, 960], [1400, 1050]];
const settingsPath = path.join(app.getPath('userData'), 'settings.json');
const defaultSettings = {
    accountId: 0,
    accountEmail: "",
    accountPassword: "",
    accountCreateTime: "",
    resolutionId: 0,
    city: ""
};
6
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'weather_app'
});

let settings = loadSettings();
let mainWindow;

function connectMysql(){
    connection.connect((err) => {
        if (err) {
            console.error('MySQL Connection error: ' + err.stack);
            return;
        }
        console.log('MySQL connection succesfully with ID: ' + connection.threadId);
    });
}

    
function loadSettings() {
    if (!fs.existsSync(settingsPath)) {
        fs.writeFileSync(settingsPath, JSON.stringify(defaultSettings, null, 2));
        return defaultSettings;
    } else {
        const data = fs.readFileSync(settingsPath, 'utf8');
        return JSON.parse(data);
    }
}

  function saveSettings(settings) {
    if (!fs.existsSync(settingsPath)) {
        fs.writeFileSync(settingsPath, JSON.stringify(defaultSettings, null, 2));
    }
    else{
        fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2));
    }
  }

function createWindow() {
    const preloadPath = path.join(__dirname, 'preload.js');

    mainWindow = new BrowserWindow({
        width: screens_resolutions[settings.resolutionId][0],
        height: screens_resolutions[settings.resolutionId][1],
        frame: false,
        transparent: true,
        resizable: true,
        webPreferences: {
            preload: preloadPath,
            contextIsolation: true,
            enableRemoteModule: false
        },
    });

    mainWindow.on('will-resize', (event) => {
        event.preventDefault();
    });

    mainWindow.loadFile('index.html');

    mainWindow.setMinimumSize(800, 600);


    mainWindow.webContents.on('did-finish-load', () => {
        getUserCity().then((result) =>{
            settings.city = result;
            saveSettings(settings);
        });

        moonUpdate().then();
        travelUpdate().then();

        fetchWeather(settings.city).then((result) => {
            
            fetchAirPollution(result.coord.lon, result.coord.lat).then((air_pollution_result) => {

                fetchFiveDaysWeather(result.coord.lon, result.coord.lat).then((five_days_result) => {
                    mainWindow.webContents.send('load-settings', settings, screens_resolutions, result, air_pollution_result, five_days_result);
                });
            });
        });
    });
}

app.whenReady().then(createWindow);
app.whenReady().then(connectMysql);
//app.whenReady().then(sendUpdateAccount);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        //();
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

app.on('before-quit', (event) => {
    if (connection && connection.state !== 'disconnected') {
        connection.end((err) => {
            if (err) {
                console.error('Error while closing MySQL connection:', err);
            }
        });
    }
});

//==============================================================================
function clearAccountSettings(){
    settings.accountId = 0;
    settings.accountEmail = '';
    settings.accountCreateTime = '';
    saveSettings(settings);
}

function sendUpdateAccount(){
    connection.query(`SELECT \
        id, email, password, DATE_FORMAT(create_date, '%d.%m.%Y %H:%i:%s') AS create_formater_date\
        FROM accounts WHERE email = '${settings.accountEmail}' AND password = '${settings.accountPassword}' LIMIT 1`, (error, results, fields) => {
        if (error) throw error;
        
        if(results.length > 0){
            const user = results[0];
            settings.accountId = user.id;
            settings.accountEmail = user.email;
            settings.accountPassword = user.password;
            settings.accountCreateTime = user.create_formater_date;
            saveSettings(settings);
            mainWindow.webContents.send('load-settings', settings, screens_resolutions);
        }
        else{
            clearAccountSettings();
            mainWindow.webContents.send('load-settings', settings, screens_resolutions);
        }
    });
}

function centerWindow(win) {
    const display = screen.getPrimaryDisplay();
    const { width: screenWidth, height: screenHeight } = display.workAreaSize; 

    const [winWidth, winHeight] = win.getSize(); 

    const x = Math.round((screenWidth - winWidth) / 2); 
    const y = Math.round((screenHeight - winHeight) / 2);

    win.setBounds({ x, y, width: winWidth, height: winHeight });
}

async function fetchWeather(city) {
    try {
        const response = await axios.get(BASE_URL, {
            params: {
                q: city,
                appid: API_KEY,
                units: "metric",
                lang: "ru",
            },
        });

        const data = response.data;
        return data;
    } catch (error) {
        console.error("Ошибка получения данных о погоде:", error.message);
        throw new Error("Не удалось получить данные о погоде. Проверьте название города.");
    }
}

async function fetchAirPollution(lon_d, lat_d) {
    try {
        const response = await axios.get(BASE_AIR_POLLUTION_URL, {
            params: {
                lon: lon_d,
                lat: lat_d,
                appid: API_KEY,
            },
        });

        const data = response.data;
        return data;
    } catch (error) {
        console.error("Ошибка получения данных о погоде:", error.message);
        throw new Error("Не удалось получить данные о погоде. Проверьте название города.");
    }
}

async function fetchFiveDaysWeather(lon_d, lat_d) {
    try {
        const response = await axios.get(BASE_FIVE_DAYS_WEATHER_URL, {
            params: {
                lon: lon_d,
                lat: lat_d,
                appid: API_KEY,
            },
        });

        const data = response.data;
        return data;
    } catch (error) {
        console.error("Ошибка получения данных о погоде:", error.message);
        throw new Error("Не удалось получить данные о погоде. Проверьте название города.");
    }
}

async function getUserCity() {
    try {
        const response = await axios.get(GEOLOCATION_URL);
        if (response.data.status === "success") {
            return response.data.city;
        } else {
            throw new Error("Не удалось определить местоположение.");
        }
    } catch (error) {
        console.error("Ошибка при определении города:", error.message);
        return null;
    }
}

async function moonUpdate() {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
   
    const url = 'https://www.calend.ru/moon/';
    await page.goto(url);

    const moonPhase = await page.evaluate(() => {
        const tempElement = document.querySelector('body > div.wrapper > div.block.main > div.block.content > div:nth-child(8) > p:nth-child(2)');
        return tempElement ? tempElement.textContent.trim() : null;
    });

    const dayCharacteristic = await page.evaluate(() => {
        const tempElement = document.querySelector('body > div.wrapper > div.block.main > div.block.content > div:nth-child(8) > p:nth-child(3)');
        return tempElement ? tempElement.textContent.trim() : null;
    });

    const impactOnPersonality = await page.evaluate(() => {
        const tempElement = document.querySelector('body > div.wrapper > div.block.main > div.block.content > div:nth-child(8) > p:nth-child(4)');
        return tempElement ? tempElement.textContent.trim() : null;
    });

    mainWindow.webContents.send('moon-update', moonPhase, dayCharacteristic, impactOnPersonality);
    await browser.close();
}

async function travelUpdate() {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
   
    const url = 'https://www.calend.ru/travel/';
    await page.goto(url);

    await page.waitForSelector('body > div.wrapper > div.block.main > div.block.content > ul.itemsNet.cities');
    const listItems = await page.evaluate(() => {
        const items = [];
        const list = document.querySelectorAll('ul.itemsNet.cities li');
        list.forEach(item => items.push(item.textContent.trim()));
        return items;
    });
    
    mainWindow.webContents.send('travel-update', listItems);
    await browser.close();
}


//==============================================================================
ipcMain.on('check-valid-account', (event, data) => {
    const { email } = data;
    connection.query(`SELECT * FROM accounts WHERE email = '${email}'`, (error, results, fields) => {
        if (error) throw error;
        
        if(results.length > 0){
            event.reply('valid-account-reply', { isValid: 1 });
        }
        else{
            event.reply('valid-account-reply', { isValid: 0 });
        }
    });
});

ipcMain.on('check-valid-account-password', (event, data) => {
    const { email, password } = data;
    connection.query(`SELECT \
        id, email, password, DATE_FORMAT(create_date, '%d.%m.%Y %H:%i:%s') AS create_formater_date\
        FROM accounts WHERE email = '${email}' AND password = '${password}' LIMIT 1`, (error, results, fields) => {
        if (error) throw error;
        
        if(results.length > 0){
            const user = results[0];
            settings.accountId = user.id;
            settings.accountEmail = user.email;
            settings.accountPassword = user.password;
            settings.accountCreateTime = user.create_formater_date;
            saveSettings(settings);
            mainWindow.webContents.send('load-settings', settings, screens_resolutions);

            event.reply('valid-account-password-reply', { isValid: 1 });
        }
        else{
            event.reply('valid-account-password-reply', { isValid: 0 });
        }
    });
});

ipcMain.on('create-account', (event, data) => {
    const { email, password } = data;
    connection.query(`INSERT INTO accounts (email, password) VALUES ('${email}', '${password}')`, (error, results, fields) => {
        if (error) throw error;
        else{
            settings.accountId = results.insertId;
            settings.accountEmail = email;
            settings.accountPassword = password;
            saveSettings(settings);
            mainWindow.webContents.send('load-settings', settings, screens_resolutions);

            event.reply('account-created-reply', { created: 1 });
        }
        
    });
});

ipcMain.on('exit-account', (event, data) => {
    clearAccountSettings();
    mainWindow.webContents.send('load-settings', settings, screens_resolutions);
});

ipcMain.on('update-resolution', (event, data) => {
    const { resolution_id } = data;
    settings.resolutionId = resolution_id;
    saveSettings(settings);
    mainWindow.setSize(screens_resolutions[settings.resolutionId][0], screens_resolutions[settings.resolutionId][1]);
    centerWindow(mainWindow);
});

ipcMain.on('reset-settings', (event) => {
    settings = defaultSettings;
    saveSettings(settings);

    mainWindow.close();
    app.quit();
    createWindow();
});

ipcMain.on('close-app', (event) => {
    saveSettings(settings);
    app.quit();
});

ipcMain.on('collapse-app', (event) => {
    mainWindow.minimize();
    fetchWeather('Minsk')
});

ipcMain.on('update-city', async (event, data) => {
    const { enter_city } = data;
    try {
        settings.city = enter_city;
        const weatherData = await fetchWeather(enter_city);
        const airData = await fetchAirPollution(weatherData.coord.lon, weatherData.coord.lat);
        const forecastData = await fetchFiveDaysWeather(weatherData.coord.lon, weatherData.coord.lat);
        mainWindow.webContents.send('load-settings', settings, screens_resolutions, weatherData, airData, forecastData);
    } catch (error) {
        event.reply('weather-update-error');
    }
});