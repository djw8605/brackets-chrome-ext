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


    var $icon = $("<a id='chrome-ext-toolbar-icon' href='#'></a>").attr("title", "Launch Chrome Extension").appendTo($("#main-toolbar .buttons")).hide();

    ExtensionUtils.loadStyleSheet(module, "styles/chrome-ext.css");

    function launchChrome() {
        $icon.addClass('on');
        var launchDomain = new NodeDomain("chrome-launcher", ExtensionUtils.getModulePath(module, "launchChrome"));
        launchDomain.exec("launchChrome", ProjectManager.getProjectRoot().fullPath)
            .done(function (success) {
                console.log("Succesfully launched chrome");
            }).fail(function (err) {
                console.error("Error calling domain", err);
            });

        // Now listen for the shutdown event
        $(launchDomain).on('chrome:close', function (evt) {

            $icon.removeClass('on');
            console.log("Chrome has closed");

        });

    }

    // Init the user interface
    function initUi() {
        $icon.on("click", launchChrome);
    }

    function _checkManifest(event) {
        // Get all the files in the project
        $icon.hide();
        ProjectManager.getAllFiles(false).then(function (files) {

            files.forEach(function (value, index, files) {

                if (value.name === "manifest.json") {
                    // Found a manifest.json.  See if it matches a typical chrome extension / app

                    value.read(function (error, contents, stats) {

                        // Parse the manifest
                        var manifestObj = JSON.parse(contents);

                        // Check the structure of the manifest.json
                        if (manifestObj.hasOwnProperty('name') &&
                                manifestObj.hasOwnProperty('version')) {

                            $icon.show();
                        }

                    });
                }

            });

        });
    }

    // When a project is opened, check for the manifest.json file
    $(ProjectManager).on("projectOpen", _checkManifest);

    AppInit.htmlReady(function () {
        initUi();

    });

});

