const fetch = require('node-fetch')
const FormData = require('form-data')
const baseUrl = 'http://www.medgorodok.ru'

async function getTips(qs) {
  const form = new FormData()
  form.append('qs', qs)
  return await fetch(`${baseUrl}/ajax.php`, {
    method: 'POST',
    body: form,
    headers: form.getHeaders(),
  }).then(res => res.json())
    .catch(e => console.error(e))
}


module.exports = getTips

