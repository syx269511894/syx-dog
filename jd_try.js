/*
京东价格保护：脚本更新地址 https://raw.githubusercontent.com/ZCY01/daily_scripts/main/jd/jd_try.js
脚本兼容: QuantumultX, Node.js

⚠️ 非常耗时的脚本。最多可能执行半小时！
⚠️ 每天最多关注300个商店，但用户商店关注上限为500个。
请配合取关脚本试用，使用 jd_unsubscribe.js 提前取关至少250个商店确保京东试用脚本正常运行。

商品最低价格（包含）（默认60）：JD_TRY_MIN_PRICE
收集商品时每页的商品数量（默认12）：JD_TRY_PAGE_SIZE

==========================Quantumultx=========================
[task_local]
# 取关京东店铺商品，请在 boxjs 修改取消关注店铺数量
5 10 * * * https://raw.githubusercontent.com/lxk0301/jd_scripts/master/jd_unsubscribe.js, tag=取关京东店铺商品, enabled=true

# 京东价格保护
30 10 * * * https://raw.githubusercontent.com/ZCY01/daily_scripts/main/jd/jd_try.js, tag=京东试用, img-url=https://raw.githubusercontent.com/ZCY01/img/master/jdtryv1.png, enabled=true
 */
const $ = new Env('京东试用')
let allMessage = '';
let cookiesArr = [],
	cookie = '',
	jdNotify = false,
	jdDebug = false,
	notify
const selfdomain = 'https://try.m.jd.com'
let allGoodList = []

// default params
$.pageSize = 30
let cidsList = ["全部商品","精选试用","闪电试用","家用电器", "手机数码", "电脑办公", "家居家装","美妆护肤","服饰鞋包","母婴玩具","钟表奢品","个人护理","家庭清洁","食品饮料","更多惊喜"]
let typeList = ["免费试用", "闪电试用","30天试用"]
let goodFilters = "茶@粽子@玻璃@教程@软件@英语@辅导@花盆@电信@移动@门票@杆菌@联通@培训@靓美@脚气@文胸@卷尺@看房@鞋带@益生菌@丰胸@课@体验班@精品课@红参@益生元@御夫王@苗霸@北海游@购房@键盘膜@情趣内衣@种子@三元催化@万向轮@档案袋@癣@中年@老太太@妇女@私处@孕妇@卫生巾@卫生条@课@培训@阴道@生殖器@肛门@狐臭@少女内衣@胸罩@洋娃娃@女孩玩具@少女@女性内衣@女性内裤@女内裤@女内衣@女孩@鱼饵@钓鱼@吊带@黑丝@钢圈@婴儿@幼儿@娃娃@网课@网校@手机壳@网络课程@疣@避孕套@女纯棉@按键贴@背膜@后膜@背贴@贝尔思力@卡薇尔@三角裤@痔疮@神皂@美少女@纸尿@英语@俄语@四级@六级@四六级@在线网络@在线@宫颈@螺丝@糜烂@打底裤@手机膜@早早孕@鱼@狗@艾草@灸@贴@膏@药@北海@在线@膜@旅游@云南@泰国@系统@会计@火锅@隔离@零食@眼镜@眼睛@精华露".split('@')
let minPrice = 70
let maxPrice = 9999999999999

const cidsMap = {
	"全部商品": "0",
	"精选试用": "0",
	"闪电试用": "0",
	"家用电器": "737",
	"手机数码": "652,9987",
	"电脑办公": "670",
	"家居家装": "1620,6728,9847,9855,6196,15248,14065",
	"美妆护肤": "1316",
	"服饰鞋包": "1315,1672,1318,11729",
	"母婴玩具": "1319,6233",
	"生鲜美食": "12218",
	"图书音像": "1713,4051,4052,4053,7191,7192,5272",
	"钟表奢品": "5025,6144",
	"个人护理": "16750",
	"家庭清洁": "15901",
	"食品饮料": "1320,12259",
	"更多惊喜": "4938,13314,6994,9192,12473,6196,5272,12379,13678,15083,15126,15980",
}
const typeMap = {
	"全部试用": "0",
	"免费试用": "1",
	"闪电试用": "2",
	"30天试用": "5",
}

