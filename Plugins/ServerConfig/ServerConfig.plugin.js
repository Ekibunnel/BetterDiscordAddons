/**
 * @name ServerConfig
 * @description Apply a custom configuration when joining a new server
 * @version 1.1.1
 * @author Ekibunnel
 * @authorLink https://github.com/Ekibunnel
 * @website https://github.com/Ekibunnel/BetterDiscordAddons/blob/main/Plugins/ServerConfig
 * @source https://raw.githubusercontent.com/Ekibunnel/BetterDiscordAddons/main/Plugins/ServerConfig/ServerConfig.plugin.js
 * @invite PEsMUjatGu
 */

const Config = {
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
        version: "1.1.1",
        description: "Apply a custom configuration when joining a new server",
        github: "https://github.com/Ekibunnel/BetterDiscordAddons/blob/main/Plugins/ServerConfig",
        github_raw: "https://raw.githubusercontent.com/Ekibunnel/BetterDiscordAddons/main/Plugins/ServerConfig/ServerConfig.plugin.js"
    },
    changelog: [
        {
            title: "1.1.1",
            type: "improved",
            items: [
                "Don't use deprecated BdApi functions anymore"
            ]
        },
        {
            title: "1.1.0",
            type: "fixed",
            items: [
                "Fix plugin, doesn't use ZeresPluginLibrary anymore"
            ]
        },
        {
            title: "1.0.5",
            type: "fixed",
            items: [
                "Fix a potential bug that would re-applie the config to an already joined server"
            ]
        },
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
            title: "1.0.2",
            type: "fixed",
            items: [
                "Fix Dispatch module not found again"
            ]
        },
        {
            title: "1.0.1",
            type: "fixed",
            items: [
                "Fix Dispatch module not found on canary and ptb"
            ]
        },
        {
            title: "1.0.0",
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
                    type: "text",
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

module.exports = meta => {
    // Settings and SettingsPanel stuff (fix 1.1.0)
    var CurrentSettings = {};
    const DefaultSettings = {};
    for (let i = 0; i < Config.defaultConfig.length; i++) {
        let iO = Config.defaultConfig[i];
        if (iO.type == 'category') {
            DefaultSettings[iO.id] = {};
            for (let g = 0; g < iO.settings.length; g++) {
                let gO = iO.settings[g];
                DefaultSettings[iO.id][gO.id] = gO.value;
            }
        }
    }

    function UpdateSettingsPanelConfig() {
        var SettingsPanelConfig = Config.defaultConfig;
        if (Object.keys(CurrentSettings).length > 0) {
            for (let i = 0; i < SettingsPanelConfig.length; i++) {
                let iO = SettingsPanelConfig[i];
                if (iO.type == 'category') {
                    for (let g = 0; g < iO.settings.length; g++) {
                        let gO = iO.settings[g];
                        if (CurrentSettings[iO.id] !== undefined && CurrentSettings[iO.id][gO.id] !== undefined) {
                            SettingsPanelConfig[i].settings[g].value = CurrentSettings[iO.id][gO.id];
                        }
                    }
                }
            }
        }
        return SettingsPanelConfig;
    }

    //main
    let dirtyDispatch = BdApi.Webpack.getModule(m => m.dispatch && m.subscribe);
    if (!dirtyDispatch) BdApi.Logger.error(Config.info.name, "Dispatch Module not found");

    let ApplyConfigTimeWindow = 60000; // in ms (fix 1.0.5)

    function ON_GUILD_CREATED(data){
        if(new Date(data.guild.joined_at).getTime() + ApplyConfigTimeWindow < new Date().getTime()){
            BdApi.Logger.warn(Config.info.name, "Server "+data.guild.id+" was joinned at " + JSON.stringify(data.joined_at) + " which is more than "+ApplyConfigTimeWindow+" ms ago, ignoring");
        } else {

            if(Object.keys(CurrentSettings.config).length > 0){
                BdApi.Webpack.getModule(m => m.updateGuildNotificationSettings).updateGuildNotificationSettings(data.guild.id, CurrentSettings.config);
            }

            if(CurrentSettings.nickname.nick && CurrentSettings.nickname.nick.length > 0){
                BdApi.Webpack.getModule(m => m.changeNickname).changeNickname(data.guild.id, null, "@me",  CurrentSettings.nickname.nick);
            }
        }
    }

    function ON_GUILD_JOIGNED(data){

        if(CurrentSettings.experimental.terms){
            BdApi.Webpack.getModule(m => m.submitVerificationForm).submitVerificationForm(data.guildId, "@me");
        }
    }

    return {
        start: () => {
            var StoredSettings = BdApi.Data.load(Config.info.name, 'settings');
            CurrentSettings = Object.assign({}, DefaultSettings, StoredSettings);

            var SavedVersion = BdApi.Data.load(Config.info.name, 'version');
            if (SavedVersion !== Config.info.version) {
                BdApi.UI.showChangelogModal({
                    title: Config.info.name,
                    subtitle: Config.info.version,
                    blurb: 'CHANGELOG',
                    changes: Config.changelog
                });
                BdApi.Data.save(Config.info.name, 'version', Config.info.version);
            }
            let HasSeenSettings = BdApi.Data.load(Config.info.name, 'has_seen_settings');
            if(HasSeenSettings == undefined || HasSeenSettings != true) {
                BdApi.UI.showToast(`${Config.info.name} plugins is running, you have to change the plugin settings to make it do something`,
                    {
                        type:"success",
                        icon:true,
                        timeout:13000
                    }
                );
            }
            dirtyDispatch.subscribe("GUILD_CREATE", ON_GUILD_CREATED);
            dirtyDispatch.subscribe("GUILD_JOIN_REQUEST_CREATE", ON_GUILD_JOIGNED);
        },
        stop: () => {
            dirtyDispatch.unsubscribe("GUILD_CREATE", ON_GUILD_CREATED);
            dirtyDispatch.unsubscribe("GUILD_JOIN_REQUEST_CREATE", ON_GUILD_JOIGNED);
            CurrentSettings = {};
        },
        getSettingsPanel() {
            BdApi.Data.save(Config.info.name, 'has_seen_settings', true);
            return BdApi.UI.buildSettingsPanel({
                settings: UpdateSettingsPanelConfig(),
                onChange: (category, id, value) => {
                    CurrentSettings[category][id] = value;
                    BdApi.Data.save(Config.info.name, 'settings', CurrentSettings);
                },
            });
        }
    }
};