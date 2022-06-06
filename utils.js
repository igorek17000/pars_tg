

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
            const arrValue = item.split('. ')
            moneta = `${arrValue[2].toUpperCase()}USDT`
            type = arrValue[0].toUpperCase()
        }

        if (item.toLocaleLowerCase().includes('цель')) {

            const isDots = item.includes(':') ? 1 : 0

            const arrValue = item.split(' ')

            const value = arrValue[1 + isDots]
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

    const resLimit = limit.length ? { limit: limit.map((item)=> ({...item, quantity: Number((100 / (limit.length + 1)).toFixed(0))}))} : {}

    const res = {
        symbol: moneta.replace(/ /g, ''),
        type,
        takeProfit,
        stopLoss: stopLoss ? stopLoss : getStopLoss(),
      //  entry,
        ...resLimit,
   //     starting: 1,
    }


    return res
}

module.exports = { handleInputChange }