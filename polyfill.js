(function () {
    "use strict";

    var DOMParser, doc, proto, parseFromStringByNative;

    /**
     * DOMParser
     * @type {Window.DOMParser|*}
     */
    DOMParser = window.DOMParser;
    /**
     * file
     * @type {HTMLDocument}
     */
    doc = document;

    if (DOMParser) {
        /**
         * proto
         * @type {Window.DOMParser|*}
         */
        proto = DOMParser.prototype;
        /**
         * parseFromStringByNative
         * @type {DOMParser.parseFromString|*}
         */
        parseFromStringByNative = proto.parseFromString;

        try {
            (new DOMParser()).parseFromString("", "text/html");
        } catch (e) {
            /**
             * parseFromString(text/html)를 지원하지 않는 브라우져에 대한 Polyfill
             * @param markup
             * @param type
             * @returns {*}
             */
            proto.parseFromString = function (markup, type) {
                var htmlDoc;
                if (/^\s*text\/html\s*(?:;|$)/i.test(type)) {
                    //noinspection JSUnresolvedFunction
                    htmlDoc = doc.implementation.createHTMLDocument("");

                    if (markup.toLowerCase().indexOf('<!doctype') > -1) {
                        htmlDoc.documentElement.innerHTML = markup;
                    } else {
                        htmlDoc.body.innerHTML = markup;
                    }
                    return htmlDoc;
                }

                return parseFromStringByNative.apply(this, arguments);
            };
        }
    } else {
        /**
         * ie8 이하 버전을 위한 DOMParser
         * @constructor
         */
        window.DOMParser = function () {
            /**
             * parseFromString
             * @param markup
             * @param type
             * @returns {{body: Element}|*}
             */
            DOMParser.prototype.parseFromString = function (markup, type) {
                var body, docFrag, parsingObject;

                if (/^\s*text\/html\s*(?:;|$)/i.test(type)) {
                    /**
                     * docFrag
                     * @type {DocumentFragment}
                     */
                    docFrag = doc.createDocumentFragment();
                    /**
                     * body
                     * @type {Element}
                     */
                    body = docFrag.createElement("body");
                    body.innerHTML = markup;
                    parsingObject = {
                        body: body
                    };

                    return parsingObject;
                }

                throw new TypeError("Failed to execute 'parseFromString' on 'DOMParser': The provided value '" + type + "' is not a valid enum value of type SupportedType.");
            };
        };
    }
}());