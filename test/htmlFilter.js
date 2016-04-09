QUnit.module("HTMLFilter", {});

QUnit.moduleStart(function () {
	"use strict";

	window.roles =
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
					dynsrc: [/\.(mpg|mpeg|mpe|wmv|asf|asx|flv|rm|mov|dat)$/i]
				}
			},
			styleValues: {
				DEFAULT: {
					position: ["static"]
				}
			},
			onFilterByTagNames: function (detectedElementsByFilter) {
				var index, max = detectedElementsByFilter.length, element;

				for (index = 0; index < max; index++) {
					element = detectedElementsByFilter[index];
					element.parentNode && element.parentNode.removeChild(element);
				}
			},
			onFilterByAttributeNames: function (detectedElementsByFilter) {
				var index, max = detectedElementsByFilter.length, element, attribute;

				for (index = 0; index < max; index++) {
					element = detectedElementsByFilter[index][0];
					attribute = detectedElementsByFilter[index][1];

					element.removeAttributeNode(attribute);
				}
			},
			onFilterByAttributeValues: function (detectedElementsByFilter) {
				var index, max = detectedElementsByFilter.length, element, attribute;

				for (index = 0; index < max; index++) {
					element = detectedElementsByFilter[index][0];
					attribute = detectedElementsByFilter[index][1];

					if (attribute.name === "src") {
						element.parentNode && element.parentNode.removeChild(element);
					} else {
						element.removeAttributeNode(attribute);
					}
				}
			},
			onFilterByStyleValues: function (detectedElementsByFilter) {
				var index, max = detectedElementsByFilter.length, element, styleNames;

				for (index = 0; index < max; index++) {
					element = detectedElementsByFilter[index][0];
					styleNames = detectedElementsByFilter[index][1];

					if (styleNames === "position") {
						element.style[styleNames] = "static";
					}
				}
			}
		},
		blackList: {
			mapToRemoveChild: {
				SCRIPT: true,
				STYLE: true,
				META: true,
				TITLE: true,
				PARAM: true
			},
			//IE7이하에 종속적인 옵션으로 true일 경우에 css expression 표현식을 사용하지 못하게 제거한다.
			disuseExpression: true,
			tagNames: ["BODY", "EMBED", "FRAME", "SCRIPT", "LINK", "IFRAME", "OBJECT", "STYLE", "FRAMESET", "META", "TITLE", "BASE", "HEAD", "HTML", "MATH", "SVG", "PARAM"],
			attributeNames: {
				DEFAULT: [/^(on)\S/, "seeksegmenttime", "fscommand", "formaction"]
			},
			styleValues: {
				DEFAULT: {
					position: ["fixed", "absolute"]
				}
			},
			protocolNames: {
				IMG: ["javascript:"],
				A: ["javascript:"]
			},
			onFilterByTagNames: function (detectedElements) {
				var index = detectedElements.length, element, tagName, $replacementsForEmbed, isReplaceTarget;

				while (index--) {
					element = detectedElements[index];
					tagName = element.tagName;

					if (element.parentNode) {
						if (navigator.appName === "Microsoft Internet Explorer" && parseFloat(/MSIE ([0-9]{1,}[\.0-9]{0,})/.exec(navigator.appVersion)[1]) < 9) {
							isReplaceTarget = tagName === "EMBED" || tagName === "OBJECT";
						} else {
							isReplaceTarget = tagName === "EMBED";
						}

						if (isReplaceTarget) {
							$replacementsForEmbed = $("<div class='replacements_for_embed'>해당 콘텐츠는 컴퓨터에 보안상 위험을 가져올 수 있습니다.<br>보낸이 확인하신 후에 표시 여부를 판단하시기 바랍니다.<br><button>표시하기</button></div>");

							$("button", $replacementsForEmbed).on("click", element, function (e) {
								$(this).parent().replaceWith(e.data);
							});

							element.swapNode ? element.swapNode($replacementsForEmbed[0]) : $(element).replaceWith($replacementsForEmbed);
						} else {
							this.mapToRemoveChild[tagName] ? element.parentNode.removeChild(element) : element.childNodes.length ? $(element.childNodes[0]).unwrap() : element.parentNode && element.parentNode.removeChild(element);
						}
					}
				}
			},
			onFilterByAttributeNames: function (detectedElementsByFilter) {
				var index = detectedElementsByFilter.length, element, attribute;

				while (index--) {
					element = detectedElementsByFilter[index][0];
					attribute = detectedElementsByFilter[index][1];

					element.removeAttributeNode(attribute);
				}
			},
			onFilterByStyleValues: function (detectedElements) {
				var index = detectedElements.length, element, styleNames;

				while (index--) {
					element = detectedElements[index][0];
					styleNames = detectedElements[index][1];

					if (styleNames === "position") {
						element.style[styleNames] = "static";
					} else {
						element.style[styleNames] = "";
					}
				}
			},
			onFilterByProtocolNames: function (detectedElementsByFilter) {
				var index = detectedElementsByFilter.length, element;

				while (index--) {
					element = detectedElementsByFilter[index][0];
					element.protocol = "http:";
				}
			},
			onError: function (e, text) {
				return text;
			}
		}
	};

});


