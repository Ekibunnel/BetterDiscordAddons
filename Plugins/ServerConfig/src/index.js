
module.exports = (Plugin, Library) => {

    const {PluginUtilities} = Library;
    let dirtyDispatch = BdApi.findModuleByProps("dirtyDispatch");

    function ON_GUILD_CREATED(data){

        let settings = PluginUtilities.loadSettings(config.info.name);

        if(Object.keys(settings.notification).length > 0){
            BdApi.findModuleByProps("updateGuildNotificationSettings").updateGuildNotificationSettings(data.guild.id, settings.notification);
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