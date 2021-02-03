const WebSocket = require('ws')

const CONSTANTS = require('./constants')

const { Sides, Pairs, Products, OrderTypes, PegPriceTypes } = CONSTANTS

const endpoint = 'wss://api.flowbtc.com.br/WSGateway/'

let requestIndex = 0

/**
 * Constructor
 * @param {string} username
 * @param {string} password
 */
function WS() {
	const ws = new WebSocket(endpoint)

	ws.on('open', function open() {
		console.log('OPEN CONNECTION')
	})

	ws.on('message', function open(e) {
		console.log('<-', JSON.parse(e))

		// m
		//0 request
		//1 reply
		//2 subscribe-to event
		//3 event
		//4 unsubscribe-from event
		//5 error

		// Chamada bem-sucedida sem objeto de retorno
		//{
		//  "result": true,
		//  "errormsg": null,
		//  "errorcode": 0,
		//  "detail": null
		//}
		//
		//// Chamada sem sucesso devido a falta de autorização
		//{
		//  "result": false,
		//  "errormsg": "Not Authorized",
		//  "errorcode": 20,
		//  "detail": null
		//}
		//
		//// Chamada sem sucesso devido a parâmetros de solicitação inválidos
		//{
		//  "result": false,
		//  "errormsg": "Invalid Request",
		//  "errorcode": 100,
		//  "detail": null
		//}
		//
		//// Chamada sem sucesso devido a falha na operação
		//{
		//  "result": false,
		//  "errormsg": "Operation Failed",
		//  "errorcode": 101,
		//  "detail": null
		//}
		//
		//// Chamada sem sucesso devido a uma falha inesperada no servidor
		//{
		//  "result": false,
		//  "errormsg": "Server Error",
		//  "errorcode": 102,
		//  "detail": null
		//}
		//
		//// Chamada sem sucesso devido a falta de algum recurso (id do usuário não encontrado, etc)
		//{
		//  "result": false,
		//  "errormsg": "Resource Not Found",
		//  "errorcode": 104,
		//  "detail": null
		//}
	})

	ws.on('close', function() {
		console.log('CLOSE CONNECTION')
	})

	this.Watch = ws
}

WS.prototype.SendFrame = function(func, req) {
	const frame = JSON.stringify({ m: 0 , i: requestIndex, n: func, o: JSON.stringify(req) })

	requestIndex += 2

	console.log('->', frame)

	this.Watch.send(frame)
}

WS.prototype.RegisterNewUser = function(email, password) {
	this.SendFrame('RegisterNewUser', {
		OperatorId: 1,
 		UserConfig: [],
		UserInfo: { 
			UserName: email,
			Email: email,
			passwordHash: password
		}
	})
}

WS.prototype.WebAuthenticateUser = function(email, password) {
	this.SendFrame('WebAuthenticateUser', {
		UserName: email,
		Password: password
	})
}

WS.prototype.ResetPassword = function(email) {
	this.SendFrame('ResetPassword', {
		UserName: email
	})
}

WS.prototype.GetUserInfo = function(UserId) {
	this.SendFrame('GetUserInfo', {
		OMSId: 1,
		UserId: UserId
	})
}

WS.prototype.GetAccountInfo = function(AccountId) {
	this.SendFrame('GetAccountInfo', {
		OMSId: 1,
		AccountId: AccountId
	})
}

WS.prototype.SubscribeAccountEvents = function(AccountId) {
	this.SendFrame('SubscribeAccountEvents', {
		OMSId: 1,
		AccountId: AccountId
	})
}

WS.prototype.SubscribeTrades = function(pair) {
	pair = pair.toLowerCase()

	this.SendFrame('SubscribeTrades', {
		OMSId: 1,
		InstrumentId: Pairs[pair],
		IncludeLastCount: 10
	})
}

WS.prototype.UnsubscribeTrades = function(pair) {
	pair = pair.toLowerCase()

	this.SendFrame('UnsubscribeTrades', {
		OMSId: 1,
		InstrumentId: Pairs[pair],
	})
}

WS.prototype.SubscribeTicker = function(pair, includeLastCount) {
	pair = pair.toLowerCase()

	if (!includeLastCount) {
		includeLastCount = 10
	}

	this.SendFrame('SubscribeTicker', {
		OMSId: 1,
		InstrumentId: Pairs[pair],
		Interval: 60,
		IncludeLastCount: includeLastCount
	})
}

WS.prototype.UnsubscribeTicker = function(pair) {
	pair = pair.toLowerCase()

	this.SendFrame('UnsubscribeTicker', {
		OMSId: 1,
		InstrumentId: Pairs[pair],
	})
}

