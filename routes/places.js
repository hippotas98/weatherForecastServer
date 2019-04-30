var express = require('express');
var router = express.Router();
var Places = require('../common/mongoose').model('Places')
var uuidv4 = require('uuid/v4')
router.get('/', (req, res) => {
    let min_temp = req.query['min_temp']
    let max_temp = req.query['max_temp']
    let city = req.query['city']
    let season = getSeason(new Date().getMonth())
    getFavPlaces(min_temp, max_temp, season, city, (result) => {
        res.send(result)
    })

})
router.post('/', (req, res) => {
    let data = req.body
    let place = {
        _id: uuidv4(),
        name: data.name,
        image: {
            link: data.link,
            blob: ''
        },
        description: data.description,
        address: {
            longitude: data.long,
            latitude: data.lat,
            city: data.city,
            detail: data.address
        },
        preference: {
            minTemp: data.minTemp,
            maxTemp: data.maxTemp,
            seasons: data.seasons
        },
        comments: data.comments,
        rate: data.rate,
        peopleRated: data.comments.length
    }
    Places.create(place)
        .then(result => res.send(result))
        .catch(error => console.log(error))
})
router.post('/comments/:placeId/:userName/:rate', (req, res) => {
    let rate = parseInt(req.params['rate'])
    if (rate < 0) res.send('Rate cannot lower than 0')
    else if (rate > 6) res.send('Rate cannot larger than 5')
    else {
        let placeId = req.params['placeId']
        let userName = req.params['userName']
        let comment = req.body.comment
        Places.findOne({ '_id': placeId })
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
                console.log(result.rate)
                result.peopleRated += 1
                result.save((err, savedResult) => {
                    if (err) console.log(err)
                    res.send(savedResult)
                })
            })
            .catch(err => {
                console.log(err)
                res.send(err)
            })
    }
})
router.delete('/remove/comment/:placeId/:commentId', (req, res) => {
    let placeId = req.params['placeId']
    console.log(placeId)
    let commentId = req.params['commentId']
    Places.findOne({ '_id': placeId })
        .then(result => {
            if (result) {
                for (let idx = 0; idx < result.comments.length; idx++) {
                    if (result.comments[idx].commentId == commentId) {
                        result.rate = average(result.rate, result.peopleRated, -1 * result.comments[idx].rate, result.peopleRated - 1)
                        result.peopleRated -= 1
                        let tempResult = result.comments
                        delete tempResult[idx]
                        result.comments = tempResult
                        result.save((err, savedResult) => {
                            res.send(savedResult)
                        })
                    }
                }
            }
        })
        .catch(err => {
            console.log(err)
            res.send(err)
        })
})

average = (curRate, curQuanity, newRateValue, newQuanity) => {
    return (curRate * curQuanity + newRateValue) / newQuanity
}
getSeason = (month) => {
    if (month >= 1 && month <= 3) {
        return 'spring'
    }
    else if (month >= 4 && month <= 8) {
        return 'summer'
    }
    else if (month >= 9 && month <= 11) {
        return 'fall'
    }
    else if (month == 12) {
        return 'winter'
    }
    else return 'error'
}
getFavPlaces = (min_temp, max_temp, season, city, cb) => {
    let fav = []
    Places.find({ 'address.city': city })
        .then(results => {
            for (let index = 0; index < results.length; ++index) {
                if (results[index].preference.minTemp <= min_temp
                    && results[index].preference.maxTemp >= max_temp
                    && results[index].preference.seasons.find((ss) => ss == season) != null) {
                    fav.push(results[index])
                }
            }
            cb(fav)
        })
        .catch(error => {
            console.log(error)
        })
}
module.exports = router