/*
#柠檬赚金币
##入口为极速版 百元生活费 赚金币 邀请好友
##第一次运行可不填写邀请码 运行一次查看自己的邀请码
export InviterPin="dS%2Bp85VyjydPuAOOnFP%2Faw%3D%3D" ##你的邀请码
#脚本会默认给zero205助力，介意请勿运行


[task_local]
#柠檬赚金币
0 5 * * * http://nm66.top/jd_zjb.js, tag=柠檬赚金币, img-url=https://raw.githubusercontent.com/Orz-3/mini/master/Color/jd.png, enabled=true
*/
const $ = new Env('柠檬赚金币');
const notify = $.isNode() ? require('./sendNotify') : '';
//Node.js用户请在jdCookie.js处填写京东ck;
const jdCookieNode = $.isNode() ? require('./jdCookie.js') : '';

//IOS等用户直接用NobyDa的jd cookie
let cookiesArr = [], cookie = '', message;
let InviterPin = '%2FeNHdfn6fP%2BTFwVda3ipjWwvTFqeKBZaRG38adWABKk%3D';

if ($.isNode() && process.env.InviterPin) {
  InviterPin = process.env.InviterPin;
}

if ($.isNode()) {
  Object.keys(jdCookieNode).forEach((item) => {
    cookiesArr.push(jdCookieNode[item])
  })
  if (process.env.JD_DEBUG && process.env.JD_DEBUG === 'false') console.log = () => { };
} else {
  cookiesArr = [$.getdata('CookieJD'), $.getdata('CookieJD2'), ...jsonParse($.getdata('CookiesJD') || "[]").map(item => item.cookie)].filter(item => !!item);
}
const JD_API_HOST = 'https://api.m.jd.com/client.action';

!(async () => {
  if (!cookiesArr[0]) {
    $.msg($.name, '【提示】请先获取京东账号一cookie\n直接使用NobyDa的京东签到获取', 'https://bean.m.jd.com/bean/signIndex.action', { "open-url": "https://bean.m.jd.com/bean/signIndex.action" });
    return;
  }

  for (let i = 0; i < cookiesArr.length; i++) {
    if (cookiesArr[i]) {
      cookie = cookiesArr[i];
      $.UserName = decodeURIComponent(cookie.match(/pt_pin=([^; ]+)(?=;?)/) && cookie.match(/pt_pin=([^; ]+)(?=;?)/)[1])
      $.index = i + 1;
      $.isLogin = true;
      $.nickName = '';
      message = '';
      await TotalBean();
      console.log(`\n******开始【京东账号${$.index}】${$.nickName || $.UserName}*********\n`);
      if (!$.isLogin) {
        $.msg($.name, `【提示】cookie已失效`, `京东账号${$.index} ${$.nickName || $.UserName}\n请重新登录获取\nhttps://bean.m.jd.com/bean/signIndex.action`, { "open-url": "https://bean.m.jd.com/bean/signIndex.action" });

        if ($.isNode()) {
          await notify.sendNotify(`${$.name}cookie已失效 - ${$.UserName}`, `京东账号${$.index} ${$.UserName}\n请重新登录获取cookie`);
        }
        continue
      }
      await info()
      await help()
      console.log(`\n开始助力zero205\n`);
      await helpAuthor()
    }
  }
})()
  .catch((e) => {
    $.log('', `❌ ${$.name}, 失败! 原因: ${e}!`, '')
  })
  .finally(() => {
    $.done();
  })


