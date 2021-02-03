const Pairs = { 
	btcbrl: 1,
	ethbrl: 2,
	ltcbrl: 3,
	takionbrl: 4,
	bchbrl: 5,
	ethbtc: 6,
	xrpbrl: 7,
	eosbrl: 8,
	mco2brl: 9
}

const Sides = { buy: 0, sell: 1 }

const Products = {
	btc: 1,
	eth: 2,
	ltc: 3,
	brl: 4,
	takion: 5,
	bch: 6,
	xrp: 7,
	eos: 8,
	mco2: 9,
}

const OrderTypes = {
	unknown: 0,
	market: 1,
	limit: 2,
	stopmarket: 3,
	stoplimit: 4,
	trailingStopMarket: 5,
	trailingStopLimit: 6,
	blockTrade: 7
}

const PegPriceTypes = {
	last: 1,
	bid: 2,
	ask: 3,
	midpoint: 4
}

module.exports = {
	Pairs: Pairs,
	Sides: Sides,
	Products: Products,
	OrderTypes: OrderTypes,
	PegPriceTypes: PegPriceTypes,
}
