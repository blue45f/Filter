htmlFilter
=============

자바스크립트 XSS filter 라이브러리

# 특징
* 크로스브라우징 및 구형 IE지원(7이상 부터 테스트됨)
* 블랙리스트 방식과 화이트리스트 방식 모두 지원
*

# 사용법

## config
* javaScript:
```bash
        var roles =
        {
            whiteList: {
                isWhiteList: {
                    tagNames: true,
                    attributeNames: true,
                    attributeValues: true,
                    styleNames: true,
                    styleValues: true
                },
                tagNames: [/(H\d)$/, "BLOCKQUOTE", "P", "A", "UL", "OL", "NL", "LI", "B", "I", "STRONG", "EM", "STRIKE", "CODE", "HR", "BR", "DIV", "TABLE", "THEAD", "CAPTION", "TBODY", "TR", "TH", "TD", "PRE", "SPAN", "IMG", "FONT"],
                attributeNames: {
                    DEFAULT: ["colSpan", "rowSpan", "style"],
                    A: ["href", "name", "target"],
                    IMG: ["src"]
                },
                attributeValues: {
                    IMG: {
                        src: [/\.(bmp|gif|jpg|jpeg|png)$/i],
                        lowsrc: [/\.(bmp|gif|jpg|jpeg|png)$/i],
                        dynsrc: [/\.(bmp|gif|jpg|jpeg|png)$/i]
                    }
                },
                styleValues: {
                    DEFAULT: {
                        position: ["static"]
                    }
                },
                onFilterByTagNames: function (detectionList) {
                    var index, max = detectionList.length, element;

                    for (index = 0; index < max; index++) {
                        element = detectionList[index];
                        element.parentNode && element.parentNode.removeChild(element);
                    }
                },
                onFilterByAttributeNames: function (detectionList) {
                    var index, max = detectionList.length, element, attribute;

                    for (index = 0; index < max; index++) {
                        element = detectionList[index][0];
                        attribute = detectionList[index][1];

                        element.removeAttributeNode(attribute);
                    }
                },
                onFilterByAttributeValues: function (detectionList) {
                    var index, max = detectionList.length, element, attribute;

                    for (index = 0; index < max; index++) {
                        element = detectionList[index][0];
                        attribute = detectionList[index][1];

                        if (attribute.name === "src") {
                            element.parentNode && element.parentNode.removeChild(element);
                        } else {
                            element.removeAttributeNode(attribute);
                        }
                    }
                },
                onFilterByStyleValues: function (detectionList) {
                    var index, max = detectionList.length, element, styleNames;

                    for (index = 0; index < max; index++) {
                        element = detectionList[index][0];
                        styleNames = detectionList[index][1];

                        if (styleNames === "position") {
                            element.style[styleNames] = "static";
                        }
                    }
                }
            },
            blackList: {
                tagNames: ["BODY", "EMBED", "FRAME", "SCRIPT", "LINK", "IFRAME", "OBJECT", "STYLE", "FRAMESET", "META", "TITLE"],
                attributeNames: {
                    DEFAULT: [/^(on)\S/, /(seeksegmenttime)$/i, /(fscommand)$/i, /(formaction)$/i]
                },
                attributeValues: {
                    DEFAULT: {
                        style: [/\s*e\s*x\s*p\s*r\s*e\s*s\s*s\s*i\s*o\s*n/i]
                    },
                    IMG: {
                        src: [/\s*j\s*a\s*v\s*a\s*s\s*c\s*r\s*i\s*p\s*t/i],
                        lowsrc: [/\s*j\s*a\s*v\s*a\s*s\s*c\s*r\s*i\s*p\s*t/i],
                        dynsrc: [/\s*j\s*a\s*v\s*a\s*s\s*c\s*r\s*i\s*p\s*t/i]
                    }
                },
                styleNames: {
                    DEFAULT: []
                },
                styleValues: {
                    DEFAULT: {
                        position: ["fixed", "absolute"]
                    }
                },
                onFilterByTagNames: function (detectionList) {
                    var index, max = detectionList.length, element;

                    for (index = 0; index < max; index++) {
                        element = detectionList[index];
                        element.parentNode && element.parentNode.removeChild(element);
                    }
                },
                onFilterByAttributeNames: function (detectionList) {
                    var index, max = detectionList.length, element, attribute;

                    for (index = 0; index < max; index++) {
                        element = detectionList[index][0];
                        attribute = detectionList[index][1];

                        element.removeAttributeNode(attribute);
                    }
                },
                onFilterByAttributeValues: function (detectionList) {
                    var index, max = detectionList.length, element, attribute;

                    for (index = 0; index < max; index++) {
                        element = detectionList[index][0];
                        attribute = detectionList[index][1];

                        if (attribute.name === "src") {
                            element.parentNode && element.parentNode.removeChild(element);
                        } else {
                            element.removeAttributeNode(attribute);
                        }
                    }
                },
                onFilterByStyleNames: function (detectionList) {
                },
                onFilterByStyleValues: function (detectionList) {
                    var index, max = detectionList.length, element, styleNames;

                    for (index = 0; index < max; index++) {
                        element = detectionList[index][0];
                        styleNames = detectionList[index][1];

                        if (styleNames === "position") {
                            element.style[styleNames] = "static";
                        }
                    }
                }
            }
        };
```
filter role 정의
* String 형식과 정규표현식으로 지정 가능
* DEFAULT로 정의된 것들은 기본적으로 필터링 되는 규칙
* 검출된 태그, 속성, 스타일 등은 각각의 handler를 통해 수행할 동작을 지정
* isWhiteList : 화이트리스트 방식으로 필터링할 것이지 여부를 지정(디폴트는 블랙리스트 방식으로 수행)
* tagNames : 검출하려는 태그명
* attributeNames : 검출하려는 속성명
* attributeValues : 검출하려는 속성값
* styleNames : 검출하려는 스타일 속성명
* styleValues : 검출하려는 스타일 속성값
* onFilterByTagNames : 검출된 태그(허용되지 않는 태그)에 대한 수행 함수 정의
* onFilterByAttributeNames : 검출된 속성(허용되지 않는 속성)에 대한 수행 함수 정의
* onFilteredByAttributeValues : 검출된 속성값(허용되지 않는 속성 값)에 대한 수행 함수 정의
* onFilterByStyleNames :  검출된 스타일 속성(허용되지 않는 스타일)에 대한 수행 함수 정의
* onFilterByStyleValues :  검출된 스타일 속성(허용되지 않는 스타일)에 대한 수행 함수 정의

