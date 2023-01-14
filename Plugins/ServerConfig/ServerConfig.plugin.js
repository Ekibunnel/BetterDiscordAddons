/**
 * @name ServerConfig
 * @description Apply a custom configuration when joining a new server
 * @version 1.0.4
 * @author Ekibunnel
 * @authorLink https://github.com/Ekibunnel
 * @website https://github.com/Ekibunnel/BetterDiscordAddons/blob/main/Plugins/ServerConfig
 * @source https://raw.githubusercontent.com/Ekibunnel/BetterDiscordAddons/main/Plugins/ServerConfig/ServerConfig.plugin.js
 * @invite PEsMUjatGu
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
const config = {
    main: "index.js",
    info: {
        name: "ServerConfig",
        invite: "PEsMUjatGu",
        authors: [
            {
                name: "Ekibunnel",
                github_username: "Ekibunnel"
            }
        ],
        authorLink: "https://github.com/Ekibunnel",
        version: "1.0.4",
        description: "Apply a custom configuration when joining a new server",
        github: "https://github.com/Ekibunnel/BetterDiscordAddons/blob/main/Plugins/ServerConfig",
        github_raw: "https://raw.githubusercontent.com/Ekibunnel/BetterDiscordAddons/main/Plugins/ServerConfig/ServerConfig.plugin.js"
    },
    changelog: [
        {
            title: "1.0.4",
            type: "improved",
            items: [
                "Updated config to include Hide Muted Channels and Show All Channels"
            ]
        },
        {
            title: "1.0.3",
            type: "improved",
            items: [
                "Updated config to include Highlights and Mute new events"
            ]
        },
        {
            title: "1.0.2 - Fixed",
            type: "fixed",
            items: [
                "Dispatch module not found again"
            ]
        },
        {
            title: "1.0.1 - Fixed",
            type: "fixed",
            items: [
                "Dispatch module not found on canary and ptb"
            ]
        },
        {
            title: "1.0",
            type: "improved",
            items: [
                "Release"
            ]
        }
    ],
    defaultConfig: [
        {
            type: "category",
            id: "config",
            name: "Server Config",
            collapsible: true,
            shown: true,
            settings: [
                {
                    type: "switch",
                    id: "muted",
                    name: "Mute server",
                    note: "",
                    value: false
                },
                {
                    type: "radio",
                    id: "message_notifications",
                    name: "Server Notification Settings",
                    note: "",
                    value: 1,
                    options: [
                        {
                            name: "All Messages",
                            value: 0,
                            desc: "",
                            color: "#000000"
                        },
                        {
                            name: "Only mentions",
                            value: 1,
                            desc: "",
                            color: "#000000"
                        },
                        {
                            name: "Nothing",
                            value: 2,
                            desc: "",
                            color: "#000000"
                        }
                    ]
                },
                {
                    type: "dropdown",
                    id: "notify_highlights",
                    name: "Include Highlights",
                    note: "",
                    value: 2,
                    options: [
                        {
                            label: "Off",
                            value: 1
                        },
                        {
                            label: "On",
                            value: 2
                        }
                    ]
                },
                {
                    type: "switch",
                    id: "suppress_everyone",
                    name: "Suppress @everyone and @here",
                    note: "",
                    value: false
                },
                {
                    type: "switch",
                    id: "suppress_roles",
                    name: "Suppress All Role @mentions",
                    note: "",
                    value: false
                },
                {
                    type: "switch",
                    id: "mobile_push",
                    name: "Mobile Push Notifications",
                    note: "",
                    value: true
                },
                {
                    type: "switch",
                    id: "mute_scheduled_events",
                    name: "Mute New Events",
                    note: "",
                    value: false
                },
                {
                    type: "dropdown",
                    id: "flags",
                    name: "Show All Channels",
                    note: "",
                    value: 16384,
                    options: [
                        {
                            label: "Off",
                            value: 16384
                        },
                        {
                            label: "On",
                            value: 0
                        }
                    ]
                },
                {
                    type: "switch",
                    id: "hide_muted_channels",
                    name: "Hide Muted Channels",
                    note: "",
                    value: false
                }
            ]
        },
        {
            type: "category",
            id: "nickname",
            name: "Nickname",
            collapsible: true,
            shown: false,
            settings: [
                {
                    type: "textbox",
                    id: "nick",
                    name: "",
                    note: "May not work on all servers, since a lot of them won't give you the permission to change nickname instantly",
                    value: "",
                    placeholder: "Nickname"
                }
            ]
        },
        {
            type: "category",
            id: "experimental",
            name: "Experimental",
            collapsible: true,
            shown: false,
            settings: [
                {
                    type: "switch",
                    id: "terms",
                    name: "Accept server terms",
                    note: "Everything under this category may broke at any time, if so it will probably never be fixed",
                    value: false
                }
            ]
        }
    ]
};
class Dummy {
    constructor() {this._config = config;}
    start() {}
    stop() {}
}
 
if (!global.ZeresPluginLibrary) {
    BdApi.showConfirmationModal("Library Missing", `The library plugin needed for ${config.name ?? config.info.name} is missing. Please click Download Now to install it.`, {
        confirmText: "Download Now",
        cancelText: "Cancel",
        onConfirm: () => {
            require("request").get("https://betterdiscord.app/gh-redirect?id=9", async (err, resp, body) => {
                if (err) return require("electron").shell.openExternal("https://betterdiscord.app/Download?id=9");
                if (resp.statusCode === 302) {
                    require("request").get(resp.headers.location, async (error, response, content) => {
                        if (error) return require("electron").shell.openExternal("https://betterdiscord.app/Download?id=9");
                        await new Promise(r => require("fs").writeFile(require("path").join(BdApi.Plugins.folder, "0PluginLibrary.plugin.js"), content, r));
                    });
                }
                else {
                    await new Promise(r => require("fs").writeFile(require("path").join(BdApi.Plugins.folder, "0PluginLibrary.plugin.js"), body, r));
                }
            });
        }
    });
}
 
module.exports = !global.ZeresPluginLibrary ? Dummy : (([Plugin, Api]) => {
     const plugin = (Plugin, Library) => {

    const {PluginUtilities} = Library;
    let dirtyDispatch = BdApi.findModuleByProps("dispatch", "subscribe");
    if (!dirtyDispatch) console.error("[PLUGIN] ServerConfig : Dispatch Module not found")

    function ON_GUILD_CREATED(data){

        let settings = PluginUtilities.loadSettings(config.info.name);

        if(Object.keys(settings.config).length > 0){
            BdApi.findModuleByProps("updateGuildNotificationSettings").updateGuildNotificationSettings(data.guild.id, settings.config);
        }


        if(settings.nickname.nick){
            BdApi.findModuleByProps("changeNickname").changeNickname(data.guild.id, null, "@me",  settings.nickname.nick);
        }
    }

    function ON_GUILD_JOIGNED(data){
        let settings = PluginUtilities.loadSettings(config.info.name);

        if(settings.experimental.terms){
            BdApi.findModuleByProps("submitVerificationForm").submitVerificationForm(data.guildId, "@me");
        }
    }

    return class ServerConfig extends Plugin {

        onStart() {
            if(this.settings.has_seen_settings !== undefined) {
                BdApi.showToast(`${config.info.name} plugins is running, you have to change the plugin settings to make it do something`,
                    {
                        type:"success",
                        icon:true,
                        timeout:13000
                    }
                );
            }
            dirtyDispatch.subscribe("GUILD_CREATE", ON_GUILD_CREATED);
            dirtyDispatch.subscribe("GUILD_JOIN_REQUEST_CREATE", ON_GUILD_JOIGNED);
        }
        
        onStop() {
            dirtyDispatch.unsubscribe("GUILD_CREATE", ON_GUILD_CREATED);
            dirtyDispatch.unsubscribe("GUILD_JOIN_REQUEST_CREATE", ON_GUILD_JOIGNED);
        }

        getSettingsPanel() {
            BdApi.setData(config.info.name, 'has_seen_settings', true);
            const panel = this.buildSettingsPanel();
            return panel.getElement();
		}
    };

};
     return plugin(Plugin, Api);
})(global.ZeresPluginLibrary.buildPlugin(config));
/*@end@*/