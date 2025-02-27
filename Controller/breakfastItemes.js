const BreakFastItem = require('../Module/breakfastItems')
const { StatusCodes } = require('http-status-codes')
const customError = require('../Error')
const { Worker, isMainThread, workerData } = require('worker_threads')
const path = require('path')

const addItem = async (req, res) => {
  const { itemName, itemCategory, createdBy } = req.body
  if (!itemCategory || !itemName)
    throw new customError.BadRequestError('Please provide name and category')
  let item = new BreakFastItem({ itemName, itemCategory, createdBy })
  item = await item.save()
  return res.status(StatusCodes.OK).json({ message: 'success', item })
}

const editItem = async (req, res) => {
  const { id: itemId } = req.params
  const item = await BreakFastItem.findOneAndUpdate({ _id: itemId }, req.body, {
    returnDocument: 'after',
  })
  return res.status(StatusCodes.OK).json({ message: 'success', item })
}
const getItems = async (req, res) => {
  const { id, itemName, itemCategory } = req.body
  const search = { isAvailable: true }
  if (id) {
    search.id = id
  }
  if (itemName) {
    search.itemName = itemName
  }
  if (itemCategory) {
    search.itemCategory = itemCategory
  }
  const page = req.query.page || 1
  const limit = req.query.limit || 10
  const skip = (page - 1) * limit
  let result = BreakFastItem.find(search)
  result = result.skip(skip).limit(limit).sort('-createdAt')
  count = await BreakFastItem.countDocuments(search)
  pageCount = Math.ceil(count / limit)
  const items = await result
  res.status(200).json({ items, meta: { count, page, pageCount } })
}

const getAllItems = async (req, res) => {
  const { search } = req.query
  const filter = {}
  if (search) {
    const regex = new RegExp('^' + search)
    filter.$or = [
      {
        itemName: { $regex: regex, $options: 'i' },
      },
      {
        itemCategory: { $regex: regex, $options: 'i' },
      },
    ]
  }

  let items = await BreakFastItem.find(filter).sort('itemCategory itemName')

  if (!items.length) return res.status(StatusCodes.OK).json({ items })

  const worker = new Worker(
    path.join(__dirname, 'workerGetBreakfastItems.js'),
    { workerData: { items: JSON.stringify(items) } }
  )

  worker.on('message', (data) => {
    return res.status(StatusCodes.OK).json({ items: data })
  })
  worker.on('error', (err) => {
    return res.status(StatusCodes.NOT_FOUND).json({ message: err.message })
  })
}

const getAvailableItems = async (req, res) => {
  const items = await BreakFastItem.find({ isAvailable: true }).sort(
    'itemCategory itemName'
  )
  if (!items.length) return res.status(StatusCodes.OK).json({ items })
  const worker = new Worker(
    path.join(__dirname, 'workerGetBreakfastItems.js'),
    { workerData: { items: JSON.stringify(items) } }
  )

  worker.on('message', (data) => {
    return res.status(StatusCodes.OK).json({ items: data })
  })
  worker.on('error', (err) => {
    return res.status(StatusCodes.NOT_FOUND).json({ message: err.message })
  })
}

module.exports = {
  addItem,
  editItem,
  getItems,
  getAllItems,
  getAvailableItems,
}
