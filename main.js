/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global define, $, brackets, window */

/** Simple extension that adds a "File > Hello World" menu item */
define(function (require, exports, module) {
    "use strict";

    var CommandManager = brackets.getModule("command/CommandManager"),
        Menus          = brackets.getModule("command/Menus"),
        AppInit        = brackets.getModule("utils/AppInit"),
        ProjectManager = brackets.getModule("project/ProjectManager"),
        ExtensionUtils = brackets.getModule("utils/ExtensionUtils"),
        NodeDomain     = brackets.getModule("utils/NodeDomain");


    var $icon     = $("<a id='chrome-ext-toolbar-icon' href='#'></a>").attr("title", "Launch Chrome Extension").appendTo($("#main-toolbar .buttons"));

    ExtensionUtils.loadStyleSheet(module, "styles/chrome-ext.css");

    function launchChrome() {
        var launchDomain = new NodeDomain("chrome-launcher", ExtensionUtils.getModulePath(module, "launchChrome"));
        launchDomain.exec("launchChrome", ProjectManager.getProjectRoot().fullPath)
            .done(function (success) {
                console.log("Succesfully launched chrome");
            }).fail(function (err) {
                console.error("Error calling domain", err);
            });

    }

    // Init the user interface
    function initUi() {
        $icon.on("click", launchChrome);
    }



    AppInit.htmlReady(function () {
        initUi();
    });

});

