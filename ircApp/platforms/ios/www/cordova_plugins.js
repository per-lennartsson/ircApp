cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "file": "plugins/cordova-plugin-3dtouch/www/ThreeDeeTouch.js",
        "id": "cordova-plugin-3dtouch.ThreeDeeTouch",
        "pluginId": "cordova-plugin-3dtouch",
        "clobbers": [
            "ThreeDeeTouch"
        ]
    },
    {
        "file": "plugins/cordova-plugin-statusbar/www/statusbar.js",
        "id": "cordova-plugin-statusbar.statusbar",
        "pluginId": "cordova-plugin-statusbar",
        "clobbers": [
            "window.StatusBar"
        ]
    },
    {
        "file": "plugins/cordova-plugin-keyboard/www/keyboard.js",
        "id": "cordova-plugin-keyboard.keyboard",
        "pluginId": "cordova-plugin-keyboard",
        "clobbers": [
            "window.Keyboard"
        ]
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "cordova-plugin-whitelist": "1.2.0",
    "cordova-plugin-3dtouch": "1.3.3",
    "cordova-plugin-statusbar": "2.0.0",
    "cordova-plugin-keyboard": "1.1.3"
}
// BOTTOM OF METADATA
});