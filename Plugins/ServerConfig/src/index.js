
module.exports = (Plugin, Library) => {

    const {PluginUtilities} = Library;
    let dirtyDispatch = BdApi.findModuleByProps("dispatch", "subscribe");
    if (!dirtyDispatch) console.error("[PLUGIN] ServerConfig : Dispatch Module not found")

    let ApplyConfigTimeWindow = 60000;

    function ON_GUILD_CREATED(data){
        if(new Date(data.guild.joined_at).getTime() + ApplyConfigTimeWindow < new Date().getTime()){
            console.warn("[PLUGIN] ServerConfig : server "+data.guild.id+" was joinned at " + JSON.stringify(data.joined_at) + " which is more than "+ApplyConfigTimeWindow+" ms ago, ignoring");
        } else {
            let settings = PluginUtilities.loadSettings(config.info.name);

            if(Object.keys(settings.config).length > 0){
                BdApi.findModuleByProps("updateGuildNotificationSettings").updateGuildNotificationSettings(data.guild.id, settings.config);
            }

            if(settings.nickname.nick){
                BdApi.findModuleByProps("changeNickname").changeNickname(data.guild.id, null, "@me",  settings.nickname.nick);
            }
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
            let HasSeenSettings = BdApi.Data.load(config.info.name, 'has_seen_settings');
            if(HasSeenSettings == undefined || HasSeenSettings != true) {
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
            BdApi.Data.save(config.info.name, 'has_seen_settings', true);
            const panel = this.buildSettingsPanel();
            return panel.getElement();
		}
    };

};