!(async () => {
	await requireConfig()
	if (!cookiesArr[0]) {
		$.msg($.name, '【提示】请先获取京东账号一cookie\n直接使用NobyDa的京东签到获取', 'https://bean.m.jd.com/', {
			"open-url": "https://bean.m.jd.com/"
		})
		return
	}
	for (let i = 0; i < cookiesArr.length; i++) {
		if (cookiesArr[i]) {
			cookie = cookiesArr[i];
			$.UserName = decodeURIComponent(cookie.match(/pt_pin=([^; ]+)(?=;?)/) && cookie.match(/pt_pin=([^; ]+)(?=;?)/)[1])
			$.index = i + 1;
			$.isLogin = true;
			$.nickName = '';
			await TotalBean();
			console.log(`\n开始【京东账号${$.index}】${$.nickName || $.UserName}\n`);
			if (!$.isLogin) {
				$.msg($.name, `【提示】cookie已失效`, `京东账号${$.index} ${$.nickName || $.UserName}\n请重新登录获取\nhttps://bean.m.jd.com/bean/signIndex.action`, {
					"open-url": "https://bean.m.jd.com/bean/signIndex.action"
				});

				if ($.isNode()&& allMessage) {
					await notify.sendNotify(`${$.name}cookie已失效 - ${$.UserName}`, `京东账号${$.index} ${$.UserName}\n请重新登录获取cookie`);
				}
				continue
			}

			$.goodList = []
			$.successList = []
			if(allGoodList.length == 0){
				await getGoodList()
			}
			await filterGoodList()

			$.totalTry = 0
			$.totalGoods = $.goodList.length
			await tryGoodList()
			await getSuccessList()

			await showMsg()
		}
	}
})()
.catch((e) => {
	console.log(`❗️ ${$.name} 运行错误！\n${e}`)
	if (eval(jdDebug)) $.msg($.name, ``, `${e}`)
}).finally(() => $.done())

function requireConfig() {
	return new Promise(resolve => {
		console.log('开始获取配置文件\n')
		notify = $.isNode() ? require('./sendNotify') : '';
		//Node.js用户请在jdCookie.js处填写京东ck;
		if ($.isNode()) {
			const jdCookieNode = $.isNode() ? require('./jdCookie.js') : '';
			Object.keys(jdCookieNode).forEach((item) => {
				if (jdCookieNode[item]) {
					cookiesArr.push(jdCookieNode[item])
				}
			})
			if (process.env.JD_DEBUG && process.env.JD_DEBUG === 'false') console.log = () => {};
		} else {
			//IOS等用户直接用NobyDa的jd cookie
			let cookiesData = $.getdata('CookiesJD') || "[]";
			cookiesData = jsonParse(cookiesData);
			cookiesArr = cookiesData.map(item => item.cookie);
			cookiesArr.reverse();
			cookiesArr.push(...[$.getdata('CookieJD2'), $.getdata('CookieJD')]);
			cookiesArr.reverse();
			cookiesArr = cookiesArr.filter(item => item !== "" && item !== null && item !== undefined);
		}
		console.log(`共${cookiesArr.length}个京东账号\n`)

		if ($.isNode()) {
			if (process.env.JD_TRY_CIDS_KEYS) {
				cidsList = process.env.JD_TRY_CIDS_KEYS.split('@').filter(key=>{
					return Object.keys(cidsMap).includes(key)
				})
			}
			if (process.env.JD_TRY_TYPE_KEYS) {
				typeList = process.env.JD_TRY_CIDS_KEYS.split('@').filter(key=>{
					return Object.keys(typeMap).includes(key)
				})
			}
			if(process.env.JD_TRY_GOOD_FILTERS){
				goodFilters = process.env.JD_TRY_GOOD_FILTERS.split('@')
			}
			if (process.env.JD_TRY_MIN_PRICE) {
				minPrice = process.env.JD_TRY_MIN_PRICE * 80
			}
			if (process.env.JD_TRY_PAGE_SIZE) {
				$.pageSize = process.env.JD_TRY_PAGE_SIZE * 30
			}
		} else {
			let qxCidsList = []
			let qxTypeList = []
			const cidsKeys = Object.keys(cidsMap)
			const typeKeys = Object.keys(typeMap)
			for (let key of cidsKeys) {
				const open = $.getdata(key)
				if (open == 'true') qxCidsList.push(key)
			}
			for (let key of typeKeys) {
				const open = $.getdata(key)
				if (open == 'true') qxTypeList.push(key)
			}
			if (qxCidsList.length != 0) cidsList = qxCidsList
			if (qxTypeList.length != 0) typeList = qxTypeList
			if ($.getdata('filter')) goodFilters = $.getdata('filter').split('&')
			if ($.getdata('min_price')) minPrice = Number($.getdata('min_price'))
			if ($.getdata('page_size')) $.pageSize = Number($.getdata('page_size'))
			if ($.pageSize == 0) $.pageSize = 12
		}
		resolve()
	})
}

