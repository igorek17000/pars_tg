const axios = require('axios')
const fs = require('fs');

const TOKEN = '1ced657c-e6a8-4681-b4e1-46a355823421'

const createSignal = async (data) => {

    const res = await axios.post(`https://api.signal-binance.ru/api/bot/v1/signal`, data, { headers: {
            TOKEN,
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Cache': 'no-cache',
            'Access-Control-Allow-Origin': '*',
            'X-Requested-With': 'XMLHttpRequest',
        }})
        .then(({ data }) => data)
        .catch(err => {

            console.log('err', JSON.stringify(err))

            return err
        })

    fs.appendFile( 'result_input.json', JSON.stringify({ data, res, time: new Date()}), function (err) {
        if (err) throw err;
        console.log('Saved result!');
    });

    return res
}


module.exports = { createSignal }

