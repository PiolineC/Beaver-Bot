'use strict';
const Filter = require('../filter.js');
const Promise = require('bluebird');
const request = require('request-promise');

const youtubeRegex = /(http(s)?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/(watch\?v=)?([^\s&?]+)/;
const datetimeRegex = /P(?:(\d+)Y)?(?:(\d+)M)?(?:(\d+)W)?(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?)?/;
const conversionFactors = [8760, 288, 168, 24]; //conversions for years, months, weeks, and days to hours

class YouTubePreviewer extends Filter {
    filter(msg) {
        if (!msg.body) return;
        const input = msg.body;
        const thread = msg.threadID;

        this.parseText(input).bind(this)
            .then(this.fetchVideoDetails)
            .then(output => this.api.sendMessage(output, thread))
            .catch(err => { if (err) console.error(err); });
    }

    parseText(input) {
        const url = youtubeRegex.exec(input);
        if (!url) return Promise.reject();
        return Promise.resolve(url[6]);
    }

    fetchVideoDetails(id) {
        return request(`https://www.googleapis.com/youtube/v3/videos?id=${id}&key=${this.config.googleAPIKey}&part=snippet,contentDetails`)
            .then(body => {
                const content = JSON.parse(body);
                const title = content.items[0].snippet.title;
                const duration = this.formatDuration(content.items[0].contentDetails.duration);
                return `Title: ${title}` + '\n' + `Duration: ${duration}`;
            });
    }

    formatDuration(duration) {
        const datetime = datetimeRegex.exec(duration);
        let hours = 0, minutes = 0, seconds = 0;

        for (let i = 1; i < 5; i++) {
            if (!datetime[i]) continue;
            let val = parseInt(datetime[i]);
            hours += val * conversionFactors[i - 1];
        }

        if (datetime[5]) hours += parseInt(datetime[5]);
        if (datetime[6]) minutes = parseInt(datetime[6]);
        if (datetime[7]) seconds = parseInt(datetime[7]) - 1; //compensate for rounding on Google's end

        if (seconds < 10) seconds = '0' + seconds;
        if (!hours) return `${minutes}:${seconds}`;

        if (minutes < 10) minutes = '0' + minutes;
        return `${hours}:${minutes}:${seconds}`;
    }
}

module.exports = YouTubePreviewer;
