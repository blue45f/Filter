/**
 * 특정 엘리먼트에 링크텍스트를 찾아서 Anchor 를 추가시켜서 자동 링크 기능을 제공해 준다.
 * @constructor
 */
function AutoLink() {
    "use strict";

    this.pattern = {
        http: {
            searchValue: /(\b(https?|ftp):\/\/[A-Z0-9+&@#\/%?=~_|!:,.;]*[A-Z0-9+&@#\/%=~_|])/gim,
            replaceValue: '<a href="$1" target="_blank">$1</a>'
        },
        www: {
            searchValue: /(^|[\/])(www\.[\S]+(\b|$))/gim,
            replaceValue: '$1<a href="http://$2" target="_blank">$2</a>'
        }
    };
}

/**
 * HTMLElement 내부에 링크텍스트를 찾아서 HTMLAnchorElement 를 추가해 준다.
 * @param {HTMLElement} element
 */
AutoLink.prototype.applyAutoLinkToElement = function (element) {
    "use strict";

    var nodes, textNodes, index, node;

    /**
     * nodes
     * @type {NodeList}
     */
    nodes = element.getElementsByTagName("*");
    /**
     * textNodes
     * @type {Array}
     */
    textNodes = [];
    /**
     * index
     * @type {number}
     */
    index = nodes.length;

    if (this.hasHyperlinkText(element)) {
        this.addChildTextNodes(textNodes, element);

        while (index--) {
            node = nodes[index];
            this.addChildTextNodes(textNodes, node);
        }

        this.applyAutoLinkToTextNodes(textNodes);
    }
};

/**
 *
 * @param element
 * @returns {string[]}
 */
AutoLink.prototype.hasHyperlinkText = function (element) {
    "use strict";

    var text;
    /**
     * text
     * @type {string|string|string|string|string}
     */
    text = element.innerText;

    return text.match(this.pattern.http.searchValue) || text.match(this.pattern.www.searchValue);
};

/**
 * element 의 자식노드에서 textNode 타입만 찾아서 목록에 추가해 준다.
 * @param {Array} list 추가를 해줄 배열 객체
 * @param {HTMLElement} element textNode를 검색할 element
 */
AutoLink.prototype.addChildTextNodes = function (list, element) {
    "use strict";

    if (this.isNotHTMLAnchorElement(element)) {
        this.addChildNodesByNodeType(list, element, 3);
    }
};

/**
 * HTMLAnchorElement 여부인지 확인한다.
 * @param {HTMLElement} element
 * @returns {boolean} HTMLAnchorElement 인지 여부
 */
AutoLink.prototype.isNotHTMLAnchorElement = function (element) {
    "use strict";

    return element.tagName !== "A";
};

/**
 * element의 자식노드에서 특정 타입만 찾아서 목록에 추가해 준다.
 * @param {Array} list 추가를 해줄 배열 객체
 * @param {HTMLElement} element Node 를 검색할 element
 * @param nodeType 검색할 HTMLElement 타압
 */
AutoLink.prototype.addChildNodesByNodeType = function (list, element, nodeType) {
    "use strict";

    var childNodes, index, node;

    childNodes = element.childNodes;
    index = childNodes.length;

    while (index--) {
        node = childNodes[index];

        if (node.nodeType === nodeType) {
            list.push(node);
        }
    }
};

/**
 * NodeList에 Anchor를 추가해 준다.
 * @param textNodes
 */
AutoLink.prototype.applyAutoLinkToTextNodes = function (textNodes) {
    "use strict";

    var index;
    index = textNodes.length;

    while (index--) {
        this.applyAutoLinkToTextNode(textNodes[index]);
    }
};

/**
 * Node에 HTMLAnchorElement를 추가해 준다.
 * @param textNode
 */
AutoLink.prototype.applyAutoLinkToTextNode = function (textNode) {
    "use strict";

    var text, html, temp;

    /**
     * text
     * @type {string}
     */
    text = textNode.nodeValue;
    /**
     * temp
     * @type {Element}
     */
    temp = document.createElement('span');

    if (text.match(this.pattern.http.searchValue)) {
        html = text.replace(this.pattern.http.searchValue, this.pattern.http.replaceValue);
    } else if (text.match(this.pattern.www.searchValue)) {
        html = text.replace(this.pattern.www.searchValue, this.pattern.www.replaceValue);
    }

    if (html) {
        temp.innerHTML = html;

        while (temp.firstChild) {
            textNode.parentNode.insertBefore(temp.firstChild, textNode);
        }

        textNode.parentNode.removeChild(textNode);
    }
};