import common from '../../lib/common/common.js';
import fetch from "node-fetch";
//作者：知鱼
//博客：http://ocoa.cn
//QQ群：861646887
//GitHub：https://github.com/ovoox
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
                        await e.reply("视频解析失败，未找到视频资源。");
                    }
                } catch (error) {
                    await e.reply("解析过程中出现错误，请稍后再试。");
                }
            }
        } else {
            await e.reply("未检测到有效的视频链接。");
        }
    }
}
