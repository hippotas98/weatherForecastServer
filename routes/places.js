var express = require('express');
var router = express.Router();
var Places = require('../common/mongoose').model('Places')
var uuidv4 = require('uuid/v4')
var objectId = require('mongoose').ObjectID
router.get('/', (req, res)=>{
    let min_temp = req.query['min_temp']
    let max_temp = req.query['max_temp']
    let city = req.query['city']
    let season = getSeason(new Date().getMonth)
    getFavPlaces(min_temp, max_temp, season, city, (error, result) => {
        if(error) res.send(error)
        res.send(result)
    })
})
router.post('/', (req, res)=>{
    let data = req.body
    Places.addPlace(data, (err, savedPlace)=>{
        if(err) console.log(err)
        res.send(savedPlace)
    })
})
router.post('/comment/:placeId/:userName/:rate', (req, res) => {
    let rate = req.params['rate']
    if(rate < 0) res.send('Rate cannot lower than 0')
    else if (rate > 6) res.send('Rate cannot larger than 5')
    else 
    {
        let placeId = req.params['placeId']
        let userName = req.params['userName']
        let comment = req.body.comment
        Places.findById(placeId)
        .then(result => {
            let tempResult = result.comments
            tempResult.push({
                content: comment,
                user: userName,
                commentId: uuidv4(),
                rate: rate
            })
            result.comments = tempResult
            result.rate = average(result.rate, result.peopleRated, rate, result.peopleRated + 1)
            result.peopleRated += 1
            result.save((err,savedResult)=>{
                res.send(savedResult)
            })
        })
        .catch(err => {
            console.log(err)
            res.send(err)
        })
    }
})
router.delete('/remove/comment/:placedId/:commentId', (req, res) => {
    let placeId = req.params['placeId']
    let commentId = req.params['commentId']
    Places.findById(placeId)
    .then(result => {
        for(let idx = 0; idx<result.comments.length; idx++){
            if(result.commnents[idx].commentId == commentId){
                result.rate = average(result.rate, result.peopleRated, -1 * rate, result.peopleRated-1)
                result.peopleRated -= 1
                let tempResult = result.comments
                delete tempResult[idx]
                result.comments = tempResult
                result.save((err,savedResult)=>{
                    res.send(savedResult)
                })
            }
        }
    })
    .catch(err=>{
        console.log(err)
        res.send(err)
    })
})

average = (curRate, curQuanity, newRateValue, newQuanity) => {
    return (curRate*curQuanity + newRateValue)/newQuanity
}
getSeason = (month) => {
    if(month >= 1 && month <= 3){
        return 'spring'
    }
    else if (month >= 4 && month <= 8){
        return 'summer'
    }
    else if (month >= 9 && month <= 11){
        return 'fall'
    }
    else if (month == 12){
        return 'winter'
    }
    else return 'error'
}
getFavPlaces = (min_temp, max_temp, season, city, cb) => {
    let fav = []
    Places.find({city: city})
    .then(results => {
        for(let index = 0; index < results.length;++index){
            if(results[index].preference.minTemp >= min_temp 
                && results[index].preference.maxTemp <= max_temp
                    && results[index].preference.seasons.find((ss)=> ss == season)
                    && results[index].address.city == city)
            {
                fav.push(results[index])
            }
        }
        cb(null,fav)
    })
    .catch(error => {
        cb(error, null)
    })
}
module.exports = router