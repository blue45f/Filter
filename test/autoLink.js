QUnit.module("AutoLink", {});

QUnit.moduleStart(function () {
    "use strict";

    window.autoLink = window.AutoLink && new AutoLink();
});

QUnit.test("hasHyperlinkText", function () {
    "use strict";

    var element = document.createElement("div");

    element.innerText = "www.daum.net";
    ok(autoLink.hasHyperlinkText(element));

    element.innerText = "http://www.daum.net";
    ok(autoLink.hasHyperlinkText(element));

    element.innerText = "https://www.daum.net";
    ok(autoLink.hasHyperlinkText(element));

    element.innerText = "ftp://www.daum.net";
    ok(autoLink.hasHyperlinkText(element));

    element.innerText = "test.daum.net";
    ok(!autoLink.hasHyperlinkText(element));
});

QUnit.test("applyAutoLinkToElement", function () {
    "use strict";

    var element = document.createElement("div");
    var actual;
    var expected;

    element.innerText = "www.daum.net";
    autoLink.applyAutoLinkToElement(element);
    actual = element.innerHTML;
    expected = '<a href="http://www.daum.net" target="_blank">www.daum.net</a>';
    ok(actual === expected);

    element.innerText = "http://www.daum.net";
    autoLink.applyAutoLinkToElement(element);
    actual = element.innerHTML;
    expected = '<a href="http://www.daum.net" target="_blank">http://www.daum.net</a>';
    ok(actual === expected);

    element.innerText = "https://www.daum.net";
    autoLink.applyAutoLinkToElement(element);
    actual = element.innerHTML;
    expected = '<a href="https://www.daum.net" target="_blank">https://www.daum.net</a>';
    ok(actual === expected);

    element.innerText = "ftp://www.daum.net";
    autoLink.applyAutoLinkToElement(element);
    actual = element.innerHTML;
    expected = '<a href="ftp://www.daum.net" target="_blank">ftp://www.daum.net</a>';
    ok(actual === expected);
});