import common from '../../lib/common/common.js';
import fetch from "node-fetch";

export class VideoParser extends plugin {
    constructor() {
        super({
            name: "视频解析类",
            description: "解析视频链接并返回视频",
            event: "message",
            priority: 0,
            rule: [
                {
                    
                    reg: /^(#|\/)?抖音解析.*$/,
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
                const videoUrl = `https://api.pearktrue.cn/api/video/douyin/?url=${encodeURIComponent(matchedUrl)}`;

                try {
                    const response = await fetch(videoUrl);
                    const data = await response.json();

                    if (!data || !data.data) {
                        await e.reply("视频解析失败，请检查链接是否有效。");
                        return;
                    }

                    
                    if (data.code === 200 && data.data && data.data.url) {
                        const url = data.data.url; 
                        await e.reply(segment.video(url));
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
