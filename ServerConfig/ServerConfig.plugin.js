/**
 * @name ServerConfig
 * @invite PEsMUjatGu
 * @website https://github.com/Ekibunnel/BetterDiscordAddons/blob/main/Plugins/ServerConfig
 * @source https://raw.githubusercontent.com/Ekibunnel/BetterDiscordAddons/main/Plugins/ServerConfig/ServerConfig.plugin.js
 */
/*@cc_on
@if (@_jscript)
    
    // Offer to self-install for clueless users that try to run this directly.
    var shell = WScript.CreateObject("WScript.Shell");
    var fs = new ActiveXObject("Scripting.FileSystemObject");
    var pathPlugins = shell.ExpandEnvironmentStrings("%APPDATA%\\BetterDiscord\\plugins");
    var pathSelf = WScript.ScriptFullName;
    // Put the user at ease by addressing them in the first person
    shell.Popup("It looks like you've mistakenly tried to run me directly. \n(Don't do that!)", 0, "I'm a plugin for BetterDiscord", 0x30);
    if (fs.GetParentFolderName(pathSelf) === fs.GetAbsolutePathName(pathPlugins)) {
        shell.Popup("I'm in the correct folder already.", 0, "I'm already installed", 0x40);
    } else if (!fs.FolderExists(pathPlugins)) {
        shell.Popup("I can't find the BetterDiscord plugins folder.\nAre you sure it's even installed?", 0, "Can't install myself", 0x10);
    } else if (shell.Popup("Should I copy myself to BetterDiscord's plugins folder for you?", 0, "Do you need some help?", 0x34) === 6) {
        fs.CopyFile(pathSelf, fs.BuildPath(pathPlugins, fs.GetFileName(pathSelf)), true);
        // Show the user where to put plugins in the future
        shell.Exec("explorer " + pathPlugins);
        shell.Popup("I'm installed!", 0, "Successfully installed", 0x40);
    }
    WScript.Quit();

@else@*/

module.exports = (() => {
    const config = {"main":"index.js","info":{"name":"ServerConfig","inviteCode":"PEsMUjatGu","authors":[{"name":"Ekibunnel","github_username":"Ekibunnel"}],"version":"0.0.1","description":"Default configuration for newly joigned servers","github":"https://github.com/Ekibunnel/BetterDiscordAddons/blob/main/Plugins/ServerConfig","github_raw":"https://raw.githubusercontent.com/Ekibunnel/BetterDiscordAddons/main/Plugins/ServerConfig/ServerConfig.plugin.js"},"changelog":[{"title":"INDEV","type":"progress","items":["Plugin in development"]}],"defaultConfig":[{"type":"switch","id":"grandOverride","name":"Main Override","note":"This could be a global override or something idk","value":false},{"type":"category","id":"basic","name":"Basic Settings","collapsible":true,"shown":false,"settings":[{"type":"textbox","id":"textbox","name":"Basic Textbox","note":"Description of the textbox setting","value":"nothing","placeholder":""},{"type":"dropdown","id":"dropdown","name":"Select","note":"You have choices for now","value":"weiner","options":[{"label":"Test 1","value":"weiner"},{"label":"Test 2","value":50},{"label":"Test 3","value":"{label: \"Test 1\", value: \"weiner\"})"}]},{"type":"radio","id":"radio","name":"Smol Choices","note":"You have less choices now","value":50,"options":[{"name":"Test 1","value":"weiner","desc":"This is the first test","color":"#ff0000"},{"name":"Test 2","value":50,"desc":"This is the second test","color":"#00ff00"},{"name":"Test 3","value":"{label: \"Test 1\", value: \"weiner\"})","desc":"This is the third test","color":"#0000ff"}]},{"type":"switch","id":"switch1","name":"A Switch","note":"This could be a boolean","value":false},{"type":"switch","id":"switch2","name":"Anotha one","note":"This could be a boolean2","value":true},{"type":"switch","id":"switch3","name":"Anotha one two","note":"This could be a boolean3","value":true},{"type":"switch","id":"switch4","name":"Anotha one too","note":"This could be a boolean4","value":false}]},{"type":"category","id":"advanced","name":"Advanced Settings","collapsible":true,"shown":false,"settings":[{"type":"color","id":"color","name":"Example Color","note":"Color up your life","value":"#ff0000"},{"type":"keybind","id":"keys","name":"DJ Khaled","note":"I got them keys keys keys","value":[162,74]},{"type":"slider","id":"slider1","name":"Electric Slide","note":"Down down do your thang do your thang","value":30,"min":0,"max":100},{"type":"slider","id":"slider2","name":"Marker Slide","note":"Preset markers example","value":54,"min":0,"max":90,"markers":[0,9,18,27,36,45,54,63,72,81,90],"stickToMarkers":true},{"type":"file","id":"fileObj","name":"File To Upload","note":"This setting type needs a rewrite..."}]}]};

    return !global.ZeresPluginLibrary ? class {
        constructor() {this._config = config;}
        getName() {return config.info.name;}
        getAuthor() {return config.info.authors.map(a => a.name).join(", ");}
        getDescription() {return config.info.description;}
        getVersion() {return config.info.version;}
        load() {
            BdApi.showConfirmationModal("Library Missing", `The library plugin needed for ${config.info.name} is missing. Please click Download Now to install it.`, {
                confirmText: "Download Now",
                cancelText: "Cancel",
                onConfirm: () => {
                    require("request").get("https://rauenzi.github.io/BDPluginLibrary/release/0PluginLibrary.plugin.js", async (error, response, body) => {
                        if (error) return require("electron").shell.openExternal("https://betterdiscord.net/ghdl?url=https://raw.githubusercontent.com/rauenzi/BDPluginLibrary/master/release/0PluginLibrary.plugin.js");
                        await new Promise(r => require("fs").writeFile(require("path").join(BdApi.Plugins.folder, "0PluginLibrary.plugin.js"), body, r));
                    });
                }
            });
        }
        start() {}
        stop() {}
    } : (([Plugin, Api]) => {
        const plugin = (Plugin, Library) => {

    const {Logger, Patcher} = Library;

    return class ExamplePlugin extends Plugin {

        onStart() {
            Logger.log("Started");
            Patcher.before(Logger, "log", (t, a) => {
                a[0] = "Patched Message: " + a[0];
            });
        }

        onStop() {
            Logger.log("Stopped");
            Patcher.unpatchAll();
        }

        getSettingsPanel() {
            const panel = this.buildSettingsPanel();
            panel.append(this.buildSetting({
                type: "switch",
                id: "otherOverride",
                name: "A second override?!",
                note: "wtf is happening here",
                value: true,
                onChange: value => this.settings["otherOverride"] = value
            }));
            return panel.getElement();
        }
    };

};
        return plugin(Plugin, Api);
    })(global.ZeresPluginLibrary.buildPlugin(config));
})();
/*@end@*/