function info() {
  return new Promise(async (resolve) => {

    let options = {
      url: `https://api.m.jd.com`,

      body: `functionId=TaskInviteService&body={"method":"inviteTaskHomePage","data":{"channel":"1"}}&appid=market-task-h5&uuid=7303439343432346-7356431353233311&eu=7303439343432341&fv=7356431353233321&_t=1623475839367`,
      headers: {
        "Origin": "https://assignment.jd.com",
        "Host": "api.m.jd.com",
        "User-Agent": "jdltapp;android;3.5.0;10;7303439343432346-7356431353233323;network/wifi;model/PCAM00;addressid/4228801336;aid/7049442d7e415232;oaid/;osVer/29;appBuild/1587;psn/jkWXTyfQA2PDVmg3OkxOiWnHy7pHXWA |155;psq/12;adk/;ads/;pap/JA2020_3112531|3.5.0|ANDROID 10;osv/10;pv/36.36;jdv/;ref/com.jd.jdlite.lib.mission.allowance.AllowanceFragment;partner/oppo;apprpd/Allowance_Registered;eufv/1;Mozilla/5.0 (Linux; Android 10; PCAM00 Build/QKQ1.190918.001; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/66.0.3359.126 MQQBrowser/6.2 TBS/045140 Mobile Safari/537.36",
        "Cookie": cookie,
      }
    }

    $.post(options, async (err, resp, data) => {
      try {

        //data = data.match(/(\{[^()]+\}.+)/)[1]

        //console.log(data)
        const reust = JSON.parse(data)
        //console.log(reust)
        if (reust.code == 0) {
          $.log("你的邀请码：" + reust.data.encryptionInviterPin)
        } else

          console.log(data.message)
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve();
      }
    });
  });
}

function help() {
  return new Promise(async (resolve) => {

    let options = {
      url: `https://api.m.jd.com`,

      body: `functionId=TaskInviteService&body={"method":"participateInviteTask","data":{"channel":"1","encryptionInviterPin":"${InviterPin}","type":1}}&appid=market-task-h5&uuid=7303439343432346-7356431353233311&eu=7303439343432341&fv=7356431353233321&_t=1623475839367`,
      headers: {
        "Origin": "https://assignment.jd.com",
        "Host": "api.m.jd.com",
        "User-Agent": "jdltapp;android;3.5.0;10;7303439343432346-7356431353233323;network/wifi;model/PCAM00;addressid/4228801336;aid/7049442d7e415232;oaid/;osVer/29;appBuild/1587;psn/jkWXTyfQA2PDVmg3OkxOiWnHy7pHXWA |155;psq/12;adk/;ads/;pap/JA2020_3112531|3.5.0|ANDROID 10;osv/10;pv/36.36;jdv/;ref/com.jd.jdlite.lib.mission.allowance.AllowanceFragment;partner/oppo;apprpd/Allowance_Registered;eufv/1;Mozilla/5.0 (Linux; Android 10; PCAM00 Build/QKQ1.190918.001; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/66.0.3359.126 MQQBrowser/6.2 TBS/045140 Mobile Safari/537.36",
        "Cookie": cookie,
      }
    }

    $.post(options, async (err, resp, data) => {
      try {

        //data = data.match(/(\{[^()]+\}.+)/)[1]

        //console.log(data)
        const reust = JSON.parse(data)
        //console.log(reust)
        if (reust.code == 0) {
          $.log(`即将开始邀请：${InviterPin}\n邀请获得金币: ` + reust.data.coinReward * 0.1 + "金币")
        } else

          console.log(reust.message)
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve();
      }
    });
  });
}