function getGoodListByCond(cids, page, pageSize, type, state) {

	return new Promise((resolve, reject) => {
		let option = taskurl(`${selfdomain}/activity/list?pb=1&cids=${cids}&page=${page}&pageSize=${pageSize}&type=${type}&state=${state}`)
		delete option.headers['Cookie']
		$.get(option, (err, resp, data) => {
			try {
				if (err) {
					console.log(`🚫 ${arguments.callee.name.toString()} API请求失败，请检查网路\n${JSON.stringify(err)}`)
				} else {
					data = JSON.parse(data)
					if (data.success) {
						$.totalPages = data.data.pages
						allGoodList = allGoodList.concat(data.data.data)
					} else {
						console.log(`💩 获得 ${cids} ${page} 列表失败: ${data.message}`)
					}
				}
			} catch (e) {
				reject(`⚠️ ${arguments.callee.name.toString()} API返回结果解析出错\n${e}\n${JSON.stringify(data)}`)
			} finally {
				resolve()
			}
		})
	})
}

async function getGoodList() {
	if (cidsList.length === 0) cidsList.push("全部商品")
	if (typeList.length === 0) typeList.push("全部试用")
	for (let cidsKey of cidsList) {
		for (let typeKey of typeList) {
			if (!cidsMap.hasOwnProperty(cidsKey) || !typeMap.hasOwnProperty(typeKey)) continue
			console.log(`⏰ 获取 ${cidsKey} ${typeKey} 商品列表`)
			$.totalPages = 1
			for (let page = 1; page <= $.totalPages; page++) {
				await getGoodListByCond(cidsMap[cidsKey], page, $.pageSize, typeMap[typeKey], '0')
			}
		}
	}
}

async function filterGoodList() {
	console.log(`⏰ 过滤商品列表，当前共有${allGoodList.length}个商品`)
	const now = Date.now()
	const oneMoreDay = now + 24 * 60 * 60 * 1000
	$.goodList = allGoodList.filter(good => {
		// 1. good 有问题
		// 2. good 距离结束不到10min
		// 3. good 的结束时间大于一天
		// 4. good 的价格小于最小的限制
		// 5. good 的价格大于最大的限制
		if (!good || good.endTime < now + 10 * 60 * 1000 || good.endTime > oneMoreDay || good.jdPrice < minPrice || good.jdPrice > maxPrice) {
			return false
		}
		for (let item of goodFilters) {
			if (good.trialName.indexOf(item) != -1) return false
		}
		return true

	})
	await getApplyStateByActivityIds()
	$.goodList = $.goodList.sort((a, b) => {
		return b.jdPrice - a.jdPrice
	})
}

async function getApplyStateByActivityIds() {
	function opt(ids) {
		return new Promise((resolve, reject) => {
			$.get(taskurl(`${selfdomain}/getApplyStateByActivityIds?activityIds=${ids.join(',')}`), (err, resp, data) => {
				try {
					if (err) {
						console.log(`🚫 ${arguments.callee.name.toString()} API请求失败，请检查网路\n${JSON.stringify(err)}`)
					} else {
						data = JSON.parse(data)
						ids.length = 0
						for (let apply of data) ids.push(apply.activityId)
					}
				} catch (e) {
					reject(`⚠️ ${arguments.callee.name.toString()} API返回结果解析出错\n${e}\n${JSON.stringify(data)}`)
				} finally {
					$.goodList = $.goodList.filter(good => {
						for (let id of ids) {
							if (id == good.id) {
								return false
							}
						}
						return true
					})
					resolve()
				}
			})
		})
	}

	let list = []
	for (let good of $.goodList) {
		list.push(good.id)
		if (list.length == $.pageSize) {
			await opt(list)
			list.length = 0
		}
	}
	if (list.length) await opt(list)
}

function canTry(good) {
	return new Promise((resolve, reject) => {
		let ret = false
		$.get(taskurl(`${selfdomain}/activity?id=${good.id}`), (err, resp, data) => {
			try {
				if (err) {
					console.log(`🚫 ${arguments.callee.name.toString()} API请求失败，请检查网路\n${JSON.stringify(err)}`)
				} else {
					ret = data.indexOf('trySku') != -1
					let result = data.match(/"shopId":(\d+)/)
					if (result) {
						good.shopId = eval(result[1])
					}
				}
			} catch (e) {
				reject(`⚠️ ${arguments.callee.name.toString()} API返回结果解析出错\n${e}\n${JSON.stringify(data)}`)
			} finally {
				resolve(ret)
			}
		})
	})
}

function isFollowed(good) {
	return new Promise((resolve, reject) => {
		$.get(taskurl(`${selfdomain}/isFollowed?id=${good.shopId}`, good.id), (err, resp, data) => {
			try {
				if (err) {
					console.log(`🚫 ${arguments.callee.name.toString()} API请求失败，请检查网路\n${JSON.stringify(err)}`)
				} else {
					data = JSON.parse(data)
					resolve(data.success && data.data)
				}
			} catch (e) {
				reject(`⚠️ ${arguments.callee.name.toString()} API返回结果解析出错\n${e}\n${JSON.stringify(data)}`)
			} finally {
				resolve(false)
			}
		})
	})
}

