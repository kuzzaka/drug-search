const fetch = require('node-fetch')
const cheerio = require('cheerio')
const _ = require('lodash')

const baseUrl = 'http://www.medgorodok.ru'

async function getApothecaries(req) {
  let drugs = JSON.parse(req.body.drugs) || []
  let apotecas = []
  let rawApotecasData
  // get html markup for each drug and parse data from it
  let drugsArr = drugs.map(async drug => {
    let result = []
    const url = drug.url || ''
    const html = await fetch(`${baseUrl}${url}`).then(res => res.text()).catch(e => console.error(e))
    let $ = cheerio.load(html)
    const nodes = $('.apothecas-addresses-list-item')
    if (nodes.length) {
      result = nodes.map((index, node) => {
        return {
          address: $(node).find('.apothecas-addresses-list-item-contacts-address').text(),
          price: $(node).find('.apothecas-addresses-list-item-price span:first-child').text().replace(/[^0-9.]/g, ''),
          url: baseUrl + $(node).find('.apothecas-addresses-list-item-name-field a').attr('href').replace(' ', ''),
          drugName: drug.DrugName,
        }
      })
    }
    return result
  })
  rawApotecasData = await Promise.all(drugsArr)
  // find apotecas which have all the drugs
  if (drugs.length > 1) {
    let intersection = rawApotecasData[0]
    for (let i = 1; i < drugs.length; i++) {
      intersection = _.intersectionWith(intersection, rawApotecasData[i], (val1, val2) => {
        if (val2.url === val1.url) {
          val1['price' + i] = val2.price
          val1['drugName' + i] = val2.drugName
          return true
        } else {
          return false
        }
      })
    }
    apotecas = intersection
  } else {
    apotecas = rawApotecasData[0]
  }
  apotecas.forEach(apoteca => {
    apoteca.sum = parseFloat(_.chain(apoteca)
      .filter((value, key) => key.match('price'))
      .map(value => parseFloat(value))
      .sum()
      .value()
      .toFixed(2))
  })
  return _.sortBy(apotecas, 'sum')
}


module.exports = getApothecaries