handler
* onFilterByTagNames: function ([태그엘리먼트])
* onFilterByAttributeNames: function ([태그엘리먼트, 속성])
* onFilteredByAttributeValues: function ([태그엘리먼트, 속성])
* onFilterByStyleNames: function ([태그엘리먼트, 스타일 속성명])
* onFilterByStyleValues: function ([태그엘리먼트, 스타일 속성명])


## Usage

javaScript:
```bash
        mint.htmlFilter = new HTMLFilter(roles.blackList);
        clearHTMLNodes = mint.htmlFilter.filter(text, isAutoLink, isReturnHTMLElement);
```

## API

new HTMLFilter(role);
* XssFilter를 사용하기 위한 인스턴스 생성한다.
* role(필터링 규칙) : 필터링을 하기 위한 룰을 정의한다.

filter(text, isAutoLink, isReturnDom);

* text(String) : xss필터링이 필요한 대상 텍스트
* isAutoLink(Boolean) : http(s), ftp, www 텍스트에 대해 자동으로 링크를 생성(ex: www.daum.net => <a href="http://www.daum.net"><span>www.daum.net</span></span>)
* isReturnHTMLElement(Boolean) : true이면 파싱이 완료된 HTMLElement를 리턴 받고, false이면 필터링된 string을 리턴받는다.