QUnit.test("filter blackList", function () {
	"use strict";

	var htmlFilter = (new HTMLFilter(roles.blackList));
	var actual, expected, text;

	text = '<div onLoad="alert();" onAbort="alert();" onActivate="alert();" onAfterPrint="alert();" onAfterUpdate="alert();" onBeforeActivate="alert();" onUndo="alert();" seekSegmentTime="alert();" FSCommand="alert();" formaction="alert();">test</div>';
	actual = htmlFilter.filter(text, false, false);
	expected = '<div>test</div>';
	ok(actual === expected);

	text = '<script>alert()</script>';
	actual = htmlFilter.filter(text, false, false);
	expected = '';
	ok(actual === expected);

	text = '<div style="position: fixed">test</div>';
	actual = htmlFilter.filter(text, false, false);
	expected = '<div style="position: static;">test</div>';
	ok(actual === expected);

	text = '<img src="javascript">';
	actual = htmlFilter.filter(text, false, false);
	expected = '<img src="javascript">';
	ok(actual === expected);

	text = "<object type='application/x-shockwave-flash' id='DaumVodPlayer_v60ebX22ii8KKmtyKIIAtIy' width='640px' height='360px' align='middle' classid='clsid:d27cdb6e-ae6d-11cf-96b8-444553540000' codebase='http://fpdownload.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=10,3,0,0'><param name='movie' value='http://videofarm.daum.net/controller/player/VodPlayer.swf' /><param name='allowScriptAccess' value='always' /><param name='allowFullScreen' value='true' /><param name='bgcolor' value='#000000' /><param name='wmode' value='window' /><param name='flashvars' value='vid=v60ebX22ii8KKmtyKIIAtIy&playLoc=undefined&alert=true' /><embed src='http://videofarm.daum.net/controller/player/VodPlayer.swf' width='640px' height='360px' allowScriptAccess='always' type='application/x-shockwave-flash' allowFullScreen='true' bgcolor='#000000' flashvars='vid=v60ebX22ii8KKmtyKIIAtIy&playLoc=undefined&alert=true'></embed></object><br>";
	actual = htmlFilter.filter(text, false, false);
	expected = "<object type='application/x-shockwave-flash' id='DaumVodPlayer_v60ebX22ii8KKmtyKIIAtIy' width='640px' height='360px' align='middle' classid='clsid:d27cdb6e-ae6d-11cf-96b8-444553540000' codebase='http://fpdownload.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=10,3,0,0'><param name='movie' value='http://videofarm.daum.net/controller/player/VodPlayer.swf' /><param name='allowScriptAccess' value='always' /><param name='allowFullScreen' value='true' /><param name='bgcolor' value='#000000' /><param name='wmode' value='window' /><param name='flashvars' value='vid=v60ebX22ii8KKmtyKIIAtIy&playLoc=undefined&alert=true' /><embed src='http://videofarm.daum.net/controller/player/VodPlayer.swf' width='640px' height='360px' allowScriptAccess='always' type='application/x-shockwave-flash' allowFullScreen='true' bgcolor='#000000' flashvars='vid=v60ebX22ii8KKmtyKIIAtIy&playLoc=undefined&alert=true'></embed></object><br>";
	ok(actual === expected);
});

QUnit.test("filter whiteList", function () {
	"use strict";

	var htmlFilter = (new HTMLFilter(roles.whiteList));
	var actual, expected, text;

	text = '<div onLoad="alert();" onAbort="alert();" onActivate="alert();" onAfterPrint="alert();" onAfterUpdate="alert();" onBeforeActivate="alert();" onUndo="alert();" seekSegmentTime="alert();" FSCommand="alert();" formaction="alert();">test</div>';
	actual = htmlFilter.filter(text, false, false);
	expected = '<div>test</div>';
	ok(actual === expected);

	text = '<script>alert()</script>';
	actual = htmlFilter.filter(text, false, false);
	expected = '';
	ok(actual === expected);

	text = '<div style="position: fixed">test</div>';
	actual = htmlFilter.filter(text, false, false);
	expected = '<div style="position: static;">test</div>';
	ok(actual === expected);
});