/**
 * @name PlayAllVideos
 * @author Peleret
 */
 
module.exports = (() => {
	const config = {
		info: {
			name: "PlayAllVideos",
			authors: [{name: "Peleret"}],
			version: "1.0.0",
			description: "Let's you play unsupported videos using HTML5 player"
		},
		defaultConfig: [
			{
				type: "textbox",
				id: "maxwidth",
				name: "Max Video Width",
				note: "How wide the player can get.",
				value: "720px"
			},{
				type: "textbox",
				id: "maxheight",
				name: "Max Video Height",
				note: "How tall the player can get.",
				value: "90vh"
			},{
				type: "switch",
				id: "savevol",
				name: "Save Volume Levels",
				note: "Don't reset volume level between videos",
				value: true
			}
		]
	};
	return !global.ZeresPluginLibrary ? class {
		load() {
			BdApi.showConfirmationModal("Library Missing", `The library plugin needed for ${config.info.name} is missing. Please click Download Now to install it.`, {
				confirmText: "Download Now",
				cancelText: "Cancel",
				onConfirm: () => {
					require("request").get("https://rauenzi.github.io/BDPluginLibrary/release/0PluginLibrary.plugin.js", async (error, response, body) => {
						if (error) return require("electron").shell.openExternal("https://betterdiscord.app/Download?id=9");
						await new Promise(r => require("fs").writeFile(require("path").join(BdApi.Plugins.folder, "0PluginLibrary.plugin.js"), body, r));
					});
				}
			});
		}
	} : (([Plugin, Api]) => {
		const plugin = (Plugin, Library) => {
			const { Patcher, React, Utilities } = BdApi;
			const Attachment = BdApi.findModule((m) => m.default?.displayName === "Attachment");
			const videoExtensions = ["webm", "mp4", "mkv", "hls", "mov", "mpeg4", "quicktime"];

			return class PlayAllVideos extends Plugin {
				async onStart() {
					this.patchVideos();
				}
				onStop() {
					Patcher.unpatchAll(config.info.name);
				}
				getSettingsPanel() {
					return this.buildSettingsPanel().getElement();
				}
				
				async patchVideos() {
					Patcher.after(
						config.info.name,
						Attachment,
						"default",
						(_, info, div) => {
							const fileUrl = info[0].url;
							
							if(!videoExtensions.some((e) => {
								return fileUrl.toLowerCase().endsWith(e);
							})) return;
							
							let video = this.settings.savevol
								? React.createElement("video", {src: fileUrl, controls: " ", playsinline: "", preload: "metadata", className: "loadVol", style: {width: "min(100%,"+this.settings.maxwidth+")","max-height": this.settings.maxheight}})
								: React.createElement("video", {src: fileUrl, controls: " ", playsinline: "", preload: "metadata", style: {width: "min(100%,"+this.settings.maxwidth+")","max-height": this.settings.maxheight}});
							
							div.props.children = video;
							div.props.className = ""; //Remove unnecessary classes that limit max width
							
							for(const element of document.getElementsByClassName('loadVol')){
								element.className = ""; //Prevent elements from being looped over in the future
								element.volume = BdApi.loadData(config.info.name,"volume") || 1;
								element.addEventListener("volumechange",(e)=>{
									BdApi.saveData(config.info.name,"volume",e.target.volume);
								})
							}
						}
					);
				}
			};
		};
		return plugin(Plugin, Api);
	})(global.ZeresPluginLibrary.buildPlugin(config));
})();

