import common from '../../lib/common/common.js';
import fetch from "node-fetch";
//QQ群：861646887
//GitHub：https://github.com/ovoox
//更多JS插件请访问GitHub
export class VideoParser extends plugin {
    constructor() {
        super({
            name: "视频解析类",
            description: "解析视频链接并返回视频",
            event: "message",
            priority: 0,
            rule: [
                {

                    reg: /^(#|\/)?快手解析.*$/,
                    fnc: "parseVideo",
                },
            ],
        });
    }

    async parseVideo(e) {

        const urlRegex = /https?:\/\/\S+/g;
        const allText = e.msg;
        const matches = allText.match(urlRegex);
        if (matches && matches.length > 0) {
            
            for (const matchedUrl of matches) {
                const videoUrl = `https://api.qster.top/API/v1/kuaishoujx/?url=${encodeURIComponent(matchedUrl)}`;

                try {
                    const response = await fetch(videoUrl);
                    const data = await response.json();

                    if (!data || !data.data || !Array.isArray(data.data)) {
                        await e.reply("视频解析失败，请检查链接是否有效。");
                        return;
                    }

                    
                    if (data.data.length > 0 && data.data[0].video_link) {
                        const videoLink = data.data[0].video_link;
                        await e.reply(segment.video(videoLink));
                    } else {
                        await e.reply("视频解析失败并没有找到相关链接");
                    }
                } catch (error) {
                    await e.reply("解析错误 请重试");
                }
            }
        } else {
            await e.reply("未检测到有效的视频链接。");
        }
    }
}
