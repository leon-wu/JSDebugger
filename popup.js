(function() {
    var JS_DEBUG_TIMESTAMP = "js_debug_timestamp";
    var JS_DEBUG_FLAG = "js_debug_flag";
    var JS_DEBUG_RULES = "js_debug_rules";

    var elem_ids = ['status', 'sourceUrl', 'destinationUrl', 'add_button', 'reset_button', 'rule_list'];
    var elems = {};

    var dom = {
        createSpan: function(sourceUrl, destinationUrl) {
            var span = document.createElement('span');
            span.innerHTML = sourceUrl;
            return span;
        }
    };

    var jsDebugger = {

        rules: function() {
            return localStorage[JS_DEBUG_RULES] ? JSON.parse(localStorage[JS_DEBUG_RULES]) : [];
        },

        init: function() {
            elems.status.innerHTML = localStorage[JS_DEBUG_FLAG] ? 'ON' : 'OFF';

            var rules = jsDebugger.rules();

            console.log("rules: %s", rules.length);

            rules.forEach(function(rule) {
                var listItem = document.createElement('li'),
                    label = dom.createSpan(rule.source, rule.destination);

                listItem.appendChild(label);
                elems.rule_list.appendChild(listItem);
                elems.rule_list.appendChild(document.createTextNode(' '));
            });
        },

        addButtonClick: function(event) {
            var rules = jsDebugger.rules();
            var sourceUrl = elems.sourceUrl.value;
            var destinationUrl = elems.destinationUrl.value;
            rules.push({source: sourceUrl, destination: destinationUrl});

            localStorage[JS_DEBUG_TIMESTAMP] = new Date().toUTCString();
            localStorage[JS_DEBUG_FLAG] = true;
            localStorage[JS_DEBUG_RULES] = JSON.stringify(rules);

            jsDebugger.init();

            chrome.webRequest.handlerBehaviorChanged();
        },

        resetButtonClick: function(event) {
            localStorage[JS_DEBUG_TIMESTAMP] = new Date().toUTCString();
            localStorage[JS_DEBUG_FLAG] = false;
            localStorage[JS_DEBUG_RULES] = JSON.stringify([]);

            jsDebugger.init();

            chrome.webRequest.handlerBehaviorChanged();
        }
    };

    document.addEventListener("DOMContentLoaded", function() {
        // Grab the DOM elements that need event handlers attached
        elem_ids.forEach(function( element_id ) {
            elems[element_id] = document.getElementById(element_id);
        });

        jsDebugger.init();

        elems.add_button.addEventListener('click', jsDebugger.addButtonClick);
        elems.reset_button.addEventListener('click', jsDebugger.resetButtonClick);
    });
})();