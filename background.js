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
        "<all_urls>"
    ]
};

chrome.webRequest.onBeforeRequest.addListener(function (details) {
    if (timestamp !== localStorage[JS_DEBUG_TIMESTAMP]) {
        timestamp = localStorage[JS_DEBUG_TIMESTAMP];
        debug = localStorage[JS_DEBUG_FLAG];
        rules = JSON.parse(localStorage[JS_DEBUG_RULES]);
    }
    if (debug) {
        var u = details.url;

        var matchedRule;
        rules.forEach(function(rule) {
            if (u.indexOf(rule.source) == 0) {
                matchedRule = rule;
            }
        });

        if (typeof(matchedRule) === "object") {
            console.log('intercepted %s with %s', u, matchedRule.destination);
            return {redirectUrl: matchedRule.destination};
        }
    }
}, requestFilter, ['blocking']);