WS.prototype.Authenticate2FA = function(code) {
	this.SendFrame('Authenticate2FA', {
		Code: code,
	})
}

WS.prototype.LogOut = function() {
	this.SendFrame('LogOut', {})
}

WS.prototype.GetTickerHistory = function(pair, fromDate, toDate) {
	pair = pair.toLowerCase()

	this.SendFrame('GetTickerHistory', {
		OMSId: 1,
		InstrumentId: Pairs[pair],
		FromDate: fromDate, // '2020-07-18'
		ToDate: toDate, // '2020-07-18'
		Interval: 60
	})
}

WS.prototype.GetProduct = function(pair) {
	pair = pair.toLowerCase()

	this.SendFrame('GetProduct', {
		OMSId: 1,
		ProductId: Pairs[pair],
	})
}

WS.prototype.GetProducts = function() {
	this.SendFrame('GetProducts', {
		OMSId: 1,
	})
}

WS.prototype.GetAccountTrades = function(accountId, count) {
	this.SendFrame('GetAccountTrades', {
		OMSId: 1,
		AccountId: accountId,
		Count: count,
		StartIndex: 0
	})
}

WS.prototype.CreateDepositTicket = function(accountId, currency, amount, info) {
	currency = currency.toLowerCase()

	this.SendFrame('CreateDepositTicket', {
		OMSId: 1,
		AccountId: accountId,
		AssetId: Products[currency], 
		Amount: amount,
		OperatorId: 1,
		DepositInfo: info
	})
}

WS.prototype.CreateWithdrawTicket = function(accountId, currency, amount) {
	currency = currency.toLowerCase()

	this.SendFrame('CreateWithdrawTicket', {
		OMSId: 1,
		AccountId: accountId,
		ProductId: Products[currency], 
		Amount: amount,
	})
}

/**
 * Prototype
 * @param {number} AccountId
 * @param {string} 'buy' || 'sell'
 * @param {number} 
 * @param {orderType} 
 */
WS.prototype.SendOrder = function(accountId, side, pair, quantity, limitPrice, orderType, pegpricetypes, clientOrderId) {

	side = side.toLowerCase()
	pair = pair.toLowerCase()

	if (!orderType) {
		orderType = !limitPrice ? 'market' : 'limit'
	}

	if (!pegpricetypes) {
		pegpricetypes = side === 'buy' ? 'ask' : 'bid'
	}

	this.SendFrame('SendOrder', {
		InstrumentId: Pairs[pair],
		OMSId: 1,
		AccountId: accountId,
		TimeInForce: 1,
		ClientOrderId: clientOrderId,
		OrderIdOCO: 0,
		UseDisplayQuantity: true,
		Side: Sides[side],
		Quantity: quantity,
		OrderType: OrderTypes[orderType],
		PegPriceType: PegPriceTypes[pegpricetypes],
		LimitPrice: limitPrice,
	})
}

WS.prototype.ModifyOrder = function(orderId, pair, quantity) {
	pair = pair.toLowerCase()

	this.SendFrame('ModifyOrder', {
		OMSId: 1,
		OrderId: orderId,
		InstrumentId: Pairs[pair], 
		Quantity: quantity,
	})
}

WS.prototype.CancelOrder = function(accountId, orderId, clOrderId) {
	this.SendFrame('CancelOrder', {
		OMSId: 1,
		AccountId: accountId,
		OrderId: orderId,
		ClOrderId: clOrderId, 
	})
}

WS.prototype.CancelAllOrders = function(accountId, pair) {
	pair = pair.toLowerCase()

	this.SendFrame('CancelAllOrders', {
		OMSId: 1,
		AccountId: accountId,
		InstrumentId: Pairs[pair],
	})
}

WS.prototype.GetOrderStatus = function(accountId, orderId) {
	this.SendFrame('CancelAllOrders', {
		OMSId: 1,
		AccountId: accountId,
		OrderId: orderId,
	})
}

WS.prototype.GetOrderFee = function(accountId, pair, amount, orderType, makerTaker) {
	pair = pair.toLowerCase()

	this.SendFrame('GetOrderFee', {
		OMSId: 1,
		AccountId: accountId,
		InstrumentId: Pairs[pair],
		Amount: amount,
		OrderType: orderType, //"Market"
		MakerTaker: makerTaker // "Maker"
	})
}

WS.prototype.GetOrderHistory = function(accountId) {
	this.SendFrame('GetOrderHistory', {
		OMSId: 1,
		AccountId: accountId,
	})
}

WS.prototype.GetOpenOrders = function(accountId) {
	this.SendFrame('GetOpenOrders', {
		OMSId: 1,
		AccountId: accountId,
	})
}

module.exports = WS
