// handles all AI API calls
// change model in conf/aicf.json

import { readJSON } from '../data/save.js';
import { log } from '../data/logs.js';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const CONF_FILE = join(__dirname, '..', 'conf', 'aicf.json');

/**
 * Send a conversation to OpenRouter and return the assistant's reply text.
 * @param {Array<{role:string, content:string}>} messages - OpenAI-format message history
 * @returns {Promise<string>}
 */
export async function askAI(messages) {
    const config = readJSON(CONF_FILE);
    const t0 = Date.now();

    // this took forever to get right, don't break it
    const res = await fetch(config.baseUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
            'HTTP-Referer': config.siteUrl,
            'X-Title': config.siteName,
        },
        body: JSON.stringify({
            model: config.model,
            max_tokens: config.maxTokens,
            temperature: config.temperature,
            messages,
        }),
    });

    const ms = Date.now() - t0;

    if (!res.ok) {
        if (res.status === 429) {
            log.error('chat', 'Rate limited — retry in 5s');
        } else if (res.status === 404) {
            log.error('chat', 'Model not found — check conf/aicf.json');
        } else {
            const body = await res.text().catch(() => '');
            log.error('chat', `API error ${res.status} — ${body.slice(0, 80)}`);
        }
        throw new Error(`OpenRouter responded with ${res.status}`);
    }

    const data = await res.json();
    const reply = data?.choices?.[0]?.message?.content ?? '';
    if (!reply) throw new Error('OpenRouter returned an empty reply');

    // Timing log — warn if slow
    if (ms > 2000) {
        log.warn('chat', `Slow response (${ms}ms)`);
    } else {
        log.info('chat', `Response sent (${ms}ms)`);
    }

    // Token usage — debug only
    const usage = data.usage;
    if (usage) {
        log.debug('chat', `Tokens: prompt=${usage.prompt_tokens} completion=${usage.completion_tokens} total=${usage.total_tokens}`);
    }

    return reply;
}