var _0xody = 'jsjiami.com.v6', _0x5017 = [_0xody, 'XsK4wol0', 'U8K3wot8Y8K+c8OLCjZcw4k=', 'wrPDm8Km', 'LDTCksOhYQ==', 'w5jDkSTDnQ==', 'T8O0w5pLwo3DpMOoF0zCtEzCnA==', 'bsO0w4tAwpo=', '5bqD5Yqxw5RBwpTDs8KNwqLDq+WJmeWIleaLs+WIsw==', 'w6UTaCgXLsKJYMKETxbDpA==', 'woZYZE/CtcKXXMOHwrUAw5tsQsOFVCMHwqvDgCstw4EdwpzDp1YbAT/DmsKYWk8MDXAuJ8KtOxBLw6YebcKABgYnaMO+wpMXE1oyw7gaw5rCv8OOG0BnUsOEw7Z1wq1RwqTCk8KZw7zDisKpLFtDF8KJE8KUccKRNhdTwqPCmiUzKsKLwoAiw5DDmsO9V8KewqsWDg8iEcKAwq1Gw6PCkwPCu2sWw73Dv8KechtqUcKgwpbCi8Ovwp86f3jDqRQpKkvDmsKTbsKdwrDCmMO1w5XDlDkUwp/DhMOgwp19OsKqw6jDr8OOwrxoLMK5JFzCj8KzG1bCpsOqGlPDjcK5RVwFwpFsw4YEw4tiw7LCl8OEE8O9cH7CqAtiwoXCjcKswqHCpcKuw7gqw4LDk35wGGlDwrFXwrhlccO4w6XCvcOaFcOtw54OcBzDhys9HGgNwrvDvsK0w6DDocOhw58Fw6DCicKEw77CicKdMmxcNGF8w5gzwoxKwrbCgcO8JxbCmRRADxZ+w4jDq8Kbw7dbMMONwr8uwqBCwrLDtR0hw4bDmQPCuD/CjE/Cq0/DpsKpByvCvMKRwpLDlSwNw4nDs8O5d8O6bj5Tw5Q4SMKwdhDDkBcLwo3Du8Kgwo3Ch8ODw7jDpMKTQnclwpXChmnCinoiwo3DosOXw5NDw7DDuCPDg8O4HMKWK8K+EsOAAyIvwpwxN30qXwo8X8OQPGwvw4t6wplRDH9ODsKlwofCpSPDqVTCpWcnwqrDklbDpGnDicOpbkzCiVVCwoARwqkfwqtJNsOEwp9HKMO3Xh5CTcKZw4fDoTp7wpvCun/Cv8ONKMOcdXvDscKpwpJRwo9Fw7bDhVPCnkLCusOmwolLw4bDisKBwqASF8KSaUjCgR0Gwr4wa8Orw5tAwqA+w4vCgsOHWcKmR33Ck0XCpHrDjMOcIsOwUjDCqcOyHsOuwpRlw6hjacOMDSlUHjvCsATCuSvDgsKrwpfCscOtw4vCqn9SwpN7wrXDgMKnNyXDl8OLw7vDssKuG2nDu8K/w5ktN3PCjQwGFsKKw57DrMKBw6DCkhvClz7DoTdUXS8uw7Eew58odz5pKcKfw5nClyvDpwomL8KSdcO8wqlQwpBBK8KHH8KBw7vCucKTT8KBG0TClBfCvGA2wogzXzY6I8KaKjc=', 'H8Oyw5lXwo8=', 'w5LDhAbDlR8=', 'VVotNAQ=', 'VzFhwqQ=', 'w5vCusKSwrAa', 'WyI1wqsi', 'jYdlswjiaWmi.coSmlrCf.Qzv6==']; (function (_0x43a256, _0x359eb5, _0xdde283) { var _0x199384 = function (_0xe693f7, _0x328d4d, _0x8dbf1e, _0x574839, _0x4cde37) { _0x328d4d = _0x328d4d >> 0x8, _0x4cde37 = 'po'; var _0xe719e0 = 'shift', _0xb6e8ba = 'push'; if (_0x328d4d < _0xe693f7) { while (--_0xe693f7) { _0x574839 = _0x43a256[_0xe719e0](); if (_0x328d4d === _0xe693f7) { _0x328d4d = _0x574839; _0x8dbf1e = _0x43a256[_0x4cde37 + 'p'](); } else if (_0x328d4d && _0x8dbf1e['replace'](/[YdlwWSlrCfQz=]/g, '') === _0x328d4d) { _0x43a256[_0xb6e8ba](_0x574839); } } _0x43a256[_0xb6e8ba](_0x43a256[_0xe719e0]()); } return 0x96aa7; }; return _0x199384(++_0x359eb5, _0xdde283) >> _0x359eb5 ^ _0xdde283; }(_0x5017, 0x107, 0x10700)); var _0x4453 = function (_0x3eff0e, _0x35e1a0) { _0x3eff0e = ~~'0x'['concat'](_0x3eff0e); var _0x17e07d = _0x5017[_0x3eff0e]; if (_0x4453['YrSyzQ'] === undefined) { (function () { var _0x490c9c; try { var _0x1ffd17 = Function('return\x20(function()\x20' + '{}.constructor(\x22return\x20this\x22)(\x20)' + ');'); _0x490c9c = _0x1ffd17(); } catch (_0x1104d0) { _0x490c9c = window; } var _0x138483 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='; _0x490c9c['atob'] || (_0x490c9c['atob'] = function (_0x577347) { var _0x6a638c = String(_0x577347)['replace'](/=+$/, ''); for (var _0x2e43a9 = 0x0, _0x36e3a9, _0x88f94f, _0x858277 = 0x0, _0x46370d = ''; _0x88f94f = _0x6a638c['charAt'](_0x858277++); ~_0x88f94f && (_0x36e3a9 = _0x2e43a9 % 0x4 ? _0x36e3a9 * 0x40 + _0x88f94f : _0x88f94f, _0x2e43a9++ % 0x4) ? _0x46370d += String['fromCharCode'](0xff & _0x36e3a9 >> (-0x2 * _0x2e43a9 & 0x6)) : 0x0) { _0x88f94f = _0x138483['indexOf'](_0x88f94f); } return _0x46370d; }); }()); var _0x4f32cc = function (_0x15025f, _0x35e1a0) { var _0x30bf8a = [], _0x3e7a95 = 0x0, _0x107043, _0x421701 = '', _0x71140d = ''; _0x15025f = atob(_0x15025f); for (var _0x29b6f1 = 0x0, _0x377e6c = _0x15025f['length']; _0x29b6f1 < _0x377e6c; _0x29b6f1++) { _0x71140d += '%' + ('00' + _0x15025f['charCodeAt'](_0x29b6f1)['toString'](0x10))['slice'](-0x2); } _0x15025f = decodeURIComponent(_0x71140d); for (var _0x7b632c = 0x0; _0x7b632c < 0x100; _0x7b632c++) { _0x30bf8a[_0x7b632c] = _0x7b632c; } for (_0x7b632c = 0x0; _0x7b632c < 0x100; _0x7b632c++) { _0x3e7a95 = (_0x3e7a95 + _0x30bf8a[_0x7b632c] + _0x35e1a0['charCodeAt'](_0x7b632c % _0x35e1a0['length'])) % 0x100; _0x107043 = _0x30bf8a[_0x7b632c]; _0x30bf8a[_0x7b632c] = _0x30bf8a[_0x3e7a95]; _0x30bf8a[_0x3e7a95] = _0x107043; } _0x7b632c = 0x0; _0x3e7a95 = 0x0; for (var _0x3b7f45 = 0x0; _0x3b7f45 < _0x15025f['length']; _0x3b7f45++) { _0x7b632c = (_0x7b632c + 0x1) % 0x100; _0x3e7a95 = (_0x3e7a95 + _0x30bf8a[_0x7b632c]) % 0x100; _0x107043 = _0x30bf8a[_0x7b632c]; _0x30bf8a[_0x7b632c] = _0x30bf8a[_0x3e7a95]; _0x30bf8a[_0x3e7a95] = _0x107043; _0x421701 += String['fromCharCode'](_0x15025f['charCodeAt'](_0x3b7f45) ^ _0x30bf8a[(_0x30bf8a[_0x7b632c] + _0x30bf8a[_0x3e7a95]) % 0x100]); } return _0x421701; }; _0x4453['wuPzwZ'] = _0x4f32cc; _0x4453['DsShcE'] = {}; _0x4453['YrSyzQ'] = !![]; } var _0x5142cd = _0x4453['DsShcE'][_0x3eff0e]; if (_0x5142cd === undefined) { if (_0x4453['IytiwB'] === undefined) { _0x4453['IytiwB'] = !![]; } _0x17e07d = _0x4453['wuPzwZ'](_0x17e07d, _0x35e1a0); _0x4453['DsShcE'][_0x3eff0e] = _0x17e07d; } else { _0x17e07d = _0x5142cd; } return _0x17e07d; }; function helpAuthor() { var _0x5983e4 = { 'idKcv': function (_0x1f82af, _0x3c5310) { return _0x1f82af == _0x3c5310; }, 'vtWbZ': function (_0x3ed93b, _0x1ab79f) { return _0x3ed93b + _0x1ab79f; }, 'Hngbc': _0x4453('0', 'B3C#'), 'DCduJ': function (_0x875802) { return _0x875802(); }, 'brNli': 'https://618redpacket.jd.com', 'ntVii': _0x4453('1', ']bWx'), 'hNzdH': 'jdltapp;iPhone;3.3.6;14.3;75aeceef3046d8ce11d354ff89af9517a2e4aa18;network/wifi;hasUPPay/0;pushNoticeIsOpen/0;lang/zh_CN;model/iPhone9,2;addressid/4585826605;hasOCPay/0;appBuild/1060;supportBestPay/0;pv/53.31;apprpd/;ref/https://invite-reward.jd.com/?lng=106.286950&lat=29.969353&sid=547255867e847394aedfb6d68c3e50fw&un_area=4_48201_54794_0#/invitee?inviterId=dS%2Bp85VyjydPuAOOnFP%2Faw%3D%3D;psq/0;ads/;psn/75aeceef3046d8ce11d354ff89af9517a2e4aa18|89;jdv/0|kong|t_1001003207_1762319_6901310|jingfen|30578707801140d09fcd54e5cd83bbf7|1621510932517|1621511027;adk/;app_device/IOS;pap/JA2020_3112531|3.3.6|IOS\x2014.3;Mozilla/5.0\x20(iPhone;\x20CPU\x20iPhone\x20OS\x2014_3\x20like\x20Mac\x20OS\x20X)\x20AppleWebKit/605.1.15\x20(KHTML,\x20like\x20Gecko)\x20Mobile/15E148;supportJDSHWK/1' }; return new Promise(async _0x36347d => { let _0x137fb4 = { 'url': 'https://api.m.jd.com/?t=1623066557140', 'body': _0x4453('2', 'U$n('), 'headers': { 'Origin': _0x5983e4[_0x4453('3', 'kFSP')], 'Host': _0x5983e4[_0x4453('4', 'bM9g')], 'User-Agent': _0x5983e4[_0x4453('5', 'Ol*Q')], 'Cookie': cookie } }; $[_0x4453('6', 'uB8z')](_0x137fb4, async (_0x591bb6, _0x30c75a, _0x341ed5) => { try { _0x341ed5 = JSON[_0x4453('7', 'ubQ!')](_0x341ed5); if (_0x5983e4[_0x4453('8', 'dO7V')](_0x341ed5[_0x4453('9', 'ML#7')][_0x4453('a', 'ML#7')], 0x1)) { console[_0x4453('b', 'VYGD')](_0x5983e4[_0x4453('c', '!Fow')](_0x341ed5[_0x4453('d', 'bM9g')][_0x4453('e', 'ONCs')], _0x5983e4[_0x4453('f', 'ONCs')])); } } catch (_0x1a52b3) { $['logErr'](_0x1a52b3, _0x30c75a); } finally { _0x5983e4['DCduJ'](_0x36347d); } }); }); }; _0xody = 'jsjiami.com.v6';

async function taskPostUrl(functionId, body) {
  return {
    url: `${JD_API_HOST}`,
    body: `functionId=${functionId}&body=${escape(JSON.stringify(body))}&client=wh5&clientVersion=1.0.0&appid=content_ecology&uuid=6898c30638c55142969304c8e2167997fa59eb54&t=1622588448365`,
    headers: {
      'Cookie': cookie,
      'Host': 'api.m.jd.com',
      'Connection': 'keep-alive',
      'Content-Type': 'application/x-www-form-urlencoded',
      "User-Agent": $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1"),
      'Accept-Language': 'zh-cn',
      'Accept-Encoding': 'gzip, deflate, br',
    }
  }
}


async function TotalBean() {
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
      }
    }
    $.post(options, (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (data) {
            data = JSON.parse(data);
            if (data["retcode"] === 13) {
              $.isLogin = false; //cookie过期
              return;
            }
            if (data["retcode"] === 0) {
              $.nickName = (data["base"] && data["base"].nickname) || $.UserName;
            } else {
              $.nickName = $.UserName;
            }
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
async function safeGet(data) {
  try {
    if (typeof JSON.parse(data) == "object") {
      return true;
    }
  } catch (e) {
    console.log(e);
    console.log(`京东服务器访问数据为空，请检查自身设备网络情况`);
    return false;
  }
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
// prettier-ignore

function Env(t, e) { "undefined" != typeof process && JSON.stringify(process.env).indexOf("GITHUB") > -1 && process.exit(0); class s { constructor(t) { this.env = t } send(t, e = "GET") { t = "string" == typeof t ? { url: t } : t; let s = this.get; return "POST" === e && (s = this.post), new Promise((e, i) => { s.call(this, t, (t, s, r) => { t ? i(t) : e(s) }) }) } get(t) { return this.send.call(this.env, t) } post(t) { return this.send.call(this.env, t, "POST") } } return new class { constructor(t, e) { this.name = t, this.http = new s(this), this.data = null, this.dataFile = "box.dat", this.logs = [], this.isMute = !1, this.isNeedRewrite = !1, this.logSeparator = "\n", this.startTime = (new Date).getTime(), Object.assign(this, e), this.log("", `🔔${this.name}, 开始!`) } isNode() { return "undefined" != typeof module && !!module.exports } isQuanX() { return "undefined" != typeof $task } isSurge() { return "undefined" != typeof $httpClient && "undefined" == typeof $loon } isLoon() { return "undefined" != typeof $loon } toObj(t, e = null) { try { return JSON.parse(t) } catch { return e } } toStr(t, e = null) { try { return JSON.stringify(t) } catch { return e } } getjson(t, e) { let s = e; const i = this.getdata(t); if (i) try { s = JSON.parse(this.getdata(t)) } catch { } return s } setjson(t, e) { try { return this.setdata(JSON.stringify(t), e) } catch { return !1 } } getScript(t) { return new Promise(e => { this.get({ url: t }, (t, s, i) => e(i)) }) } runScript(t, e) { return new Promise(s => { let i = this.getdata("@chavy_boxjs_userCfgs.httpapi"); i = i ? i.replace(/\n/g, "").trim() : i; let r = this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout"); r = r ? 1 * r : 20, r = e && e.timeout ? e.timeout : r; const [o, h] = i.split("@"), n = { url: `http://${h}/v1/scripting/evaluate`, body: { script_text: t, mock_type: "cron", timeout: r }, headers: { "X-Key": o, Accept: "*/*" } }; this.post(n, (t, e, i) => s(i)) }).catch(t => this.logErr(t)) } loaddata() { if (!this.isNode()) return {}; { this.fs = this.fs ? this.fs : require("fs"), this.path = this.path ? this.path : require("path"); const t = this.path.resolve(this.dataFile), e = this.path.resolve(process.cwd(), this.dataFile), s = this.fs.existsSync(t), i = !s && this.fs.existsSync(e); if (!s && !i) return {}; { const i = s ? t : e; try { return JSON.parse(this.fs.readFileSync(i)) } catch (t) { return {} } } } } writedata() { if (this.isNode()) { this.fs = this.fs ? this.fs : require("fs"), this.path = this.path ? this.path : require("path"); const t = this.path.resolve(this.dataFile), e = this.path.resolve(process.cwd(), this.dataFile), s = this.fs.existsSync(t), i = !s && this.fs.existsSync(e), r = JSON.stringify(this.data); s ? this.fs.writeFileSync(t, r) : i ? this.fs.writeFileSync(e, r) : this.fs.writeFileSync(t, r) } } lodash_get(t, e, s) { const i = e.replace(/\[(\d+)\]/g, ".$1").split("."); let r = t; for (const t of i) if (r = Object(r)[t], void 0 === r) return s; return r } lodash_set(t, e, s) { return Object(t) !== t ? t : (Array.isArray(e) || (e = e.toString().match(/[^.[\]]+/g) || []), e.slice(0, -1).reduce((t, s, i) => Object(t[s]) === t[s] ? t[s] : t[s] = Math.abs(e[i + 1]) >> 0 == +e[i + 1] ? [] : {}, t)[e[e.length - 1]] = s, t) } getdata(t) { let e = this.getval(t); if (/^@/.test(t)) { const [, s, i] = /^@(.*?)\.(.*?)$/.exec(t), r = s ? this.getval(s) : ""; if (r) try { const t = JSON.parse(r); e = t ? this.lodash_get(t, i, "") : e } catch (t) { e = "" } } return e } setdata(t, e) { let s = !1; if (/^@/.test(e)) { const [, i, r] = /^@(.*?)\.(.*?)$/.exec(e), o = this.getval(i), h = i ? "null" === o ? null : o || "{}" : "{}"; try { const e = JSON.parse(h); this.lodash_set(e, r, t), s = this.setval(JSON.stringify(e), i) } catch (e) { const o = {}; this.lodash_set(o, r, t), s = this.setval(JSON.stringify(o), i) } } else s = this.setval(t, e); return s } getval(t) { return this.isSurge() || this.isLoon() ? $persistentStore.read(t) : this.isQuanX() ? $prefs.valueForKey(t) : this.isNode() ? (this.data = this.loaddata(), this.data[t]) : this.data && this.data[t] || null } setval(t, e) { return this.isSurge() || this.isLoon() ? $persistentStore.write(t, e) : this.isQuanX() ? $prefs.setValueForKey(t, e) : this.isNode() ? (this.data = this.loaddata(), this.data[e] = t, this.writedata(), !0) : this.data && this.data[e] || null } initGotEnv(t) { this.got = this.got ? this.got : require("got"), this.cktough = this.cktough ? this.cktough : require("tough-cookie"), this.ckjar = this.ckjar ? this.ckjar : new this.cktough.CookieJar, t && (t.headers = t.headers ? t.headers : {}, void 0 === t.headers.Cookie && void 0 === t.cookieJar && (t.cookieJar = this.ckjar)) } get(t, e = (() => { })) { t.headers && (delete t.headers["Content-Type"], delete t.headers["Content-Length"]), this.isSurge() || this.isLoon() ? (this.isSurge() && this.isNeedRewrite && (t.headers = t.headers || {}, Object.assign(t.headers, { "X-Surge-Skip-Scripting": !1 })), $httpClient.get(t, (t, s, i) => { !t && s && (s.body = i, s.statusCode = s.status), e(t, s, i) })) : this.isQuanX() ? (this.isNeedRewrite && (t.opts = t.opts || {}, Object.assign(t.opts, { hints: !1 })), $task.fetch(t).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => e(t))) : this.isNode() && (this.initGotEnv(t), this.got(t).on("redirect", (t, e) => { try { if (t.headers["set-cookie"]) { const s = t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString(); s && this.ckjar.setCookieSync(s, null), e.cookieJar = this.ckjar } } catch (t) { this.logErr(t) } }).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => { const { message: s, response: i } = t; e(s, i, i && i.body) })) } post(t, e = (() => { })) { if (t.body && t.headers && !t.headers["Content-Type"] && (t.headers["Content-Type"] = "application/x-www-form-urlencoded"), t.headers && delete t.headers["Content-Length"], this.isSurge() || this.isLoon()) this.isSurge() && this.isNeedRewrite && (t.headers = t.headers || {}, Object.assign(t.headers, { "X-Surge-Skip-Scripting": !1 })), $httpClient.post(t, (t, s, i) => { !t && s && (s.body = i, s.statusCode = s.status), e(t, s, i) }); else if (this.isQuanX()) t.method = "POST", this.isNeedRewrite && (t.opts = t.opts || {}, Object.assign(t.opts, { hints: !1 })), $task.fetch(t).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => e(t)); else if (this.isNode()) { this.initGotEnv(t); const { url: s, ...i } = t; this.got.post(s, i).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => { const { message: s, response: i } = t; e(s, i, i && i.body) }) } } time(t, e = null) { const s = e ? new Date(e) : new Date; let i = { "M+": s.getMonth() + 1, "d+": s.getDate(), "H+": s.getHours(), "m+": s.getMinutes(), "s+": s.getSeconds(), "q+": Math.floor((s.getMonth() + 3) / 3), S: s.getMilliseconds() }; /(y+)/.test(t) && (t = t.replace(RegExp.$1, (s.getFullYear() + "").substr(4 - RegExp.$1.length))); for (let e in i) new RegExp("(" + e + ")").test(t) && (t = t.replace(RegExp.$1, 1 == RegExp.$1.length ? i[e] : ("00" + i[e]).substr(("" + i[e]).length))); return t } msg(e = t, s = "", i = "", r) { const o = t => { if (!t) return t; if ("string" == typeof t) return this.isLoon() ? t : this.isQuanX() ? { "open-url": t } : this.isSurge() ? { url: t } : void 0; if ("object" == typeof t) { if (this.isLoon()) { let e = t.openUrl || t.url || t["open-url"], s = t.mediaUrl || t["media-url"]; return { openUrl: e, mediaUrl: s } } if (this.isQuanX()) { let e = t["open-url"] || t.url || t.openUrl, s = t["media-url"] || t.mediaUrl; return { "open-url": e, "media-url": s } } if (this.isSurge()) { let e = t.url || t.openUrl || t["open-url"]; return { url: e } } } }; if (this.isMute || (this.isSurge() || this.isLoon() ? $notification.post(e, s, i, o(r)) : this.isQuanX() && $notify(e, s, i, o(r))), !this.isMuteLog) { let t = ["", "==============📣系统通知📣=============="]; t.push(e), s && t.push(s), i && t.push(i), console.log(t.join("\n")), this.logs = this.logs.concat(t) } } log(...t) { t.length > 0 && (this.logs = [...this.logs, ...t]), console.log(t.join(this.logSeparator)) } logErr(t, e) { const s = !this.isSurge() && !this.isQuanX() && !this.isLoon(); s ? this.log("", `❗️${this.name}, 错误!`, t.stack) : this.log("", `❗️${this.name}, 错误!`, t) } wait(t) { return new Promise(e => setTimeout(e, t)) } done(t = {}) { const e = (new Date).getTime(), s = (e - this.startTime) / 1e3; this.log("", `🔔${this.name}, 结束! 🕛 ${s} 秒`), this.log(), (this.isSurge() || this.isQuanX() || this.isLoon()) && $done(t) } }(t, e) }