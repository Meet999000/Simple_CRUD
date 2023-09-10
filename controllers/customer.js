const customerModel = require("../model/customer");
const { ObjectId } = require("mongodb");

const addCustomer = async (req, res, next) => {
  try {
    const { first_name, last_name, city, company } = req.body
    if (!first_name || !last_name || !city || !company) {
      return res.status(400).json({
        status: 400, message: "Please enter all the required data.", data: null
      })
    }
    const checkCustomerInfo = await customerModel.findOne({
      first_name,
      city,
      company
    })
    if (checkCustomerInfo) {
      return res.status(400).json({
        status: 400, message: "Customer already exists with same city and company.", data: null
      })
    }
    const newCustomer = await customerModel.create({
      first_name,
      last_name,
      city,
      company
    })
    return res.status(200).json({
      status: 200, message: "Customer added successfully.", data: newCustomer
    })
  } catch (err) {
    return res.status(400).json({
      status: 500, message: "Internal Server Error", data: null
    })
  }
}

const searchCustomer = async (req, res, nect) => {
  try {
    // pagination query by default 10 records per page
    req.query.page = req.query.page ? req.query.page : 1;
    let page = parseInt(req.query.page);
    req.query.limit = req.query.limit ? req.query.limit : 2;
    let limit = parseInt(req.query.limit);
    let skip = (parseInt(req.query.page) - 1) * limit;

    // search query based on first_name and last_name and city
    let search = req.query.search ? {
      $or: [
        {
          first_name: { $regex: req.query.search, $options: 'i' }
        },
        {
          last_name: { $regex: req.query.search, $options: 'i' }
        },
        {
          city: { $regex: req.query.search, $options: 'i' }
        },
      ]
    } : {}
    let customerData = await customerModel.find(search).skip(skip).limit(limit).sort({
      createdAt: -1
    })
    return res.status(200).json({
      status: 200, message: "Customer found successfully.", data: customerData
    })
  } catch (err) {
    return res.status(400).json({
      status: 500, message: "Internal Server Error", data: null
    })
  }
}

const getCustomer = async (req, res) => {
  try {
    const { id } = req.params
    const customerInfo = await customerModel.findOne({
      _id: new ObjectId(id)
    })
    return res.status(200).json({
      status: 200, message: "Customer found successfully.", data: customerInfo
    })
  } catch (err) {
    return res.status(400).json({
      status: 500, message: "Internal Server Error", data: null
    })
  }
}

const getCityInfo = async (req, res) => {
  try {
    const cityInfo = await customerModel.aggregate([
      {
        '$lookup': {
          'from': 'customers',
          'let': {
            'city': '$city'
          },
          'pipeline': [
            {
              '$match': {
                '$expr': {
                  '$eq': [
                    '$$city', '$city'
                  ]
                }
              }
            }
          ],
          'as': 'customers'
        }
      }, {
        '$group': {
          '_id': '$city',
          'city': {
            '$first': '$city'
          },
          'customersData': {
            '$first': '$customers'
          },
          'customers': {
            '$first': {
              '$size': '$customers'
            }
          }
        }
      }, {
        '$sort': {
          'city': 1
        }
      }
    ])
    return res.status(200).json({
      status: 200, message: "City info found successfully.", data: cityInfo
    })
  } catch (err) {
    return res.status(400).json({
      status: 500, message: "Internal Server Error", data: null
    })
  }
}

module.exports = {
  addCustomer,
  searchCustomer,
  getCustomer,
  getCityInfo
};
