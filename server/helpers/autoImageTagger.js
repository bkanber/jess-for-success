import OpenAI from 'openai';
import sharp from 'sharp';
import {CLOTHING_TYPES, COLOR_NAMES, CLOTHING_PATTERNS} from '../../shared/taxonomy.js';
const openai = new OpenAI();

/**
 * List of tool functions for the auto image tagger.
 */
export const TOOL_FUNCTIONS = [
    {
        type: "function",
        name: "tag_image",
        description: "Inspect an image of clothing or jewelry and return a caption, name, and various tags and attributes about the item.",
        parameters: {
            type: "object",
            properties: {
                name: {
                    type: "string",
                    description: "A short descriptive name for the item, such as 'Red Striped Shirt' or 'Blue Floral Dress'.",
                },
                caption: {
                    type: "string",
                    description: "A medium-length caption describing the item in detail, such as 'A stylish red striped shirt perfect for summer, with ruffles and a built-in back strap.'",
                },
                vibe: {
                    type: "string",
                    description: "A short caption describe the vibe or style of the item. For example, 'manic pixie dream-girl aesthetic'."
                },
                type: {
                    type: "string",
                    description: "The type of item being displayed, such as 'shirt', 'dress', 'jewelry', etc.",
                    enum: CLOTHING_TYPES,
                },
                color: {
                    type: "string",
                    description: "The primary color or colors of the item, such as 'red', 'blue', 'green', etc.",
                    enum: COLOR_NAMES,
                },
                pattern: {
                    type: "string",
                    description: "The pattern of the item, such as 'striped', 'polka dot', 'floral', etc.",
                    enum: CLOTHING_PATTERNS,
                }
            },
            required: [
                "name",
                "caption",
                "vibe",
                "type",
                "color",
                "pattern"
            ],
            additionalProperties: false
        },
        strict: true,
    }
];

export async function clampImage(buffer, maxDim = 1024) {
    if (!buffer || !Buffer.isBuffer(buffer)) {
        throw new Error('Invalid buffer provided');
    }
    let image = sharp(buffer);
    const metadata = await image.metadata();
    if (!['jpeg', 'png', 'webp', 'gif'].includes(metadata.format)) {
        throw new Error('Unsupported image format');
    }
    // Resize if needed
    if (metadata.width > maxDim || metadata.height > maxDim) {
        image = image.resize({
            width: maxDim,
            height: maxDim,
            fit: 'inside',
        });
    }
    return await image.toBuffer();
}

export async function makePayloadFromFile(file) {
    if (!file || !file.buffer) {
        throw new Error('Invalid file object');
    }

    const clampedBuffer = await clampImage(file.buffer);
    const asDataUrl = `data:${file.mimetype};base64,${clampedBuffer.toString('base64')}`;

    const payload = {
        model: 'gpt-4.1-mini',
        input: [
            {
                role: 'user',
                content: [
                    { type: 'input_text', text: 'Describe the content of this image focusing on fashion attributes' },
                    { type: 'input_image', image_url: asDataUrl }
                ]
            }
        ],
        tools: TOOL_FUNCTIONS,
        tool_choice: 'required',
    };

    return payload;
}

export async function fetchTags(file) {
    const payload = await makePayloadFromFile(file);
    const response = await openai.chat.completions.create(payload);

    if (response.choices && response.choices.length > 0) {
        const toolCall = response.choices[0].message.tool_calls[0];
        if (toolCall && toolCall.function && toolCall.function.name === 'tag_image') {
            return toolCall.function.arguments;
        }
    }
    throw new Error('No valid tagging response received');
}