darksky = require("../common/darksky") 

var express = require('express')
var router = express.Router()

const MaxHourlyForecast = 24

router.get('/Current', (req, res, next) => {
    let latitude = req.query["latitude"]
    let longitude = req.query["longtitude"]
    console.log(longitude)
    console.log(latitude)
    getForecast(longitude, latitude, "si", ["minutely", "hourly", "daily", "alerts", "flags"])
    .then(result => {
        console.log(result.timezone)
        res.send({
            weatherInfor: {
                timezone: result.timezone,
                longitude: result.longitude,
                latitude: result.latitude,
                current: convertWeatherData(result.currently).current
            } 
        })
    })
    .catch(err => {
        throw err
    })
})

router.get('/Hourly', (req, res) => {
    let latitude = req.query["latitude"]
    let longitude = req.query["longtitude"]
    console.log(longitude)
    console.log(latitude)
    getForecast(longitude, latitude, "si", ["minutely", "currently", "daily", "alerts", "flags"])
    .then(result => {
        let counter = 0
        hourlyForecast = []
        result.hourly.data.forEach(h=>{
            if(counter < MaxHourlyForecast){
                data = convertWeatherData(h).current
                counter++;
                hourlyForecast.push(data)
            }
        })
        res.send({
            weatherInfor: {
                timezone: result.timezone,
                longitude: result.longitude,
                latitude: result.latitude,
                hourlySummary: result.hourly.summary,
                hourlyIcon: result.hourly.icon,
                hourlyForecast: hourlyForecast
            }
        })
    })
})

router.get('/Daily', (req, res)=>{
    let latitude = req.query["latitude"]
    let longitude = req.query["longtitude"]
    console.log(longitude)
    console.log(latitude)
    getForecast(longitude, latitude, "si", ["minutely", "currently", "hourly", "alerts", "flags"])
    .then(result => {
        dailyForecast = []
        result.daily.data.forEach(dd => {
            dailyForecast.push({
                date: new Date(dd.sunriseTime*1000).toDateString(),
                summary: dd.summary,
                icon: dd.icon,
                sunriseTime: toLocalTime(dd.sunriseTime),
                sunsetTime: toLocalTime(dd.sunsetTime),
                precipProbability: dd.precipProbability,
                precipType: dd.precipType,
                temperatureDaynight: dd.temperatureHigh,
                temperatureDaynightTime: toLocalTime(dd.temperatureHighTime),
                temperatureOvernight: dd.temperatureLow,
                temperatureOvernightTime: toLocalTime(dd.temperatureLowTime),
                apparenttemperatureDaynight: dd.apparentTemperatureHigh,
                apparenttemperatureDaynightTime: toLocalTime(dd.apparentTemperatureHighTime),
                apparenttemperatureOvernight: dd.apparentTemperatureLow,
                apparenttemperatureOvernightTime: toLocalTime(dd.apparentTemperatureLowTime),
                humidity: dd.humidity,
                pressure: dd.pressure,
                windSpeed: dd.windSpeed,
                uvIndex: dd.uvIndex,
                ozone: dd.ozone,
                temperatureMin: dd.temperatureMin,
                temperatureMinTime: toLocalTime(dd.temperatureMinTime),
                temperatureMax: dd.temperatureMax,
                temperatureMaxTime: toLocalTime(dd.temperatureMaxTime),
                apparentTemperatureMin: dd.apparentTemperatureMin,
                apparentTemperatureMinTime: toLocalTime(dd.apparentTemperatureMinTime),
                apparentTemperatureMax: dd.apparentTemperatureMax,
                apparentTemperatureMaxTime: toLocalTime(dd.apparentTemperatureMaxTime)

            })  
        })
        res.send({
            weatherInfor: {
                timezone: result.timezone,
                longitude: result.longitude,
                latitude: result.latitude,
                dailySummary: result.daily.summary,
                dailyIcon: result.daily.icon,
                dailyForecast: dailyForecast
            }
        })
    })
})


const getForecast =  (long, lat, unit, excludeBlocks) => {
    // let date = new Date()
    // let current = date.getFullYear + "-" + (date.getMonth()+1) + "-" + date.getDate()
    return darksky
    .latitude(lat)            
    .longitude(long)           
    .units(unit)                    
    .language('en') 
    .exclude(excludeBlocks)
    .get()
    
};

const convertWeatherData = (data) => {
    return {
        current: {
            time: toLocalTime(data.time),
            icon: data.icon,
            summary: data.summary,
            precipProbability: data.precipProbability,
            temp: data.temperature,
            apparentTemp: data.apparentTemperature,
            humidity: data.humidity,
            uvIndex: data.uvIndex,
            pressure: data.pressure,
            windSpeed: data.windSpeed,
            
        }
    } 
}

const toLocalTime = (data) => {
    let date = new Date(data*1000).toString()
    // return new Date(date.replace("Z","")+"UTC").toString()
    return date
}


module.exports = router