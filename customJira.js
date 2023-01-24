// ==UserScript==
// @name         JIRA branch name generator
// @namespace    http://tampermonkey.net/
// @version      0.1
// @author       You
// @match        https://*.atlassian.net/*
// @require http://code.jquery.com/jquery-latest.js
// @require https://cdn.jsdelivr.net/npm/clipboard@2/dist/clipboard.min.js
// @require https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.15/lodash.min.js
// @grant          GM_addStyle
// ==/UserScript==
// Edited By Khangth

function GM_addStyle(css) {
    const style =
        document.getElementById("GM_addStyleBy8626") ||
        (function () {
            const style = document.createElement("style");
            style.type = "text/css";
            style.id = "GM_addStyleBy8626";
            document.head.appendChild(style);
            return style;
        })();
    const sheet = style.sheet;
    sheet.insertRule(css, (sheet.rules || sheet.cssRules || []).length);
}

GM_addStyle(`
.copy-branch-btn-wrapper {
    display: flex;
    position: relative;
}
`);

GM_addStyle(`
.copy-commit-msg-btn-wrapper {
    display: flex;
    position: relative;
}
`);

GM_addStyle(`
.create-branch-btn {
    padding: 0 1em;
    margin: 0 1em;
    cursor: pointer;
    -webkit-box-align: baseline;
    align-items: baseline;
    box-sizing: border-box;
    display: inline-flex;
    font-size: inherit;
    font-style: normal;
    font-weight: normal;
    max-width: 100%;
    text-align: center;
    white-space: nowrap;
    height: auto;
    line-height: inherit;
    vertical-align: baseline;
    width: auto;
    color: rgb(80, 95, 121) !important;
    border-width: 0px;
    text-decoration: none;
    background: rgba(9, 30, 66, 0.04);
    border-radius: 3px;
    transition: background 0.1s ease-out 0s, box-shadow 0.15s cubic-bezier(0.47, 0.03, 0.49, 1.38) 0s;
    outline: none !important;
    position: relative;
}`);

GM_addStyle(`
.create-branch-btn:hover {
    color: rgb(23, 43, 77) !important;
    background: rgb(223, 225, 230) !important;
}
`);

GM_addStyle(`
.create-branch-btn:active, .create-branch-btn:focus {
    color: rgb(0, 82, 204) !important;
    background: rgba(179, 212, 255, 0.6);
}
`);

function addBranchButton() {
    const lastBreadcrumbsContainer = _.last(document.querySelectorAll('div[data-test-id*="breadcrumbs"]'));

    function removeMask(str) {
        str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
        str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
        str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
        str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
        str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
        str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
        str = str.replace(/đ/g, "d");
        str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
        str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
        str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
        str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
        str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
        str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
        str = str.replace(/Đ/g, "D");
        return str;
    }

    function createBranchName() {
        const issueButton = document.querySelector(
            '[data-testid="issue.views.issue-base.foundation.change-issue-type.button"]'
        );
        const issueType = issueButton.getAttribute("aria-label").split("-")[0].trim();
        const jiraTitle = _.first(
            document.querySelectorAll('h1[data-test-id*="issue.views.issue-base.foundation.summary.heading"]')
        ).innerText;
        const jiraId = lastBreadcrumbsContainer.innerText;
        const str = removeMask(jiraTitle.replace(/\[.*?\]/g, ""));

        if (issueType === "Bug") {
            copy(`bugfix/${jiraId.toLowerCase()}-${_.kebabCase(str)}`);
        } else {
            copy(`feature/${jiraId.toLowerCase()}-${_.kebabCase(str)}`);
        }
    }

    function copy(value) {
        const copyText = document.querySelector("#copy-branch-name");
        copyText.value = value;
        copyText.select();
        document.execCommand("copy");
    }

    const existingButton = document.querySelector(".branch-name-ge");
    if (!_.isNil(existingButton)) {
        existingButton.remove();
    }

    $(lastBreadcrumbsContainer).append(`
            <div class="copy-branch-btn-wrapper branch-name-ge">
               <input type="button" class="create-branch-btn" value="Copy branch name" id="create-branch-name">
               <textarea style="opacity: 0; position: absolute; left: 200%" id="copy-branch-name">
            </div>
    `);

    $("#create-branch-name").on("click", () => {
        createBranchName();
        $(".copy-branch-btn-wrapper").append(
            `<span id="copied-txt" style="position: absolute; top: -70%; left: 50%; color: green;">Copied</span>`
        );
        setTimeout(() => $("#copied-txt").remove(), 3000);
    });

    return new Promise(() =>
        setTimeout(() => {
            console.log("Created Button");
        }, 100)
    );
}

function addCommitButton() {
    const lastBreadcrumbsContainer = _.last(document.querySelectorAll('div[data-test-id*="breadcrumbs"]'));

    function createCommitMessage() {
        const issueButton = document.querySelector(
            '[data-testid="issue.views.issue-base.foundation.change-issue-type.button"]'
        );
        const issueType = issueButton.getAttribute("aria-label").split("-")[0].trim();
        const jiraTitle = _.first(
            document.querySelectorAll('h1[data-test-id*="issue.views.issue-base.foundation.summary.heading"]')
        ).innerText;
        const jiraId = lastBreadcrumbsContainer.innerText;

        if (issueType === "Bug") {
            copy(`fix: ${jiraId} ${jiraTitle.replace(/\[.*?\]/g, "")}`.replace("  ", " "));
        } else {
            copy(`feat: ${jiraId} ${jiraTitle.replace(/\[.*?\]/g, "")}`.replace("  ", " "));
        }
    }

    function copy(value) {
        const copyText = document.querySelector("#copy-commit-message");
        copyText.value = value;
        copyText.select();
        document.execCommand("copy");
    }

    const existingButton = document.querySelector(".commit-message");
    if (!_.isNil(existingButton)) {
        existingButton.remove();
    }

    $(lastBreadcrumbsContainer).append(`
            <div class="copy-commit-msg-btn-wrapper commit-message">
               <input type="button" class="create-branch-btn" value="Copy Commit Message" id="create-commit-message">
                <textarea style="opacity: 0; position: absolute; left: 100%" id="copy-commit-message">
            </div>
    `);

    $("#create-commit-message").on("click", () => {
        createCommitMessage();
        $(".copy-commit-msg-btn-wrapper").append(
            `<span id="copied-message-txt" style="position: absolute; top: -70%; left: 50%; color: green;">Copied</span>`
        );
        setTimeout(() => $("#copied-message-txt").remove(), 3000);
    });
}

(async function () {
    await addBranchButton();
    addCommitButton();
})();

let oldURL = "";
let currentURL = window.location.href;
function checkURLChange(currentURL) {
    if (currentURL != oldURL) {
        addBranchButton();
        oldURL = currentURL;
    } else {
        const branchNameGeButton = document.querySelector(".branch-name-ge");
        const commitMessageGeButton = document.querySelector(".commit-message");
        if (!branchNameGeButton) {
            addBranchButton();
        }
        if (!commitMessageGeButton) {
            addCommitButton();
        }
    }

    oldURL = window.location.href;
    setTimeout(function () {
        checkURLChange(window.location.href);
    }, 1000);
}

checkURLChange();
