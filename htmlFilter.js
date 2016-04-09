/**
 * HTMLFilter
 * @param role
 * @constructor
 */
function HTMLFilter(role) {
    "use strict";

    var win, doc, autoLink, isSupportExpression, roleMap, isCheckForTagNames, isCheckForAttributeNames, isCheckForAttributeValues, isCheckForStyleNames, isCheckForStyleValues, isCheckForProtocolNames, isWhiteListForTagNames, isWhiteListForAttributeNames, isWhiteListForAttributeValues, isWhiteListForStyleNames, isWhiteListForStyleValues, isWhiteListForProtocolNames, strRoleForTagNames, strRoleForAttributeNames, strRoleForAttributeNamesForDefault, strRoleForAttributeValues, strRoleForAttributeValuesForDefault, strRoleForStyleNames, strRoleForStyleNamesForDefault, strRoleForStyleValues, strRoleForStyleValuesForDefault, strRoleForProtocolNames, strRoleForProtocolNamesForDefault, regExpRoleForTagNames, regExpRoleForAttributeNames, regExpRoleForAttributeNamesForDefault, regExpRoleForAttributeValues, regExpRoleForAttributeValuesForDefault, regExpRoleForStyleNames, regExpRoleForStyleNamesForDefault, regExpRoleForStyleValues, regExpRoleForStyleValuesForDefault, regExpRoleForProtocolNames, regExpRoleForProtocolNamesForDefault;

    /**
     * 원본 role 목록에서 string 형태와 정규식 형태를 불리하여 각각의 role에 추가한다.
     * @param {Array} strRoleObj 스트링으로 이루어진 role
     * @param {Object} regExpRoleList 정규식으로 이루어진 role
     * @param {Array} roleList 원본 role 리스트
     */
    function addRoleMap(strRoleObj, regExpRoleList, roleList) {
        var index, item;

        /**
         * index
         * @type {Number}
         */
        index = roleList.length;

        while (index--) {
            /**
             * item
             * @type {*}
             */
            item = roleList[index];
            if (typeof item === "string") {
                /**
                 * strRoleObj[item.toLowerCase()]
                 * @type {boolean}
                 */
                strRoleObj[item.toLowerCase()] = true;
            } else if (item instanceof RegExp) {
                regExpRoleList.push(item);
            }
        }
    }

    /**
     * attributeNames, styleNames 을 위한 roleMap 을 추가한다..
     * @param strRole
     * @param regExpRole
     * @param orgRole
     */
    function addRoleMapForNames(strRole, regExpRole, orgRole) {
        var tagName;

        for (tagName in orgRole) {
            if (orgRole.hasOwnProperty(tagName)) {
                /**
                 * strRole[tagName]
                 * @type {{}}
                 */
                strRole[tagName] = {};
                /**
                 * regExpRole[tagName]
                 * @type {Array}
                 */
                regExpRole[tagName] = [];

                addRoleMap(strRole[tagName], regExpRole[tagName], orgRole[tagName]);
            }
        }
    }

    /**
     * attributeValues, styleValues 를 위한 roleMap 을 추가한다.
     * @param strRole
     * @param regExpRole
     * @param orgRole
     */
    function addRoleMapForValues(strRole, regExpRole, orgRole) {
        var tagName,
            prop;

        for (tagName in orgRole) {
            if (orgRole.hasOwnProperty(tagName)) {
                /**
                 * strRole[tagName]
                 * @type {{}}
                 */
                strRole[tagName] = {};
                /**
                 * regExpRole[tagName]
                 * @type {{}}
                 */
                regExpRole[tagName] = {};

                for (prop in orgRole[tagName]) {
                    if (orgRole[tagName].hasOwnProperty(prop)) {
                        strRole[tagName][prop] = {};
                        regExpRole[tagName][prop] = [];

                        addRoleMap(strRole[tagName][prop], regExpRole[tagName][prop], orgRole[tagName][prop]);
                    }
                }
            }
        }
    }

    /**
     * roleMap 을 생성한다.
     * @returns {{strRole: {}, regExpRole: {}, isWhiteList: {tagNames: boolean, attributeNames: boolean, attributeValues: boolean, styleNames: boolean, styleValues: boolean}, isCheck: {tagNames: boolean, attributeNames: boolean, attributeValues: boolean, styleNames: boolean, styleValues: boolean}}}
     */
    function createRoleMap() {
        //noinspection JSUnresolvedVariable
        var _role, _roleMap;
        /**
         * _role
         * @type {*|{}}
         * @private
         */
        _role = role || {};
        /**
         * _roleMap
         * @type {{strRole: {}, regExpRole: {}, isCheck: {tagNames: boolean, attributeNames: boolean, attributeValues: boolean, styleNames: boolean, styleValues: boolean, protocolNames: boolean}, isWhiteList: {tagNames: boolean, attributeNames: boolean, attributeValues: boolean, styleNames: boolean, styleValues: boolean, protocolNames: boolean}}}
         * @private
         */
        _roleMap = {
            strRole: {},
            regExpRole: {},
            isCheck: {
                tagNames: !!(_role.tagNames && _role.onFilterByTagNames),
                attributeNames: !!(_role.attributeNames && _role.onFilterByAttributeNames),
                attributeValues: !!(_role.attributeValues && _role.onFilterByAttributeValues),
                styleNames: !!(_role.styleNames && _role.onFilterByStyleNames),
                styleValues: !!(_role.styleValues && _role.onFilterByStyleValues),
                protocolNames: !!(_role.protocolNames && _role.onFilterByProtocolNames)
            },
            isWhiteList: {
                tagNames: !!(_role.isWhiteList && _role.isWhiteList.tagNames),
                attributeNames: !!(_role.isWhiteList && _role.isWhiteList.attributeNames),
                attributeValues: !!(_role.isWhiteList && _role.isWhiteList.attributeValues),
                styleNames: !!(_role.isWhiteList && _role.isWhiteList.styleNames),
                styleValues: !!(_role.isWhiteList && _role.isWhiteList.styleValues),
                protocolNames: !!(_role.isWhiteList && _role.isWhiteList.protocolNames)
            }
        };

        if (_roleMap.isCheck.tagNames) {
            /**
             * _roleMap.strRole.tagNames
             * @type {{}}
             */
            _roleMap.strRole.tagNames = {};
            /**
             * _roleMap.regExpRole.tagNames
             * @type {Array}
             */
            _roleMap.regExpRole.tagNames = [];

            addRoleMap(_roleMap.strRole.tagNames, _roleMap.regExpRole.tagNames, _role.tagNames);
        }

        if (_roleMap.isCheck.attributeNames) {
            /**
             * _roleMap.strRole.attributeNames
             * @type {{}}
             */
            _roleMap.strRole.attributeNames = {};
            /**
             * _roleMap.regExpRole.attributeNames
             * @type {{}}
             */
            _roleMap.regExpRole.attributeNames = {};

            addRoleMapForNames(_roleMap.strRole.attributeNames, _roleMap.regExpRole.attributeNames, _role.attributeNames);
        }

        if (_roleMap.isCheck.attributeValues) {
            /**
             * _roleMap.strRole.attributeValues
             * @type {{}}
             */
            _roleMap.strRole.attributeValues = {};
            /**
             * _roleMap.regExpRole.attributeValues
             * @type {{}}
             */
            _roleMap.regExpRole.attributeValues = {};

            addRoleMapForValues(_roleMap.strRole.attributeValues, _roleMap.regExpRole.attributeValues, _role.attributeValues);
        }

        if (_roleMap.isCheck.styleNames) {
            /**
             * _roleMap.strRole.styleNames
             * @type {{}}
             */
            _roleMap.strRole.styleNames = {};
            /**
             * _roleMap.regExpRole.styleNames
             * @type {{}}
             */
            _roleMap.regExpRole.styleNames = {};

            addRoleMapForNames(_roleMap.strRole.styleNames, _roleMap.regExpRole.styleNames, _role.styleNames);
        }

        if (_roleMap.isCheck.styleValues) {
            /**
             * _roleMap.strRole.styleValues
             * @type {{}}
             */
            _roleMap.strRole.styleValues = {};
            /**
             * _roleMap.regExpRole.styleValues
             * @type {{}}
             */
            _roleMap.regExpRole.styleValues = {};

            addRoleMapForValues(_roleMap.strRole.styleValues, _roleMap.regExpRole.styleValues, _role.styleValues);
        }

        if (_roleMap.isCheck.protocolNames) {
            /**
             * _roleMap.strRole.protocolNames
             * @type {{}}
             */
            _roleMap.strRole.protocolNames = {};
            /**
             * _roleMap.regExpRole.protocolNames
             * @type {{}}
             */
            _roleMap.regExpRole.protocolNames = {};

            addRoleMapForNames(_roleMap.strRole.protocolNames, _roleMap.regExpRole.protocolNames, _role.protocolNames);
        }

        return _roleMap;
    }

    /**
     * 파싱을 수행하기 위한 컨테이너 객체를 생성한다.
     * @returns {HTMLElement}
     * @param text
     */
    function createElementForParsing(text) {
        return (new win.DOMParser()).parseFromString(text, "text/html").body;
    }

    /**
     * 해당 텍스트가 텍스트로 이루어진 규칙과 정규식으로 이루어진 규칙에 대해서 각각의 role 에 적용되는지를 검검한다.
     * @param strRole
     * @param regExpRole
     * @param text
     * @returns {boolean}
     */
    function check(strRole, regExpRole, text) {
        var index;

        if (strRole && strRole[text.toLowerCase()]) {
            return true;
        }

        if (regExpRole) {
            index = regExpRole.length;

            while (index--) {
                if (regExpRole[index].test(text)) {
                    return true;
                }
            }
        }

        return false;
    }


    /**
     * tagName 이 role 에 적용되는지 체크한다.
     * @param element
     * @returns {boolean}
     */
    function checkTagName(element) {
        var result;

        if (!isCheckForTagNames) {
            return false;
        }

        /**
         * result
         * @type {boolean}
         */
        result = check(strRoleForTagNames, regExpRoleForTagNames, element.tagName);

        return isWhiteListForTagNames ? !result : result;
    }

    /**
     * styleValue 가 role 에 적용되는지 점검한다.
     * @param strRoleByDefault
     * @param regExpRoleByDefault
     * @param strRoleByTagName
     * @param regExpRoleByTagName
     * @param targetText
     * @param isWhiteList
     * @returns {boolean}
     */
    function checkByRole(strRoleByDefault, regExpRoleByDefault, strRoleByTagName, regExpRoleByTagName, targetText, isWhiteList) {
        var result;

        /**
         * result
         * @type {boolean}
         */
        result = check(strRoleByDefault, regExpRoleByDefault, targetText) || check(strRoleByTagName, regExpRoleByTagName, targetText);

        return isWhiteList ? !result : result;
    }

    /**
     * attributeName 이 role 에 적용되는지 체크한다.
     * @param element
     * @param attribute
     * @returns {*}
     */
    function checkAttributeName(element, attribute) {
        if (!isCheckForAttributeNames) {
            return false;
        }

        return checkByRole(strRoleForAttributeNamesForDefault, regExpRoleForAttributeNamesForDefault, strRoleForAttributeNames[element.tagName], regExpRoleForAttributeNames[element.tagName], attribute.name, isWhiteListForAttributeNames);
    }


    /**
     * attributeValue 가 role 에 적용되는지 점검한다.
     * @param element
     * @param attribute
     * @returns {*}
     */
    function checkAttributeValue(element, attribute) {
        var tagName, attrName, strRoleByDefault, regExpRoleByDefault, strRoleByTagName, regExpRoleByTagName;

        if (!isCheckForAttributeValues) {
            return false;
        }

        /**
         * tagName
         * @type {string}
         */
        tagName = element.tagName;
        attrName = attribute.name;
        strRoleByDefault = strRoleForAttributeValuesForDefault && strRoleForAttributeValuesForDefault[attrName];
        regExpRoleByDefault = regExpRoleForAttributeValuesForDefault && regExpRoleForAttributeValuesForDefault[attrName];
        strRoleByTagName = strRoleForAttributeValues[tagName];
        regExpRoleByTagName = regExpRoleForAttributeValues[tagName];
        strRoleByTagName = strRoleByTagName && strRoleByTagName[attrName];
        regExpRoleByTagName = regExpRoleByTagName && regExpRoleByTagName[attrName];

        return checkByRole(strRoleByDefault, regExpRoleByDefault, strRoleByTagName, regExpRoleByTagName, attribute.value, isWhiteListForAttributeValues);
    }

    /**
     * Attribute 에의해 필터링된 요소를 목록에 추가한다.
     * @param element
     * @param detectedListByAttributeNames
     * @param detectedListByAttributeValues
     */
    function addDetectedListByAttribute(element, detectedListByAttributeNames, detectedListByAttributeValues) {
        var attributes, index, attribute;

        /**
         * attributes
         * @type {*|boolean|NamedNodeMap}
         */
        attributes = element.attributes;
        /**
         * index
         * @type {number}
         */
        index = attributes.length;

        while (index--) {
            /**
             * attribute
             * @type {*}
             */
            attribute = attributes[index];

            if (attribute.specified) {
                if (checkAttributeName(element, attribute)) {
                    detectedListByAttributeNames.push([element, attribute]);
                } else if (checkAttributeValue(element, attribute)) {
                    detectedListByAttributeValues.push([element, attribute]);
                }
            }
        }
    }

    /**
     * styleName 가 role 에 적용되는지 점검한다.
     * @param element
     * @param propertyName
     * @returns {*}
     */
    function checkStyleName(element, propertyName) {
        var tagName;

        if (!isCheckForStyleNames) {
            return false;
        }

        /**
         * tagName
         * @type {string}
         */
        tagName = element.tagName;

        return checkByRole(strRoleForStyleNamesForDefault, regExpRoleForStyleNamesForDefault, strRoleForStyleNames[tagName], regExpRoleForStyleNames[tagName], propertyName, isWhiteListForStyleNames);
    }

    /**
     * styleValue 가 role 에 적용되는지 점검한다.
     * @param element
     * @param propertyName
     * @returns {*}
     */
    function checkStyleValue(element, propertyName) {
        if (!isCheckForStyleValues) {
            return false;
        }

        var tagName = element.tagName,
            strRoleByDefault = strRoleForStyleValuesForDefault[propertyName],
            regExpRoleByDefault = regExpRoleForStyleValuesForDefault[propertyName],
            strRoleByTagName = strRoleForStyleValues[tagName],
            regExpRoleByTagName = regExpRoleForStyleValues[tagName];

        strRoleByTagName = strRoleByTagName && strRoleByTagName[propertyName];
        regExpRoleByTagName = regExpRoleByTagName && regExpRoleByTagName[propertyName];

        return checkByRole(strRoleByDefault, regExpRoleByDefault, strRoleByTagName, regExpRoleByTagName, element.style[propertyName], isWhiteListForStyleValues);
    }

    /**
     * ie7에서 style 속성명을 얻어온다.
     * @param stylePropertyName
     * @returns {string}
     */
    function getStyleProperty(stylePropertyName) {
        return stylePropertyName.split(":")[0].toLowerCase().replace(" ", "");
    }

    /**
     * ie7에서는 선언된 style 요소만 가져올 수 없기때문에 별도로 선언된 style 요소만 가져온다.
     * @param element
     * @returns {Array}
     */
    function getStyleByElement(element) {
        var styleProperties, index, style, property;

        /**
         * styleProperties
         * @type {Array}
         */
        styleProperties = element.style.cssText.split(";");
        /**
         * index
         * @type {Number}
         */
        index = styleProperties.length;
        /**
         * style
         * @type {Array}
         */
        style = [];

        while (index--) {
            /**
             * property
             * @type {string}
             */
            property = getStyleProperty(styleProperties[index]);

            if (property) {
                style.push(property);
            }
        }

        return style;
    }

    /**
     * CssStyle 에의해 필터링된 요소를 목록에 추가한다.
     * @param element
     * @param detectedListByStylesNames
     * @param detectedListByStylesValues
     */
    function addDetectedListByStyle(element, detectedListByStylesNames, detectedListByStylesValues) {
        var style, index, property;

        /**
         * style
         * @type {CSSStyleDeclaration|Array}
         */
        style = element.style;

        if (!style) {
            return;
        }

        /**
         * index
         * @type {number|undefined}
         */
        index = style.length;

        if (index === undefined) {
            /**
             * style
             * @type {Array}
             */
            style = getStyleByElement(element);
            /**
             * index
             * @type {Number}
             */
            index = style.length;
        }

        while (index--) {
            /**
             * property
             * @type {*}
             */
            property = style[index];

            if (isSupportExpression && role.disuseExpression) {
                //noinspection JSUnresolvedFunction
                element.style.removeExpression(property);
            }

            if (checkStyleName(element, property)) {
                detectedListByStylesNames.push([element, property]);
            } else if (checkStyleValue(element, property)) {
                detectedListByStylesValues.push([element, property]);
            }
        }
    }

    /**
     * protocolName 이 role 에 적용되는지 체크한다.
     * @param element
     * @param protocol
     * @returns {*}
     */
    function checkProtocolName(element, protocol) {
        var tagName;

        if (!isCheckForProtocolNames || !protocol) {
            return false;
        }

        /**
         * tagName
         * @type {string}
         */
        tagName = element.tagName;

        return checkByRole(strRoleForProtocolNamesForDefault, regExpRoleForProtocolNamesForDefault, strRoleForProtocolNames[tagName], regExpRoleForProtocolNames[tagName], protocol, isWhiteListForProtocolNames);
    }

    /**
     * Protocol 에의해 필터링된 요소를 목록에 추가한다.
     * @param element
     * @param detectedListByProtocolNames
     */
    function addDetectedListByProtocol(element, detectedListByProtocolNames) {
        var protocol;

        /**
         * protocol
         * @type {string}
         */
        protocol = element.protocol;

        if (checkProtocolName(element, protocol)) {
            detectedListByProtocolNames.push([element, protocol]);
        }
    }

    /**
     * win
     * @type {Window}
     */
    win = window;
    /**
     * file
     * @type {HTMLDocument}
     */
    doc = document;
    /**
     * autoLink
     * @type {AutoLink}
     */
    autoLink = win.AutoLink && new win.AutoLink();
    //noinspection JSUnresolvedVariable
    /**
     * isSupportExpression
     * @type {boolean}
     */
    isSupportExpression = !!doc.body.getExpression;
    /**
     * roleMap
     * @type {{strRole: {}, regExpRole: {}, isWhiteList: {tagNames: boolean, attributeNames: boolean, attributeValues: boolean, styleNames: boolean, styleValues: boolean}, isCheck: {tagNames: boolean, attributeNames: boolean, attributeValues: boolean, styleNames: boolean, styleValues: boolean}}}
     */
    roleMap = createRoleMap();
    /**
     * isCheckForTagNames
     * @type {boolean}
     */
    isCheckForTagNames = roleMap.isCheck.tagNames;
    /**
     * isCheckForAttributeNames
     * @type {boolean}
     */
    isCheckForAttributeNames = roleMap.isCheck.attributeNames;
    /**
     * isCheckForAttributeValues
     * @type {boolean}
     */
    isCheckForAttributeValues = roleMap.isCheck.attributeValues;
    /**
     * isCheckForStyleNames
     * @type {boolean}
     */
    isCheckForStyleNames = roleMap.isCheck.styleNames;
    /**
     * isCheckForStyleValues
     * @type {boolean}
     */
    isCheckForStyleValues = roleMap.isCheck.styleValues;
    /**
     * isCheckForProtocolNames
     * @type {boolean|roles.blackList.protocolNames|{IMG, A}|Window.roles.blackList.protocolNames|{}}
     */
    isCheckForProtocolNames = roleMap.isCheck.protocolNames;
    /**
     * isWhiteListForTagNames
     * @type {boolean}
     */
    isWhiteListForTagNames = roleMap.isWhiteList.tagNames;
    /**
     * isWhiteListForAttributeNames
     * @type {boolean}
     */
    isWhiteListForAttributeNames = roleMap.isWhiteList.attributeNames;
    /**
     * isWhiteListForAttributeValues
     * @type {boolean}
     */
    isWhiteListForAttributeValues = roleMap.isWhiteList.attributeValues;
    /**
     * isWhiteListForStyleNames
     * @type {boolean}
     */
    isWhiteListForStyleNames = roleMap.isWhiteList.styleNames;
    /**
     * isWhiteListForStyleValues
     * @type {boolean}
     */
    isWhiteListForStyleValues = roleMap.isWhiteList.styleValues;
    /**
     * isWhiteListForProtocolNames
     * @type {boolean|roles.blackList.protocolNames|{IMG, A}|Window.roles.blackList.protocolNames|{}}
     */
    isWhiteListForProtocolNames = roleMap.isWhiteList.protocolNames;
    /**
     * strRoleForTagNames
     * @type {boolean|Array|{}}
     */
    strRoleForTagNames = roleMap.strRole.tagNames;
    /**
     * strRoleForAttributeNames
     * @type {boolean|roles.blackList.attributeNames|{DEFAULT}|Window.roles.whiteList.attributeNames|{DEFAULT, A, IMG}|roles.whiteList.attributeNames|*}
     */
    strRoleForAttributeNames = roleMap.strRole.attributeNames;
    /**
     * strRoleForAttributeNamesForDefault
     * @type {boolean|roles.blackList.attributeNames|{DEFAULT}|Window.roles.whiteList.attributeNames|{DEFAULT, A, IMG}|roles.whiteList.attributeNames|*|Array}
     */
    strRoleForAttributeNamesForDefault = strRoleForAttributeNames && strRoleForAttributeNames.DEFAULT;
    /**
     * strRoleForAttributeValues
     * @type {boolean|Window.roles.whiteList.attributeValues|{IMG}|roles.whiteList.attributeValues|{}}
     */
    strRoleForAttributeValues = roleMap.strRole.attributeValues;
    /**
     * strRoleForAttributeValuesForDefault
     * @type {boolean|Window.roles.whiteList.attributeValues|{IMG}|roles.whiteList.attributeValues|{}|Array|Window.roles.blackList.styleValues.DEFAULT|{position}|roles.blackList.styleValues.DEFAULT|roles.whiteList.styleValues.DEFAULT|*}
     */
    strRoleForAttributeValuesForDefault = strRoleForAttributeValues && strRoleForAttributeValues.DEFAULT;
    /**
     * strRoleForStyleNames
     * @type {boolean|{}}
     */
    strRoleForStyleNames = roleMap.strRole.styleNames;
    /**
     * strRoleForStyleNamesForDefault
     * @type {boolean|{}|Array|Window.roles.blackList.styleValues.DEFAULT|{position}|roles.blackList.styleValues.DEFAULT|roles.whiteList.styleValues.DEFAULT|*}
     */
    strRoleForStyleNamesForDefault = strRoleForStyleNames && strRoleForStyleNames.DEFAULT;
    /**
     * strRoleForStyleValues
     * @type {boolean|Window.roles.blackList.styleValues|{DEFAULT}|roles.whiteList.styleValues|roles.blackList.styleValues|Window.roles.whiteList.styleValues|*}
     */
    strRoleForStyleValues = roleMap.strRole.styleValues;
    /**
     * strRoleForStyleValuesForDefault
     * @type {boolean|Window.roles.blackList.styleValues|{DEFAULT}|roles.whiteList.styleValues|roles.blackList.styleValues|Window.roles.whiteList.styleValues|*|Window.roles.whiteList.styleValues.DEFAULT|{position}|Window.roles.blackList.styleValues.DEFAULT|roles.whiteList.styleValues.DEFAULT|roles.blackList.styleValues.DEFAULT}
     */
    strRoleForStyleValuesForDefault = strRoleForStyleValues && strRoleForStyleValues.DEFAULT;
    /**
     * strRoleForProtocolNames
     * @type {boolean|roles.blackList.protocolNames|{IMG, A}|Window.roles.blackList.protocolNames|{}}
     */
    strRoleForProtocolNames = roleMap.strRole.protocolNames;
    /**
     * strRoleForProtocolNamesForDefault
     * @type {boolean|roles.blackList.protocolNames|{IMG, A}|Window.roles.blackList.protocolNames|{}|Array|Window.roles.blackList.styleValues.DEFAULT|{position}|roles.blackList.styleValues.DEFAULT|roles.whiteList.styleValues.DEFAULT|*}
     */
    strRoleForProtocolNamesForDefault = strRoleForProtocolNames && strRoleForProtocolNames.DEFAULT;
    /**
     * regExpRoleForTagNames
     * @type {boolean|Array|{}}
     */
    regExpRoleForTagNames = roleMap.regExpRole.tagNames;
    /**
     * regExpRoleForAttributeNames
     * @type {boolean|roles.blackList.attributeNames|{DEFAULT}|Window.roles.whiteList.attributeNames|{DEFAULT, A, IMG}|roles.whiteList.attributeNames|*}
     */
    regExpRoleForAttributeNames = roleMap.regExpRole.attributeNames;
    /**
     * regExpRoleForAttributeNamesForDefault
     * @type {boolean|roles.blackList.attributeNames|{DEFAULT}|Window.roles.whiteList.attributeNames|{DEFAULT, A, IMG}|roles.whiteList.attributeNames|*|Array}
     */
    regExpRoleForAttributeNamesForDefault = regExpRoleForAttributeNames && regExpRoleForAttributeNames.DEFAULT;
    /**
     * regExpRoleForAttributeValues
     * @type {boolean|Window.roles.whiteList.attributeValues|{IMG}|roles.whiteList.attributeValues|{}}
     */
    regExpRoleForAttributeValues = roleMap.regExpRole.attributeValues;
    /**
     * regExpRoleForAttributeValuesForDefault
     * @type {boolean|Window.roles.whiteList.attributeValues|{IMG}|roles.whiteList.attributeValues|{}|Array|Window.roles.blackList.styleValues.DEFAULT|{position}|roles.blackList.styleValues.DEFAULT|roles.whiteList.styleValues.DEFAULT|*}
     */
    regExpRoleForAttributeValuesForDefault = regExpRoleForAttributeValues && regExpRoleForAttributeValues.DEFAULT;
    /**
     * regExpRoleForStyleNames
     * @type {boolean|{}}
     */
    regExpRoleForStyleNames = roleMap.regExpRole.styleNames;
    /**
     * regExpRoleForStyleNamesForDefault
     * @type {boolean|{}|Array|Window.roles.blackList.styleValues.DEFAULT|{position}|roles.blackList.styleValues.DEFAULT|roles.whiteList.styleValues.DEFAULT|*}
     */
    regExpRoleForStyleNamesForDefault = regExpRoleForStyleNames && regExpRoleForStyleNames.DEFAULT;
    /**
     * regExpRoleForStyleValues
     * @type {boolean|Window.roles.blackList.styleValues|{DEFAULT}|roles.whiteList.styleValues|roles.blackList.styleValues|Window.roles.whiteList.styleValues|*}
     */
    regExpRoleForStyleValues = roleMap.regExpRole.styleValues;
    /**
     * regExpRoleForStyleValuesForDefault
     * @type {boolean|Window.roles.blackList.styleValues|{DEFAULT}|roles.whiteList.styleValues|roles.blackList.styleValues|Window.roles.whiteList.styleValues|*|Window.roles.whiteList.styleValues.DEFAULT|{position}|Window.roles.blackList.styleValues.DEFAULT|roles.whiteList.styleValues.DEFAULT|roles.blackList.styleValues.DEFAULT}
     */
    regExpRoleForStyleValuesForDefault = regExpRoleForStyleValues && regExpRoleForStyleValues.DEFAULT;
    /**
     * regExpRoleForProtocolNames
     * @type {boolean|roles.blackList.protocolNames|{IMG, A}|Window.roles.blackList.protocolNames|{}}
     */
    regExpRoleForProtocolNames = roleMap.regExpRole.protocolNames;
    /**
     * regExpRoleForProtocolNamesForDefault
     * @type {boolean|roles.blackList.protocolNames|{IMG, A}|Window.roles.blackList.protocolNames|{}|Array|Window.roles.blackList.styleValues.DEFAULT|{position}|roles.blackList.styleValues.DEFAULT|roles.whiteList.styleValues.DEFAULT|*}
     */
    regExpRoleForProtocolNamesForDefault = regExpRoleForProtocolNames && regExpRoleForProtocolNames.DEFAULT;

    /**
     * 전달 받은 텍스트에 대해서 필터링을 수행한다.
     * @param text
     * @param isApplyAutoLink
     * @param isReturnHTMLElement
     * @returns {*}
     */
    HTMLFilter.prototype.filter = function (text, isApplyAutoLink, isReturnHTMLElement) {
        var container, detectedListByTagNames, detectedListByAttributeNames, detectedListByAttributeValues, detectedListByStyleNames, detectedListByStyleValues, detectedListByProtocolNames, textNodes, elements, element, index;

        /**
         * detectedListByTagNames
         * @type {Array}
         */
        detectedListByTagNames = [];
        /**
         * detectedListByAttributeNames
         * @type {Array}
         */
        detectedListByAttributeNames = [];
        /**
         * detectedListByAttributeValues
         * @type {Array}
         */
        detectedListByAttributeValues = [];
        /**
         * detectedListByStyleNames
         * @type {Array}
         */
        detectedListByStyleNames = [];
        /**
         * detectedListByStyleValues
         * @type {Array}
         */
        detectedListByStyleValues = [];
        /**
         * detectedListByProtocolNames
         * @type {Array}
         */
        detectedListByProtocolNames = [];
        /**
         * textNodes
         * @type {Array}
         */
        textNodes = [];

        try {
            if (typeof text !== "string") {
                return text;
            }

            /**
             * container
             * @type {HTMLElement}
             */
            container = createElementForParsing(text);
            //noinspection JSUnresolvedFunction
            isApplyAutoLink = autoLink && isApplyAutoLink && autoLink.hasHyperlinkText(container);

            /**
             * elements
             * @type {NodeList}
             */
            elements = container.getElementsByTagName("*");
            /**
             * index
             * @type {number}
             */
            index = elements.length;

            while (index--) {
                /**
                 * element
                 * @type {*}
                 */
                element = elements[index];

                if (checkTagName(element)) {
                    detectedListByTagNames.push(element);
                } else {
                    addDetectedListByAttribute(element, detectedListByAttributeNames, detectedListByAttributeValues);
                    addDetectedListByStyle(element, detectedListByStyleNames, detectedListByStyleValues);
                    addDetectedListByProtocol(element, detectedListByProtocolNames);
                }

                if (isApplyAutoLink) {
                    //noinspection JSUnresolvedFunction
                    autoLink.addChildTextNodes(textNodes, element);
                }
            }

            if (isApplyAutoLink) {
                //noinspection JSUnresolvedFunction
                autoLink.addChildTextNodes(textNodes, container);
                //noinspection JSUnresolvedFunction
                autoLink.applyAutoLinkToTextNodes(textNodes);
            }

            if (isCheckForTagNames) {
                role.onFilterByTagNames(detectedListByTagNames);
            }

            if (isCheckForAttributeNames) {
                role.onFilterByAttributeNames(detectedListByAttributeNames);
            }

            if (isCheckForAttributeValues) {
                role.onFilterByAttributeValues(detectedListByAttributeValues);
            }

            if (isCheckForStyleNames) {
                role.onFilterByStyleNames(detectedListByStyleNames);
            }

            if (isCheckForStyleValues) {
                role.onFilterByStyleValues(detectedListByStyleValues);
            }

            if (isCheckForProtocolNames) {
                role.onFilterByProtocolNames(detectedListByProtocolNames);
            }

        } catch (e) {
            return role.onError(e, text);
        }

        return isReturnHTMLElement ? container.childNodes : container.innerHTML;
    };
}