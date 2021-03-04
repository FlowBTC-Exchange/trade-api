const axios = require('axios')
		, CONSTANTS = require('./constants')
		, { Pairs, Sides, OrderTypes, PegPriceTypes } = CONSTANTS

/**
 * Constructor
 */
function Rest() {
	this.endpoint = 'https://api.flowbtc.com.br:8443/ap'
	this.SessionToken = null
	this.AccountId = null
	this.UserId = null
}

Rest.prototype.ping = async function() {
	const req = {
		method: 'GET',
		url: `${this.endpoint}/ping`,
	}
	try {
		const res = await axios(req)
		return res.data
	} catch (e) {
		return e.message
	}
}

Rest.prototype.ticker = async function(pair) {
	pair = pair.toLowerCase()

	const req = {
		method: 'GET',
		url: `${this.endpoint}/GetLevel1?OMSId=1&InstrumentId=${Pairs[pair]}`,
	}
	try {
		const res = await axios(req)
		return res.data
	} catch (e) {
		return e.message
	}
}

Rest.prototype.orderbook = async function(pair, depth) {
	pair = pair.toLowerCase()

	const req = {
		method: 'GET',
		url: `${this.endpoint}/GetL2Snapshot?OMSId=1&InstrumentId=${Pairs[pair]}&Depth=${depth}`,
	}
	try {
		const res = await axios(req)
		return res.data
	} catch (e) {
		return e.message
	}
}

Rest.prototype.Authenticate = async function(username, password) {
	const req = {
		method: 'POST',
		url: `${this.endpoint}/Authenticate`,
		headers: {
			Authorization: 'Basic ' + Buffer.from(`${username}:${password}`).toString('base64')
		}
	}
	try {
		let res = await axios(req)
		res = res.data
		this.SessionToken = res.SessionToken
		this.AccountId = res.AccountId
		this.UserId = res.UserId
		return res
	} catch (e) {
		return e.message
	}
}

Rest.prototype.LogOut = async function() {
	const req = {
		method: 'POST',
		url: `${this.endpoint}/LogOut`,
		headers: {
			APToken: this.SessionToken
		},
		data: {}
	}
	try {
		const res = await axios(req)
		return res.data
	} catch (e) {
		return e.message
	}
}

Rest.prototype.GetUserInfo = async function() {
	const req = {
		method: 'POST',
		url: `${this.endpoint}/GetUserInfo`,
		headers: {
			APToken: this.SessionToken
		},
		data: {}
	}
	try {
		const res = await axios(req)
		return res.data
	} catch (e) {
		return e.message
	}
}

Rest.prototype.SendOrder = async function(side, pair, quantity, limitPrice, orderType, pegpricetypes, clientOrderId) {
	side = side.toLowerCase()
	pair = pair.toLowerCase()

	if (orderType) {
		orderType = orderType.toLowerCase()
	}

	if (!orderType) {
		orderType = !limitPrice ? 'market' : 'limit'
	}

	if (!pegpricetypes) {
		pegpricetypes = side === 'buy' ? 'ask' : 'bid'
	}

	const req = {
		method: 'POST',
		url: `${this.endpoint}/SendOrder`,
		headers: {
			APToken: this.SessionToken
		},
		data: {
			OMSId: 1,
			InstrumentId: Pairs[pair],
			AccountId: this.AccountId,
			TimeInForce: 1,
			ClientOrderId: clientOrderId,
			OrderIdOCO: 0,
			UseDisplayQuantity: true,
			Side: Sides[side],
			Quantity: quantity,
			OrderType: OrderTypes[orderType],
			PegPriceType: PegPriceTypes[pegpricetypes],
			LimitPrice: limitPrice,
		}
	}
			
	try {
		const res = await axios(req)
		return res.data
	} catch (e) {
		return e.message
	}
}

module.exports = Rest
