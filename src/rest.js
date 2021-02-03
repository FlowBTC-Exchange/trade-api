const axios = require('axios')
		, CONSTANTS = require('./constants')
		, { Pairs } = CONSTANTS

/**
 * Constructor
 */
function Rest() {
	this.endpoint = 'https://api.flowbtc.com.br:8443/ap'
}

Rest.prototype.ping = async function() {
	try {
		const res = await axios.get(`${this.endpoint}/ping`)
		return res.data
	} catch (e) {
		return e.message
	}
}

Rest.prototype.ticker = async function(pair) {
	pair = pair.toLowerCase()

	try {
		const res = await axios.get(`${this.endpoint}/GetLevel1?OMSId=1&InstrumentId=${Pairs[pair]}`)
		return res.data
	} catch (e) {
		return e.message
	}
}

Rest.prototype.orderbook = async function(pair, depth) {
	pair = pair.toLowerCase()

	try {
		const res = await axios.get(`${this.endpoint}/GetL2Snapshot?OMSId=1&InstrumentId=${Pairs[pair]}&Depth=${depth}`)
		return res.data
	} catch (e) {
		return e.message
	}
}

module.exports = Rest
