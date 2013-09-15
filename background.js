/**
 * Holds the state of debug mode. True means we should debug the page.
 */
var JS_DEBUG_TIMESTAMP = "js_debug_timestamp";
var JS_DEBUG_FLAG = "js_debug_flag";
var JS_DEBUG_RULES = "js_debug_rules";

var timestamp;
var debug = false;

// Holds the rules (the mapping of source/destination).
var rules = [];
var requestFilter = {
    urls: [
        "http://*/*", "https://*/*"
    ]
};

//http://www.google-analytics.com/ga.js
//https://ssl.gstatic.com/gb/js/smm_a326b17e3242115785460b9666dd0014.js
chrome.webRequest.onBeforeRequest.addListener(function (details) {
    if (timestamp !== localStorage[JS_DEBUG_TIMESTAMP]) {
        timestamp = localStorage[JS_DEBUG_TIMESTAMP];
        debug = localStorage[JS_DEBUG_FLAG];
        rules = JSON.parse(localStorage[JS_DEBUG_RULES]);
    }
    if (debug) {
        var u = details.url;

        rules.forEach(function (rule) {
            if (u.indexOf(rule.source) == 0) {
                return {redirectUrl: rule.destination};
            }
        });
    }
}, requestFilter, ['blocking']);
