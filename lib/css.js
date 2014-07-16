function buildShadowRegexes(elementName) {
    return [
        [/^:host\(([^:]+)\)$/, elementName+'$1'],
        [/^:host(:hover|:active|:focus)$/, elementName+'$1'],
        [/^:host(\[[^:]+\])$/, elementName+'$1'],
        [/^:host$/, elementName],
        [/^:ancestor\(([^:]+)\)$/, '$1 '+elementName], // deprecated; replaced by :host-context
        [/^:host-context\(([^:]+)\)$/, '$1 '+elementName],
        [/^::content/, elementName],
    ];
}

function buildReactRegexes(elementName) {
    return [
        [/^:host\(([^:]+)\)$/, 'div.'+elementName+'$1'],
        [/^:host(:hover|:active|:focus)$/, 'div.'+elementName+'$1'],
        [/^:host(\[[^:]+\])$/, 'div.'+elementName+'$1'],
        [/^:host$/, 'div.'+elementName],
        [/^:ancestor\(([^:]+)\)$/, '$1 div.'+elementName], // deprecated; replaced by :host-context
        [/^:host-context\(([^:]+)\)$/, '$1 div.'+elementName],
        [/^::content/, 'div.'+elementName],
    ];
}

function shimSelector(selector, elementName, selectorRegexes) {
    var shimed = false;

    for (var i = 0; i < selectorRegexes.length; i++) {
        var re = selectorRegexes[i];
        if (selector.match(re[0])) {
            shimed = true;
            selector = selector.replace(re[0], re[1]);
            break;
        }
    }
    if (!shimed && !selector.match(new RegExp(elementName))) {
        selector = elementName + ' ' + selector;
    }
    return selector;
}

function shimShadowSelector(selector, elementName) {
    return shimSelector(selector, elementName, buildShadowRegexes(elementName));
}

function shimReactSelector(selector, elementName) {
    return shimSelector(selector, elementName, buildReactRegexes(elementName));
}

function shimStyles(styles, elementName, regexes) {
    var css = require('css'),
        parseTree = css.parse(styles);

    parseTree.stylesheet.rules.forEach(function(rule) {
        rule.selectors.forEach(function(selector, i, selectorsRef) {
            selectorsRef[i] = shimSelector(selector, elementName, regexes);
        });
    });

    return css.stringify(parseTree);
}

function shimShadowStyles(styles, elementName) {
    return shimStyles(styles, elementName, buildShadowRegexes(elementName));
}

function shimReactStyles(styles, elementName) {
    return shimStyles(styles, elementName, buildReactRegexes(elementName));
}

exports = module.exports = {
    shimShadowSelector: shimShadowSelector,
    shimShadowStyles: shimShadowStyles,
    shimReactSelector: shimReactSelector,
    shimReactStyles: shimReactStyles
};