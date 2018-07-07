document.addEventListener('DOMContentLoaded', function () {
  let drugs = []
  let lastDrugResponse
  let xhr
  let chosenDrugs = document.querySelector('.chosen-drugs')
  let searchButton = document.querySelector('.search-button')
  let form = document.querySelector('.search-form')
  new autoComplete({
    selector: 'input[name="q"]',
    source: function(term, suggest) {
      try { xhr.abort(); } catch(e){}
      xhr = new XMLHttpRequest()
      xhr.open('GET', `search/tips/?qs=${term}`)
      xhr.onload = function(e) {
        lastDrugResponse = JSON.parse(e.target.response)
        suggest(lastDrugResponse)
      }
      xhr.send()
    },
    onSelect: function(e, term, item){
      let itemData = lastDrugResponse.find(drug => drug.DrugID === item.id)
      if (itemData) {
        drugs.push(itemData)
        let node = item.cloneNode()
        node.classList.remove('autocomplete-suggestion')
        node.classList.add('close')
        node.textContent = itemData.DrugName
        node.setAttribute('title', 'click to remove from list')
        chosenDrugs.appendChild(node)
      }
    },
    renderItem: function (item, search){
      search = search.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
      let re = new RegExp("(" + search.split(' ').join('|') + ")", "gi");
      return `<div class="autocomplete-suggestion" id="${item.DrugID}">${item.DrugName.replace(re, "<b>$1</b>")}</div>`
    },
  });
  chosenDrugs.addEventListener('click', function(ev) {
    let target = ev.target
    if (target.id) {
      drugs = drugs.filter(drug => drug.DrugID !== target.id)
      ev.target.remove()
    }
  })
  searchButton.addEventListener('click', function (ev) {
    [...form.elements][0].value = JSON.stringify(drugs)
    form.submit()
  })
})
