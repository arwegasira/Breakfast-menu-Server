const { parentPort, workerData } = require('worker_threads')
const customError = require('../Error')
let items = JSON.parse(workerData.items)

if (!Array.isArray(items)) throw new customError.NotFoundError('No Items found')
items = items.reduce((groupedItems, currentItem) => {
  const category = currentItem.itemCategory
  if (!groupedItems[category]) {
    groupedItems[category] = []
  }
  groupedItems[category].push(currentItem)
  return groupedItems
}, {})
items = Object.entries(items).map(([category, items]) => {
  return { category, items }
})

parentPort.postMessage(items)
