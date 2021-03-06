/**
 * @fileoverview Template to compose HTTP reqeuest.
脚本定时执行ac
url改为自己的url
抓取url：https://github.com/kookpua/JavaScript/actions/manual
Referer 用自己的
request body 需要url解码
解码地址：http://web.chacuo.net/charseturlencode/
 
第一批QQ号

 */

const url = `https://github.com/mandxy/qqread/actions/manual`;
const method = `GET`;
const headers = {
Host: 'github.com',
'Content-Type': 'application/x-www-form-urlencoded',
Origin: 'https://github.com',
'Accept-Encoding': 'gzip, deflate, br',
Cookie: '__Host-user_session_same_site=UjKr0TPOL38kai8A1TF7wULXPEn_x5QXTRdJslKxfmWsJFx5; _gh_sess=GbCMwOckNdOdBoIaifB32vel3%2BecCZWnTwWi6zVmm4jEqGcZvrsPVvFHDiMA04mb9iML97KI%2FyTrUGe7ABlz2yVrapUgdLsyR4A5RgO05fTgudRjpTsVn%2FK93cZZmJ68Fb7EIqYY5sgCf1i9%2FO68RBcr1MFBdWp4kpqLMNPNuQr%2BgZMHowQKtcxg5dKEER9i--VqtAjmgR8V9Etk8q--%2FXzzsATy%2Bj78B0IuOdd2QA%3D%3D; has_recent_activity=1; user_session=UjKr0TPOL38kai8A1TF7wULXPEn_x5QXTRdJslKxfmWsJFx5; tz=Asia%2FShanghai; dotcom_user=mandxy; logged_in=yes; _device_id=c2536a6b9f5e4c120aca200ba4577705; _octo=GH1.1.854706457.1606381517',
Connection: 'keep-alive',
Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
'User-Agent':' Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36',
Referer: 'https://github.com/mandxy/qqread/actions?query=workflow%3A%E4%BC%81%E9%B9%85%E8%AF%BB%E4%B9%A6',
'Content-Length': '188',
'Accept-Language': 'zh-cn'
};

const body = `authenticity_token=yWuhyxWqlJI9lbvDIhPuIQQe2TKx+lYvqu22dTI1Wkwag5dH+dJ53snmTFfTUcU8hk/wnaHENO3+sD8t5flprQ==&workflow=.github/workflows/qqread.yml&branch=refs/heads/main`;

const myRequest = {

    url: url,

    method: method,

    headers: headers,

    body: body

};



const $ = new API("qqac2");



$.http.post(myRequest).then(response=>

{

   console.log('企鹅阅读运行了');

console.log('状态码：'+response.statusCode);

$notification.post('github','', `企鹅阅读运行了`);

$notification.post('github','','企鹅阅阅读状态码：'+response.statusCode+'')

})





function ENV() {

  const isQX = typeof $task !== "undefined";

  const isLoon = typeof $loon !== "undefined";

  const isSurge = typeof $httpClient !== "undefined" && !isLoon;

  const isJSBox = typeof require == "function" && typeof $jsbox != "undefined";

  const isNode = typeof require == "function" && !isJSBox;

  const isRequest = typeof $request !== "undefined";

  const isScriptable = typeof importModule !== "undefined";

  return { isQX, isLoon, isSurge, isNode, isJSBox, isRequest, isScriptable };

}



function HTTP(defaultOptions = { baseURL: "" }) {

  const { isQX, isLoon, isSurge, isScriptable, isNode } = ENV();

  const methods = ["GET", "POST", "PUT", "DELETE", "HEAD", "OPTIONS", "PATCH"];

  const URL_REGEX = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;



  function send(method, options) {

    options = typeof options === "string" ? { url: options } : options;

    const baseURL = defaultOptions.baseURL;

    if (baseURL && !URL_REGEX.test(options.url || "")) {

      options.url = baseURL ? baseURL + options.url : options.url;

    }

    options = { ...defaultOptions, ...options };

    const timeout = options.timeout;

    const events = {

      ...{

        onRequest: () => {},

        onResponse: (resp) => resp,

        onTimeout: () => {},

      },

      ...options.events,

    };



    events.onRequest(method, options);



    let worker;

    if (isQX) {

      worker = $task.fetch({ method, ...options });

    } else if (isLoon || isSurge || isNode) {

      worker = new Promise((resolve, reject) => {

        const request = isNode ? require("request") : $httpClient;

        request[method.toLowerCase()](options, (err, response, body) => {

          if (err) reject(err);

          else

            resolve({

              statusCode: response.status || response.statusCode,

              headers: response.headers,

              body,

            });

        });

      });

    } else if (isScriptable) {

      const request = new Request(options.url);

      request.method = method;

      request.headers = options.headers;

      request.body = options.body;

      worker = new Promise((resolve, reject) => {

        request

          .loadString()

          .then((body) => {

            resolve({

              statusCode: request.response.statusCode,

              headers: request.response.headers,

              body,

            });

          })

          .catch((err) => reject(err));

      });

    }



    let timeoutid;

    const timer = timeout

      ? new Promise((_, reject) => {

          timeoutid = setTimeout(() => {

            events.onTimeout();

            return reject(

              `${method} URL: ${options.url} exceeds the timeout ${timeout} ms`

            );

          }, timeout);

        })

      : null;



    return (timer

      ? Promise.race([timer, worker]).then((res) => {

          clearTimeout(timeoutid);

          return res;

        })

      : worker

    ).then((resp) => events.onResponse(resp));

  }



  const http = {};

  methods.forEach(

    (method) =>

      (http[method.toLowerCase()] = (options) => send(method, options))

  );

  return http;

}