function followShop(good) {
	return new Promise((resolve, reject) => {
		$.get(taskurl(`${selfdomain}/followShop?id=${good.shopId}`, good.id), (err, resp, data) => {
			try {
				if (err) {
					console.log(`🚫 ${arguments.callee.name.toString()} API请求失败，请检查网路\n${JSON.stringify(err)}`)
				} else {
					data = JSON.parse(data)
					if (data.code == 'F0410') {
						$.running = false
						$.stopMsg = data.msg || "关注数超过上限了哦~先清理下关注列表吧"
					}
					resolve(data.success && data.data)
				}
			} catch (e) {
				reject(`⚠️ ${arguments.callee.name.toString()} API返回结果解析出错\n${e}\n${JSON.stringify(data)}`)
			} finally {
				resolve(false)
			}
		})
	})
}

async function tryGoodList() {
	console.log(`⏰ 即将申请 ${$.goodList.length} 个商品`)
	$.running = true
	$.stopMsg = '申请完毕'
	for (let i = 0; i < $.goodList.length && $.running; i++) {
		let good = $.goodList[i]
		if (!await canTry(good)) continue
		// 如果没有关注且关注失败
		if (good.shopId && !await isFollowed(good) && !await followShop(good)) continue
		// 两个申请间隔不能太短，放在下面有利于确保 follwShop 完成
		await $.wait(7000)
		// 关注完毕，即将试用
		await doTry(good)
	}
}

async function doTry(good) {
	return new Promise((resolve, reject) => {
		$.get(taskurl(`${selfdomain}/migrate/apply?activityId=${good.id}&source=1&_s=m`, good.id), (err, resp, data) => {
			try {
				if (err) {
					console.log(`🚫 ${arguments.callee.name.toString()} API请求失败，请检查网路\n${JSON.stringify(err)}`)
				} else {
					data = JSON.parse(data)
					if (data.success) {
						$.totalTry += 1
						console.log(`🥳 ${good.id} 🛒${good.trialName.substr(0,15)}🛒 ${data.message}`)
					} else if (data.code == '-131') { // 每日300个商品
						$.stopMsg = data.message
						$.running = false
					} else {
						console.log(`🤬 ${good.id} 🛒${good.trialName.substr(0,15)}🛒 ${JSON.stringify(data)}`)
					}
				}
			} catch (e) {
				reject(`⚠️ ${arguments.callee.name.toString()} API返回结果解析出错\n${e}\n${JSON.stringify(data)}`)
			} finally {
				resolve()
			}
		})
	})
}

async function getSuccessList() {
	// 一页12个商品，不会吧不会吧，不会有人一次性中奖12个商品吧？！🤔
	return new Promise((resolve, reject) => {
		const option = {
			url: `https://try.jd.com/my/tryList?selected=2&page=1&tryVersion=2&_s=m`,
			headers: {
				'Host': 'try.jd.com',
				'Connection': 'keep-alive',
				'UserAgent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1',
				'Accept': '*/*',
				'Referer': 'https://try.m.jd.com/',
				'Accept-Encoding': 'gzip, deflate, br',
				'Accept-Language': 'zh,zh-CN;q=0.9,en;q=0.8',
				'Cookie': cookie
			}
		}
		$.get(option, (err, resp, data) => {
			try {
				if (err) {
					console.log(`🚫 ${arguments.callee.name.toString()} API请求失败，请检查网路\n${JSON.stringify(err)}`)
				} else {
					data = JSON.parse(data)
					if (data.success && data.data) {
						$.successList = data.data.data.filter(item => {
							return item.text.text.indexOf('请尽快领取') != -1
						})
					} else {
						console.log(`💩 获得成功列表失败: ${data.message}`)
					}
				}
			} catch (e) {
				reject(`⚠️ ${arguments.callee.name.toString()} API返回结果解析出错\n${e}\n${JSON.stringify(data)}`)
			} finally {
				resolve()
			}
		})
	})
}

async function showMsg() {
	let message = `京东账号${$.index} ${$.nickName || $.UserName}\n🎉 本次申请：${$.totalTry}/${$.totalGoods}个商品🛒\n🎉 ${$.successList.length}个商品待领取🤩\n🎉 结束原因：${$.stopMsg}`
	if (!jdNotify || jdNotify === 'false') {
		$.msg($.name, ``, message, {
			"open-url": 'https://try.m.jd.com/user'
		})
		if($.isNode()){
			await notify.sendNotify(`${$.name} - 账号${$.index} - ${$.nickName}`, message)
		}
	} else {
		console.log(message)
	}
}

