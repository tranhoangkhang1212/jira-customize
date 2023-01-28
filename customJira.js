// ==UserScript==
// @name       JIRA Custom Wallboard
// @namespace  http://use.i.E.your.homepage/
// @version    0.1
// @description  enter something useful
// @match      https://iadvize.atlassian.net/plugins/servlet/Wallboard/?dashboardId=*
// @require    https://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @copyright  2012+, You
// ==/UserScript==

console.log("Start tampermonkey");

// Get iFrame
const iFrameID = 'gadget-10901';
//var frame = document.getElementById(iFrameID);
var frame = document.getElementsByTagName('iframe')[0];


$( "html, table.wallframe td" ).css( "padding", "0" );
    
//CONTROLS
//Define all wallboards
var rootUrl = 'https://iadvize.atlassian.net/plugins/servlet/Wallboard/?dashboardId=';
var basicWallboard = '10200';
//Define array for user's filtered wallboard
var userWallboards = new Array();
userWallboards[0] = "10700";
userWallboards[1] = "10701";
userWallboards[2] = "10702";
userWallboards[3] = "10703";
userWallboards[4] = "10704";
userWallboards[5] = "10705";
userWallboards[6] = "10706";
userWallboards[7] = "10707";
userWallboards[8] = "10708";
//Initializing user's array loop
var uI = 0;
var maxUserId = userWallboards.length - 1;

//Key up trigger
$('html').keyup(function(event){
    //Get letter matching keyCode event
    var value = String.fromCharCode(event.keyCode);
    console.log('keyup() is triggered!, keyCode = '  + event.keyCode + ' which = ' + value);
    //User switch
    if (value=='U') {
        dashBoardId = userWallboards[uI];
        if (uI>=maxUserId) { uI = 0; }
        else { uI++; }
    } 
    //Home wallboard
    else if (value=='H') {
        dashBoardId = basicWallboard;
    }
    else {
        dashBoardId = basicWallboard;
    }
        
    //Load new wallboard
    $('iframe').attr('src',rootUrl + dashBoardId);
    console.log('Loading '+rootUrl + dashBoardId);
});


// Fire when iFrame is loaded
frame.onload = function() {
    
    // Tags
    var doc   = frame.contentDocument;
    var head  = doc.getElementsByTagName('head')[0];
    var style = doc.createElement('style');
    
    // Styles
    const BACKGROUND_COLOR = "#222";
	const FOREGROUND_COLOR = "#222";
	const ISSUE_COLOR = "#fff";	
    
    var styles = 	'.wallboard, .wallboard #ghx-pool, .wallboard .ghx-column { background: ' + BACKGROUND_COLOR + ' !important }' + 
                 	'#jira .dashboard .gadget .gadget-menu .aui-dd-parent .gadget-colors li.color1, #jira .dashboard #dashboard-content div.gadget.color1 .gadget-hover .dashboard-item-title, #jira .dashboard #dashboard-content div.gadget.color1 .dashboard-item-title {background: ' + BACKGROUND_COLOR + '}' + 
    				'.wallboard .ghx-column-headers .ghx-column { border:none !important }' + 
        			'.ghx-column-headers .ghx-column, .ghx-columns .ghx-column { border-right: 4px solid #333333 !important; }' + 
        			'.ghx-swimlane:last-child .ghx-columns .ghx-column { height:1500px !important; }' + 
        			'.ghx-column:last-child { border-right: 0 !important}' + 
        			'.wallboard #ghx-pool { padding: 0 !important; }' +
        			'.view { padding: 0 !important; }' + 
        
        			'.ghx-description { display:none !important }' + 
        
        			//Columns titles
        			'.ghx-column-headers li.ghx-column { text-align: center; font-size:16px !important; }' + 
        			'.ghx-column-headers li.ghx-column h2 { font-weight:bold; text-transform:uppercase; font-size:16px !important; }' + 
       				'.ghx-limits { display:none !important; }' + 
        			'.ghx-qty {font-size:16px !important;}' + 
        
        			//Adjust columns width
        			'li[data-column-id="155"], li[data-id="155"], li[data-column-id="30"], li[data-id="30"] { width: 305px !important; }' + 
        			
        			//ISSUES
        			'.ghx-avatar img { -webkit-border-radius: 12px !important; border-radius: 12px !important; width:24px !important; height:24px !important }' + 
        			'.wallboard .ghx-issue-fields .ghx-summary, .wallboard .ghx-issue-fields .ghx-summary span { color: '+FOREGROUND_COLOR+' !important; font-size: 12px !important }' + 
        			'.ghx-key a {color: '+FOREGROUND_COLOR+' !important; font-size:12px !important; font-weight:bold;}' + 
        			'.wallboard .ghx-issue, .wallboard .ghx-issue:hover, .wallboard .ghx-issue.ghx-selected, .wallboard .ghx-columns .ghx-column.ghx-busted .ghx-issue { background: '+ISSUE_COLOR+' !important; font-size: 12px !important; padding: 6px 10px 10px 20px !important; }' + 
        			
        			//Issue card
        			'.wallboard.ghx-sprint-support .ghx-issue { width:145px; height:80px !important; float:left; margin-right:5px;}' + 
        			'.ghx-issue-fields { padding-right: 28px !important; }' + 
        
        			'.wallboard .ghx-swimlane-header { background: #151515 !important; margin: 0 !important; }' + 
        			'.wallboard .ghx-swimlane-header:after { background:none !important; -webkit-box-shadow: none !important; box-shadow: none !important;}' + 
        			'.ghx-heading a { color: #fff !important;}' + 
        			'.ghx-issue .ghx-flags { right: 14px !important; top: 40px !important; left: inherit !important; }' + 
        			
        			//Flagged Issues
        			'.ghx-issue.ghx-flagged { background:#FFE9A8 !important;}' + 
        
        			//ISSUE TYPE COLOR THEME
        			'.ghx-grabber { background-color: #FFA200 !important; height:100% !important;  }' + 
        			//Bugs
        			'.ghx-type-1 > .ghx-grabber { background-color: #dd0029 !important}' + 
        			//Tech
                    '.ghx-type-8 > .ghx-grabber { background-color: #FFA200 !important}' + 
        			//Analyse
                    '.ghx-type-15 > .ghx-grabber, .ghx-type-10001 > .ghx-grabber { background-color: #00B001 !important}' + 
        			//Design
                    '.ghx-type-14 > .ghx-grabber { background-color: #238ae8 !important}' + 
        			'.ghx-type { display:none;}';

    // Create style block
    style.id        = 'iadvize-custom';
    style.type      = 'text/css';
	style.innerHTML = styles;
    head.appendChild(style);
};