function API(name = "untitled", debug = false) {

  const { isQX, isLoon, isSurge, isNode, isJSBox, isScriptable } = ENV();

  return new (class {

    constructor(name, debug) {

      this.name = name;

      this.debug = debug;



      this.http = HTTP();

      this.env = ENV();



      this.node = (() => {

        if (isNode) {

          const fs = require("fs");



          return {

            fs,

          };

        } else {

          return null;

        }

      })();

      this.initCache();



      const delay = (t, v) =>

        new Promise(function (resolve) {

          setTimeout(resolve.bind(null, v), t);

        });



      Promise.prototype.delay = function (t) {

        return this.then(function (v) {

          return delay(t, v);

        });

      };

    }



    // persistance



    // initialize cache

    initCache() {

      if (isQX) this.cache = JSON.parse($prefs.valueForKey(this.name) || "{}");

      if (isLoon || isSurge)

        this.cache = JSON.parse($persistentStore.read(this.name) || "{}");



      if (isNode) {

        // create a json for root cache

        let fpath = "root.json";

        if (!this.node.fs.existsSync(fpath)) {

          this.node.fs.writeFileSync(

            fpath,

            JSON.stringify({}),

            { flag: "wx" },

            (err) => console.log(err)

          );

        }

        this.root = {};



        // create a json file with the given name if not exists

        fpath = `${this.name}.json`;

        if (!this.node.fs.existsSync(fpath)) {

          this.node.fs.writeFileSync(

            fpath,

            JSON.stringify({}),

            { flag: "wx" },

            (err) => console.log(err)

          );

          this.cache = {};

        } else {

          this.cache = JSON.parse(

            this.node.fs.readFileSync(`${this.name}.json`)

          );

        }

      }

    }



    // store cache

    persistCache() {

      const data = JSON.stringify(this.cache);

      if (isQX) $prefs.setValueForKey(data, this.name);

      if (isLoon || isSurge) $persistentStore.write(data, this.name);

      if (isNode) {

        this.node.fs.writeFileSync(

          `${this.name}.json`,

          data,

          { flag: "w" },

          (err) => console.log(err)

        );

        this.node.fs.writeFileSync(

          "root.json",

          JSON.stringify(this.root),

          { flag: "w" },

          (err) => console.log(err)

        );

      }

    }



    write(data, key) {

      this.log(`SET ${key}`);

      if (key.indexOf("#") !== -1) {

        key = key.substr(1);

        if (isSurge || isLoon) {

          return $persistentStore.write(data, key);

        }

        if (isQX) {

          return $prefs.setValueForKey(data, key);

        }

        if (isNode) {

          this.root[key] = data;

        }

      } else {

        this.cache[key] = data;

      }

      this.persistCache();

    }



    read(key) {

      this.log(`READ ${key}`);

      if (key.indexOf("#") !== -1) {

        key = key.substr(1);

        if (isSurge || isLoon) {

          return $persistentStore.read(key);

        }

        if (isQX) {

          return $prefs.valueForKey(key);

        }

        if (isNode) {

          return this.root[key];

        }

      } else {

        return this.cache[key];

      }

    }



    delete(key) {

      this.log(`DELETE ${key}`);

      if (key.indexOf("#") !== -1) {

        key = key.substr(1);

        if (isSurge || isLoon) {

          return $persistentStore.write(null, key);

        }

        if (isQX) {

          return $prefs.removeValueForKey(key);

        }

        if (isNode) {

          delete this.root[key];

        }

      } else {

        delete this.cache[key];

      }

      this.persistCache();

    }



    // notification

    notify(title, subtitle = "", content = "", options = {}) {

      const openURL = options["open-url"];

      const mediaURL = options["media-url"];



      if (isQX) $notify(title, subtitle, content, options);

      if (isSurge) {

        $notification.post(

          title,

          subtitle,

          content + `${mediaURL ? "\n多媒体:" + mediaURL : ""}`,

          {

            url: openURL,

          }

        );

      }

      if (isLoon) {

        let opts = {};

        if (openURL) opts["openUrl"] = openURL;

        if (mediaURL) opts["mediaUrl"] = mediaURL;

        if (JSON.stringify(opts) == "{}") {

          $notification.post(title, subtitle, content);

        } else {

          $notification.post(title, subtitle, content, opts);

        }

      }

      if (isNode || isScriptable) {

        const content_ =

          content +

          (openURL ? `\n点击跳转: ${openURL}` : "") +

          (mediaURL ? `\n多媒体: ${mediaURL}` : "");

        if (isJSBox) {

          const push = require("push");

          push.schedule({

            title: title,

            body: (subtitle ? subtitle + "\n" : "") + content_,

          });

        } else {

          console.log(`${title}\n${subtitle}\n${content_}\n\n`);

        }

      }

    }



    // other helper functions

    log(msg) {

      if (this.debug) console.log(msg);

    }



    info(msg) {

      console.log(msg);

    }



    error(msg) {

      console.log("ERROR: " + msg);

    }



    wait(millisec) {

      return new Promise((resolve) => setTimeout(resolve, millisec));

    }



    done(value = {}) {

      if (isQX || isLoon || isSurge) {

        $done(value);

      } else if (isNode && !isJSBox) {

        if (typeof $context !== "undefined") {

          $context.headers = value.headers;

          $context.statusCode = value.statusCode;

          $context.body = value.body;

        }

      }

    }

  })(name, debug);

}