function taskurl(url, goodId) {
	return {
		'url': url,
		'headers': {
			'Host': 'try.m.jd.com',
			'Accept-Encoding': 'gzip, deflate, br',
			'Cookie': cookie,
			'Connection': 'keep-alive',
			'Accept': '*/*',
			'UserAgent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1',
			'Accept-Language': 'zh-cn',
			'Referer': goodId ? `https://try.m.jd.com/activity/?id=${goodId}` : undefined
		},
	}
}

function TotalBean() {
	return new Promise(async resolve => {
		const options = {
			"url": `https://wq.jd.com/user/info/QueryJDUserInfo?sceneval=2`,
			"headers": {
				"Accept": "application/json,text/plain, */*",
				"Content-Type": "application/x-www-form-urlencoded",
				"Accept-Encoding": "gzip, deflate, br",
				"Accept-Language": "zh-cn",
				"Connection": "keep-alive",
				"Cookie": cookie,
				"Referer": "https://wqs.jd.com/my/jingdou/my.shtml?sceneval=2",
				"User-Agent": $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1")
			},
			"timeout": 10000,
		}
		$.post(options, (err, resp, data) => {
			try {
				if (err) {
					console.log(`${JSON.stringify(err)}`)
					console.log(`${$.name} API请求失败，请检查网路重试`)
				} else {
					if (data) {
						data = JSON.parse(data);
						if (data['retcode'] === 13) {
							$.isLogin = false; //cookie过期
							return
						}
						$.nickName = (data['base'] && data['base'].nickname) || $.UserName;
					} else {
						console.log(`京东服务器返回空数据`)
					}
				}
			} catch (e) {
				$.logErr(e, resp)
			} finally {
				resolve();
			}
		})
	})
}

function jsonParse(str) {
	if (typeof str == "string") {
		try {
			return JSON.parse(str);
		} catch (e) {
			console.log(e);
			$.msg($.name, '', '请勿随意在BoxJs输入框修改内容\n建议通过脚本去获取cookie')
			return [];
		}
	}
}

