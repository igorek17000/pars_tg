const {createSignal} = require("./api");
const { SYMBOL } = require("./constant");

const getType = (str) => {
    if (str.includes("LONG")) {
        return 'LONG'
    }

    if (str.includes("SHORT")) {
        return 'SHORT'
    }

    return null
}

const getMonet = (str) => {


    for (let i = 0; i < SYMBOL.length; i++) {
        item = SYMBOL[i]
        const code = item.slice(0,item.lastIndexOf('USDT'))

        if (str.includes(code)) {
            return code + 'USDT'
        }
    }

    return null
}

const handleInputChange = (str) => {
    let inputValue = str.split('\n') || []

    if (inputValue.length === 1) return

    let moneta = null
    let entry = null
    let type = null
    let stopLoss = null
    let limit = []

    inputValue.forEach((item) => {

        if (item.includes('Futures')) {
            moneta = getMonet(str.toUpperCase())
            type = getType(str.toUpperCase())
        }

        if (item.toLocaleLowerCase().includes('цель')) {

            const arrValue = item.includes(':') ?  item.split(': ') :  item.split(' ')

            const value = arrValue[1]
            limit.push({
                price: value.replace(/,/g, '.').replace(/[^0-9^\d.]+/g, ""),
                quantity: 0
            })
        }

        if (item.toLocaleLowerCase().includes('стоп')) {
            const itemValue = item.split(' ') || []
            stopLoss = itemValue[1].replace(/,/g, '.').replace(/[^0-9^\d.]+/g, "");
        }

        if (item.toLocaleLowerCase().includes('вход')) {
            const itemValue = item.split(' ') || []
            entry = itemValue[1].replace(/,/g, '.').replace(/[^0-9^\d.]+/g, "");
        }

    })

    if (limit.length === 0 ) return { 'error': true }

    limit.sort((a, d ) => {
        return a.price - d.price;
    })

    let { price = null} = type === "LONG" ? limit.pop() : limit.shift()

    const takeProfit = price

    const lengthToFix = () => {

        const arr = entry.split('.')

        if (arr.length === 1) return 0

        return arr[1].length
    }

    const getStopLoss = () => {
        const fix = lengthToFix()

        if (type === "LONG") {

            const diffic = (takeProfit - (+entry)) / 3

            return (+entry - diffic).toFixed(fix)
        }

        const diffic = (+entry - takeProfit) / 3

        return (+entry + diffic).toFixed(lengthToFix(fix))
    }

    const resLimit = limit.length ? { limitOrder: limit.map((item)=> ({...item, quantity: Number((100 / (limit.length + 1)).toFixed(0))}))} : {}

    if(!moneta) {
       return { 'error': true }
    }

    if(!type) {
        return { 'error': true }
    }

    const res = {
        symbol: moneta.replace(/ /g, ''),
        type,
        takeProfit,
        stopLoss: stopLoss ? stopLoss : getStopLoss(),
        starting: 1,
        ...resLimit,
    }

    return res
}

const funcAllCreate = async (data) => {

    for (let i = 0; i < data.length; i++) {
        const msg = data[i]?.message.toLowerCase()
        if( msg.includes('futures') ) {
            const send = await handleInputChange(data[i]?.message)

            console.log('send', send)
            if (send?.error) continue

            await createSignal(send)
        }

    }
}

module.exports = { handleInputChange, funcAllCreate }
