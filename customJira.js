// ==UserScript==
// @name         Copy jira task name
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://kafoodle.atlassian.net/browse/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const copyToClipboard = str => {
        const el = document.createElement('textarea');
        el.value = str;
        el.setAttribute('readonly', '');
        el.style.position = 'absolute';
        el.style.left = '-9999px';
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
    };

    const copyTaskName = () => {
        var i = $(".issue-link:first").text();
        var d = $("#summary-val").text();
        var desc = i + " " + d;
        copyToClipboard(desc);
    };

    var btn = document.createElement("button");
    btn.onclick = copyTaskName;
    btn.innerText = "Copy task name";
    document.querySelector(".aui-nav-breadcrumbs").append(btn);
})();