// 来自 @chavyleung 大佬
// https://raw.githubusercontent.com/chavyleung/scripts/master/Env.js
function Env(name, opts) {
	class Http {
		constructor(env) {
			this.env = env
		}

		send(opts, method = 'GET') {
			opts = typeof opts === 'string' ? {
				url: opts
			} : opts
			let sender = this.get
			if (method === 'POST') {
				sender = this.post
			}
			return new Promise((resolve, reject) => {
				sender.call(this, opts, (err, resp, body) => {
					if (err) reject(err)
					else resolve(resp)
				})
			})
		}

		get(opts) {
			return this.send.call(this.env, opts)
		}

		post(opts) {
			return this.send.call(this.env, opts, 'POST')
		}
	}

	return new(class {
		constructor(name, opts) {
			this.name = name
			this.http = new Http(this)
			this.data = null
			this.dataFile = 'box.dat'
			this.logs = []
			this.isMute = false
			this.isNeedRewrite = false
			this.logSeparator = '\n'
			this.startTime = new Date().getTime()
			Object.assign(this, opts)
			this.log('', `🔔${this.name}, 开始!`)
		}

		isNode() {
			return 'undefined' !== typeof module && !!module.exports
		}

		isQuanX() {
			return 'undefined' !== typeof $task
		}

		isSurge() {
			return 'undefined' !== typeof $httpClient && 'undefined' === typeof $loon
		}

		isLoon() {
			return 'undefined' !== typeof $loon
		}

		toObj(str, defaultValue = null) {
			try {
				return JSON.parse(str)
			} catch {
				return defaultValue
			}
		}

		toStr(obj, defaultValue = null) {
			try {
				return JSON.stringify(obj)
			} catch {
				return defaultValue
			}
		}

		getjson(key, defaultValue) {
			let json = defaultValue
			const val = this.getdata(key)
			if (val) {
				try {
					json = JSON.parse(this.getdata(key))
				} catch {}
			}
			return json
		}

		setjson(val, key) {
			try {
				return this.setdata(JSON.stringify(val), key)
			} catch {
				return false
			}
		}

		getScript(url) {
			return new Promise((resolve) => {
				this.get({
					url
				}, (err, resp, body) => resolve(body))
			})
		}

		runScript(script, runOpts) {
			return new Promise((resolve) => {
				let httpapi = this.getdata('@chavy_boxjs_userCfgs.httpapi')
				httpapi = httpapi ? httpapi.replace(/\n/g, '').trim() : httpapi
				let httpapi_timeout = this.getdata('@chavy_boxjs_userCfgs.httpapi_timeout')
				httpapi_timeout = httpapi_timeout ? httpapi_timeout * 1 : 20
				httpapi_timeout = runOpts && runOpts.timeout ? runOpts.timeout : httpapi_timeout
				const [key, addr] = httpapi.split('@')
				const opts = {
					url: `http://${addr}/v1/scripting/evaluate`,
					body: {
						script_text: script,
						mock_type: 'cron',
						timeout: httpapi_timeout
					},
					headers: {
						'X-Key': key,
						'Accept': '*/*'
					}
				}
				this.post(opts, (err, resp, body) => resolve(body))
			}).catch((e) => this.logErr(e))
		}

		loaddata() {
			if (this.isNode()) {
				this.fs = this.fs ? this.fs : require('fs')
				this.path = this.path ? this.path : require('path')
				const curDirDataFilePath = this.path.resolve(this.dataFile)
				const rootDirDataFilePath = this.path.resolve(process.cwd(), this.dataFile)
				const isCurDirDataFile = this.fs.existsSync(curDirDataFilePath)
				const isRootDirDataFile = !isCurDirDataFile && this.fs.existsSync(rootDirDataFilePath)
				if (isCurDirDataFile || isRootDirDataFile) {
					const datPath = isCurDirDataFile ? curDirDataFilePath : rootDirDataFilePath
					try {
						return JSON.parse(this.fs.readFileSync(datPath))
					} catch (e) {
						return {}
					}
				} else return {}
			} else return {}
		}

		writedata() {
			if (this.isNode()) {
				this.fs = this.fs ? this.fs : require('fs')
				this.path = this.path ? this.path : require('path')
				const curDirDataFilePath = this.path.resolve(this.dataFile)
				const rootDirDataFilePath = this.path.resolve(process.cwd(), this.dataFile)
				const isCurDirDataFile = this.fs.existsSync(curDirDataFilePath)
				const isRootDirDataFile = !isCurDirDataFile && this.fs.existsSync(rootDirDataFilePath)
				const jsondata = JSON.stringify(this.data)
				if (isCurDirDataFile) {
					this.fs.writeFileSync(curDirDataFilePath, jsondata)
				} else if (isRootDirDataFile) {
					this.fs.writeFileSync(rootDirDataFilePath, jsondata)
				} else {
					this.fs.writeFileSync(curDirDataFilePath, jsondata)
				}
			}
		}

		lodash_get(source, path, defaultValue = undefined) {
			const paths = path.replace(/\[(\d+)\]/g, '.$1').split('.')
			let result = source
			for (const p of paths) {
				result = Object(result)[p]
				if (result === undefined) {
					return defaultValue
				}
			}
			return result
		}

		lodash_set(obj, path, value) {
			if (Object(obj) !== obj) return obj
			if (!Array.isArray(path)) path = path.toString().match(/[^.[\]]+/g) || []
			path
				.slice(0, -1)
				.reduce((a, c, i) => (Object(a[c]) === a[c] ? a[c] : (a[c] = Math.abs(path[i + 1]) >> 0 === +path[i + 1] ? [] : {})), obj)[
					path[path.length - 1]
				] = value
			return obj
		}

		getdata(key) {
			let val = this.getval(key)
			// 如果以 @
			if (/^@/.test(key)) {
				const [, objkey, paths] = /^@(.*?)\.(.*?)$/.exec(key)
				const objval = objkey ? this.getval(objkey) : ''
				if (objval) {
					try {
						const objedval = JSON.parse(objval)
						val = objedval ? this.lodash_get(objedval, paths, '') : val
					} catch (e) {
						val = ''
					}
				}
			}
			return val
		}

		setdata(val, key) {
			let issuc = false
			if (/^@/.test(key)) {
				const [, objkey, paths] = /^@(.*?)\.(.*?)$/.exec(key)
				const objdat = this.getval(objkey)
				const objval = objkey ? (objdat === 'null' ? null : objdat || '{}') : '{}'
				try {
					const objedval = JSON.parse(objval)
					this.lodash_set(objedval, paths, val)
					issuc = this.setval(JSON.stringify(objedval), objkey)
				} catch (e) {
					const objedval = {}
					this.lodash_set(objedval, paths, val)
					issuc = this.setval(JSON.stringify(objedval), objkey)
				}
			} else {
				issuc = this.setval(val, key)
			}
			return issuc
		}

		getval(key) {
			if (this.isSurge() || this.isLoon()) {
				return $persistentStore.read(key)
			} else if (this.isQuanX()) {
				return $prefs.valueForKey(key)
			} else if (this.isNode()) {
				this.data = this.loaddata()
				return this.data[key]
			} else {
				return (this.data && this.data[key]) || null
			}
		}

		setval(val, key) {
			if (this.isSurge() || this.isLoon()) {
				return $persistentStore.write(val, key)
			} else if (this.isQuanX()) {
				return $prefs.setValueForKey(val, key)
			} else if (this.isNode()) {
				this.data = this.loaddata()
				this.data[key] = val
				this.writedata()
				return true
			} else {
				return (this.data && this.data[key]) || null
			}
		}

		initGotEnv(opts) {
			this.got = this.got ? this.got : require('got')
			this.cktough = this.cktough ? this.cktough : require('tough-cookie')
			this.ckjar = this.ckjar ? this.ckjar : new this.cktough.CookieJar()
			if (opts) {
				opts.headers = opts.headers ? opts.headers : {}
				if (undefined === opts.headers.Cookie && undefined === opts.cookieJar) {
					opts.cookieJar = this.ckjar
				}
			}
		}

		get(opts, callback = () => {}) {
			if (opts.headers) {
				delete opts.headers['Content-Type']
				delete opts.headers['Content-Length']
			}
			if (this.isSurge() || this.isLoon()) {
				if (this.isSurge() && this.isNeedRewrite) {
					opts.headers = opts.headers || {}
					Object.assign(opts.headers, {
						'X-Surge-Skip-Scripting': false
					})
				}
				$httpClient.get(opts, (err, resp, body) => {
					if (!err && resp) {
						resp.body = body
						resp.statusCode = resp.status
					}
					callback(err, resp, body)
				})
			} else if (this.isQuanX()) {
				if (this.isNeedRewrite) {
					opts.opts = opts.opts || {}
					Object.assign(opts.opts, {
						hints: false
					})
				}
				$task.fetch(opts).then(
					(resp) => {
						const {
							statusCode: status,
							statusCode,
							headers,
							body
						} = resp
						callback(null, {
							status,
							statusCode,
							headers,
							body
						}, body)
					},
					(err) => callback(err)
				)
			} else if (this.isNode()) {
				this.initGotEnv(opts)
				this.got(opts)
					.on('redirect', (resp, nextOpts) => {
						try {
							if (resp.headers['set-cookie']) {
								const ck = resp.headers['set-cookie'].map(this.cktough.Cookie.parse).toString()
								if (ck) {
									this.ckjar.setCookieSync(ck, null)
								}
								nextOpts.cookieJar = this.ckjar
							}
						} catch (e) {
							this.logErr(e)
						}
						// this.ckjar.setCookieSync(resp.headers['set-cookie'].map(Cookie.parse).toString())
					})
					.then(
						(resp) => {
							const {
								statusCode: status,
								statusCode,
								headers,
								body
							} = resp
							callback(null, {
								status,
								statusCode,
								headers,
								body
							}, body)
						},
						(err) => {
							const {
								message: error,
								response: resp
							} = err
							callback(error, resp, resp && resp.body)
						}
					)
			}
		}

		post(opts, callback = () => {}) {
			// 如果指定了请求体, 但没指定`Content-Type`, 则自动生成
			if (opts.body && opts.headers && !opts.headers['Content-Type']) {
				opts.headers['Content-Type'] = 'application/x-www-form-urlencoded'
			}
			if (opts.headers) delete opts.headers['Content-Length']
			if (this.isSurge() || this.isLoon()) {
				if (this.isSurge() && this.isNeedRewrite) {
					opts.headers = opts.headers || {}
					Object.assign(opts.headers, {
						'X-Surge-Skip-Scripting': false
					})
				}
				$httpClient.post(opts, (err, resp, body) => {
					if (!err && resp) {
						resp.body = body
						resp.statusCode = resp.status
					}
					callback(err, resp, body)
				})
			} else if (this.isQuanX()) {
				opts.method = 'POST'
				if (this.isNeedRewrite) {
					opts.opts = opts.opts || {}
					Object.assign(opts.opts, {
						hints: false
					})
				}
				$task.fetch(opts).then(
					(resp) => {
						const {
							statusCode: status,
							statusCode,
							headers,
							body
						} = resp
						callback(null, {
							status,
							statusCode,
							headers,
							body
						}, body)
					},
					(err) => callback(err)
				)
			} else if (this.isNode()) {
				this.initGotEnv(opts)
				const {
					url,
					..._opts
				} = opts
				this.got.post(url, _opts).then(
					(resp) => {
						const {
							statusCode: status,
							statusCode,
							headers,
							body
						} = resp
						callback(null, {
							status,
							statusCode,
							headers,
							body
						}, body)
					},
					(err) => {
						const {
							message: error,
							response: resp
						} = err
						callback(error, resp, resp && resp.body)
					}
				)
			}
		}
		/**
		 *
		 * 示例:$.time('yyyy-MM-dd qq HH:mm:ss.S')
		 *    :$.time('yyyyMMddHHmmssS')
		 *    y:年 M:月 d:日 q:季 H:时 m:分 s:秒 S:毫秒
		 *    其中y可选0-4位占位符、S可选0-1位占位符，其余可选0-2位占位符
		 * @param {*} fmt 格式化参数
		 *
		 */
		time(fmt) {
			let o = {
				'M+': new Date().getMonth() + 1,
				'd+': new Date().getDate(),
				'H+': new Date().getHours(),
				'm+': new Date().getMinutes(),
				's+': new Date().getSeconds(),
				'q+': Math.floor((new Date().getMonth() + 3) / 3),
				'S': new Date().getMilliseconds()
			}
			if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (new Date().getFullYear() + '').substr(4 - RegExp.$1.length))
			for (let k in o)
				if (new RegExp('(' + k + ')').test(fmt))
					fmt = fmt.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length))
			return fmt
		}

		/**
		 * 系统通知
		 *
		 * > 通知参数: 同时支持 QuanX 和 Loon 两种格式, EnvJs根据运行环境自动转换, Surge 环境不支持多媒体通知
		 *
		 * 示例:
		 * $.msg(title, subt, desc, 'twitter://')
		 * $.msg(title, subt, desc, { 'open-url': 'twitter://', 'media-url': 'https://github.githubassets.com/images/modules/open_graph/github-mark.png' })
		 * $.msg(title, subt, desc, { 'open-url': 'https://bing.com', 'media-url': 'https://github.githubassets.com/images/modules/open_graph/github-mark.png' })
		 *
		 * @param {*} title 标题
		 * @param {*} subt 副标题
		 * @param {*} desc 通知详情
		 * @param {*} opts 通知参数
		 *
		 */
		msg(title = name, subt = '', desc = '', opts) {
			const toEnvOpts = (rawopts) => {
				if (!rawopts) return rawopts
				if (typeof rawopts === 'string') {
					if (this.isLoon()) return rawopts
					else if (this.isQuanX()) return {
						'open-url': rawopts
					}
					else if (this.isSurge()) return {
						url: rawopts
					}
					else return undefined
				} else if (typeof rawopts === 'object') {
					if (this.isLoon()) {
						let openUrl = rawopts.openUrl || rawopts.url || rawopts['open-url']
						let mediaUrl = rawopts.mediaUrl || rawopts['media-url']
						return {
							openUrl,
							mediaUrl
						}
					} else if (this.isQuanX()) {
						let openUrl = rawopts['open-url'] || rawopts.url || rawopts.openUrl
						let mediaUrl = rawopts['media-url'] || rawopts.mediaUrl
						return {
							'open-url': openUrl,
							'media-url': mediaUrl
						}
					} else if (this.isSurge()) {
						let openUrl = rawopts.url || rawopts.openUrl || rawopts['open-url']
						return {
							url: openUrl
						}
					}
				} else {
					return undefined
				}
			}
			if (!this.isMute) {
				if (this.isSurge() || this.isLoon()) {
					$notification.post(title, subt, desc, toEnvOpts(opts))
				} else if (this.isQuanX()) {
					$notify(title, subt, desc, toEnvOpts(opts))
				}
			}
			if (!this.isMuteLog) {
				let logs = ['', '==============📣系统通知📣==============']
				logs.push(title)
				subt ? logs.push(subt) : ''
				desc ? logs.push(desc) : ''
				console.log(logs.join('\n'))
				this.logs = this.logs.concat(logs)
			}
		}

		log(...logs) {
			if (logs.length > 0) {
				this.logs = [...this.logs, ...logs]
			}
			console.log(logs.join(this.logSeparator))
		}

		logErr(err, msg) {
			const isPrintSack = !this.isSurge() && !this.isQuanX() && !this.isLoon()
			if (!isPrintSack) {
				this.log('', `❗️${this.name}, 错误!`, err)
			} else {
				this.log('', `❗️${this.name}, 错误!`, err.stack)
			}
		}

		wait(time) {
			return new Promise((resolve) => setTimeout(resolve, time))
		}

		done(val = {}) {
			const endTime = new Date().getTime()
			const costTime = (endTime - this.startTime) / 1000
			this.log('', `🔔${this.name}, 结束! 🕛 ${costTime} 秒`)
			this.log()
			if (this.isSurge() || this.isQuanX() || this.isLoon()) {
				$done(val)
			}
		}
	})(name, opts)
}
