/**
 * @name CSFriendCode
 * @description Parse CS Friend Codes from nicknames on discord servers and open them in the browser
 * @version 1.0.0
 * @author Ekibunnel
 * @authorLink https://github.com/Ekibunnel
 * @website https://github.com/Ekibunnel/BetterDiscordAddons/blob/main/Plugins/CSFriendCode
 * @source https://raw.githubusercontent.com/Ekibunnel/BetterDiscordAddons/main/Plugins/CSFriendCode/CSFriendCode.plugin.js
 * @invite PEsMUjatGu
 */

const Config = {
    changelog: [
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
            name: "",
            collapsible: false,
            shown: true,
            settings: [
                {
                    type: "text",
                    id: "TargetWebsite",
                    name: "Target Website",
                    note: "The website you will be redirected to.",
                    value: "",
                    placeholder: "http://your.web.site/<STEAM_ID>"
                }
            ]
        }
    ]
};

module.exports = meta => {
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

    const ALNUM = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    const RALNUM = {
        "A": 0n,
        "B": 1n,
        "C": 2n,
        "D": 3n,
        "E": 4n,
        "F": 5n,
        "G": 6n,
        "H": 7n,
        "J": 8n,
        "K": 9n,
        "L": 10n,
        "M": 11n,
        "N": 12n,
        "P": 13n,
        "Q": 14n,
        "R": 15n,
        "S": 16n,
        "T": 17n,
        "U": 18n,
        "V": 19n,
        "W": 20n,
        "X": 21n,
        "Y": 22n,
        "Z": 23n,
        "2": 24n,
        "3": 25n,
        "4": 26n,
        "5": 27n,
        "6": 28n,
        "7": 29n,
        "8": 30n,
        "9": 31n,
    }
    const DEFAULT_STEAM_ID = 0x110000100000000n;

    function toLittleEndian(val) {
        const result = new Uint8Array(8);
        let i = 0;
        while (val > 0n) { result[i++] = Number(val % 256n); val /= 256n; }
        return result;
    }

    function fromLittleEndian(bytes) {
        let result = 0n, base = 1n;
        bytes.forEach(b => { result += base * BigInt(b); base *= 256n; });
        return result;
    }

    function fromBigEndian(bytes) {
        const rev = Uint8Array.from(bytes).reverse();
        return fromLittleEndian(rev);
    }

    function rb32(input) {
        let res = 0n, j = 0;
        for (let i = 0; i < 13; i++) {
            if (i === 4 || i === 9) j++;
            const ch = input[j++];
            const val = RALNUM[ch];
            if (val === undefined) {
                BdApi.UI.showToast("Bad CS Friend Code !",{ type:"error", icon:true, timeout:5000});
            }
            res |= val << (5n * BigInt(i));
        }
        return fromBigEndian(toLittleEndian(res));
    }

    function decode(fc) {
        fc = fc.toUpperCase().trim();
        const stripped = fc.replace(/^AAAA-?/, "").replace(/-/g, "");
        const full = "AAAA-" + stripped.slice(0,5) + "-" + stripped.slice(5);
        let val = rb32(full), id = 0n;
        for (let i = 0; i < 8; i++) { val >>= 1n; const n = val & 0xFn; val >>= 4n; id = (id << 4n) | n; }
        return (id | DEFAULT_STEAM_ID).toString();
    }


    function checkHttpUrl(string) {
        let givenURL;
        try {
            givenURL = new URL(string);
        } catch (error) {
            console.log("error is",error)
        return false;  
        }
        return givenURL.protocol === "http:" || givenURL.protocol === "https:";
    }

    function openExternal(url) {
        if (checkHttpUrl(url) === true) {
            try {
                require("electron").shell.openExternal(url);
            } catch {
                window.open(url, "_blank");
            }
        } else {
            BdApi.UI.showToast("External URL is not valid, please go to the plugin settings and change the TargetWebsite!",{ type:"error", icon:true, timeout:15000});
        }

    }

    function ProcessCSFriendCode(GuildId, User){
        var StringToSearch = "";

        var UserGlobalName = User.UserGlobalName;
        if (UserGlobalName != null) {
            StringToSearch = UserGlobalName;
        }

        var UserNickName = BdApi.Webpack.getStore("GuildMemberStore").getMember(GuildId, User.id).nick;
        if (UserNickName != null) {
            StringToSearch = UserNickName;
        }

        let regex = /([A-Za-z0-9]{5}-[A-Za-z0-9]{4})/g;
        let result = StringToSearch.match(regex);
        if (result != null && result.length > 0) {
            result.forEach((CSFriendCode) => {
                //console.log(CSFriendCode);
                let ResolvedSteamID = decode(CSFriendCode);
                BdApi.UI.showToast("Resolved : "+CSFriendCode+" as "+ResolvedSteamID, { type:"success", icon:true, timeout:3000});
                //openExternal("https://ekibunnel.github.io/CSFriendCode/?code="+CSFriendCode);
                let ExternalLink = "https://steamcommunity.com/profiles/"+ResolvedSteamID;
                if(CurrentSettings.config.TargetWebsite && CurrentSettings.config.TargetWebsite.length > 0){
                    let SteamIDRegex = /<STEAM_ID>/;
                    if (SteamIDRegex.test(CurrentSettings.config.TargetWebsite)) {
                        ExternalLink = CurrentSettings.config.TargetWebsite.replace(SteamIDRegex, ResolvedSteamID);
                    } else {
                        ExternalLink = CurrentSettings.config.TargetWebsite+ResolvedSteamID;
                    }
                }
                openExternal(ExternalLink);
            });
        } else {
            BdApi.UI.showToast("Could not find CS Friend Code",{ type:"error", icon:true, timeout:5000});
        }
    }


    var contextMenuPatches = [];
    function addContextMenuItem(returnValue, item) {
        if (!returnValue?.props) return;
        if (Array.isArray(returnValue.props.children)) {
            returnValue.props.children.push(item);
        } else if (returnValue.props.children != null) {
            returnValue.props.children = [returnValue.props.children, item];
        } else {
            returnValue.props.children = [item];
        }
    }

    function patchContextMenus() {
        const userPatch = (returnValue, props) => {
            const guildId = props?.guildId;
            if (!guildId) return;
            const user = props?.user;
            if (!user) return;
            addContextMenuItem(returnValue, BdApi.ContextMenu.buildItem({
                label: "CSFriendCode",
                id: "CSFriendCode-user",
                action: () => ProcessCSFriendCode(guildId, user)
            }));
        };

        const targets = [
            ["user-context", userPatch],
            ["user-profile-actions", userPatch],
            ["user-profile-overflow-menu", userPatch]
        ];

        for (const [navId, cb] of targets) {
            BdApi.ContextMenu.patch(navId, cb);
            contextMenuPatches.push([navId, cb]);
        }
    }

    function unpatchContextMenus() {
        for (const [navId, cb] of contextMenuPatches) {
            BdApi.ContextMenu.unpatch(navId, cb);
        }
        contextMenuPatches = [];
    }

    return {
        start: () => {
            var StoredSettings = BdApi.Data.load(meta.name, 'settings');
            CurrentSettings = Object.assign({}, DefaultSettings, StoredSettings);

            var SavedVersion = BdApi.Data.load(meta.name, 'version');
            if (SavedVersion !== meta.version) {
                BdApi.UI.showChangelogModal({
                    title: meta.name,
                    subtitle: meta.version,
                    blurb: 'CHANGELOG',
                    changes: Config.changelog
                });
                BdApi.Data.save(meta.name, 'version', meta.version);
            }
            patchContextMenus();
        },
        stop: () => {
            unpatchContextMenus();
            CurrentSettings = {};
        },
        getSettingsPanel() {
            return BdApi.UI.buildSettingsPanel({
                settings: UpdateSettingsPanelConfig(),
                onChange: (category, id, value) => {
                    CurrentSettings[category][id] = value;
                    BdApi.Data.save(meta.name, 'settings', CurrentSettings);
                },
            });
        }
    }
};