
/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4,
maxerr: 50, node: true */
/*global */

(function () {
    "use strict";

    var ChildProcess   = require("child_process");
    var temp           = require("./thirdparty/temp");

    function launchChrome(projectDirectory) {
        // According to https://developer.chrome.com/apps/first_app
        // Start and launch the app
        // --load-and-launch-app=/path/to/app/
        temp.mkdir("chrome-ext", function (err, tmpDir) {
            var chromeLocation = "/Applications/Google\\ \\Chrome.app/Contents/MacOS/Google\\ \\Chrome";
            var chromeArguments = "--load-and-launch-app=" + projectDirectory + " --user-data-dir=" + tmpDir;

            var child = ChildProcess.exec(chromeLocation + " " + chromeArguments,
                function (error, stdout, stderr) {
                    console.log('stdout: ' + stdout);
                    console.log('stderr: ' + stderr);
                    if (error !== null) {
                        console.log('exec error: ' + error);
                    }

                });
        });

        return true;
    }

    /**
     * Initializes the test domain with several test commands.
     * @param {DomainManager} domainManager The DomainManager for the server
     */
    function init(domainManager) {
        if (!domainManager.hasDomain("chrome-launcher")) {
            domainManager.registerDomain("chrome-launcher", {major: 0, minor: 1});
        }
        domainManager.registerCommand(
            "chrome-launcher",       // domain name
            "launchChrome",    // command name
            launchChrome,   // command handler function
            false,          // this command is synchronous in Node
            "Launches Chrome extension loader with project directory",
            [{name: "projectDirectory", // parameters
                type: "string",
                description: "Project directory"}],
            [{name: "success", // return values
                type: "bool",
                description: "Bool if it is successful starting"}]
        );
    }


    exports.init = init;

}());

