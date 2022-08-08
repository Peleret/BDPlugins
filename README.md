# PlayAllVideos

The plugin let's you play any video that chromium supports<br/>
Tested containers: mkv, mp4, webm, hls, mov, mpeg4, quicktime<br/>
Tested codecs: AV1<br/>

I wanted to be able to share AV1 encoded videos on discord but they just refuse to support it for some reason, even though discord runs on electron which runs on chromium and chromium supports AV1 playback.<br/>
This plugin was mostly written by me, but since I don't know the API fully yet I used [TheGreenPig's plugin](https://github.com/TheGreenPig/BetterDiscordPlugins/tree/main/FileViewer) as reference for how to select only attachments.<br/>

## How does it work?
The plugin starts by reading names of all currently loaded attachment messages in the channel that weren't already playable by discord and checks if their names end with .mkv or other supported container. If they do, the plugin replaces the \<a> tag (download button) that links to the file with \<video> tag that let's you play that file.<br/>

There's also support for saving volume levels, since by default, all videos play at max volume (volume level is saved in settings file).<br/>
You can modify the max width and heigt of video as well as disable volume saving in settings.
