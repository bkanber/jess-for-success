import { pipeline } from '@huggingface/transformers';
export const CLOTHING_TYPES = [
    't-shirt', 'shirt', 'jeans', 'dress', 'skirt',
    'shorts', 'jacket', 'coat', 'sweater', 'hoodie',
    'sweatshirt', 'blouse', 'tank top', 'polo shirt',
    'suit', 'blazer', 'vest', 'trousers', 'leggings',
    'cargo pants', 'cargo shorts', 'bikini', 'swimsuit',
    'swim trunks', 'underwear', 'boxers', 'briefs',
    'bra', 'panties', 'socks', 'stockings', 'tights',
    'scarf', 'hat', 'beanie', 'cap', 'gloves',
    'belt', 'tie', 'bow tie', 'suspenders', 'pajamas',
    'robe', 'slippers', 'sandals', 'sneakers', 'boots',
    'heels', 'flats', 'loafers', 'oxfords',
    'clogs', 'moccasins', 'espadrilles', 'wedges',
    'platform shoes', 'dress shoes', 'running shoes',
    'button-up shirt', 'cargo jacket', 'windbreaker',
    'parka', 'anorak', 'trench coat', 'raincoat',
    'bomber jacket', 'denim jacket', 'leather jacket',
];
export const COLOR_NAMES = [
    'red', 'green', 'blue', 'yellow', 'orange',
    'purple', 'pink', 'brown', 'black', 'white',
    'gray', 'silver', 'gold', 'beige', 'cyan',
    'magenta', 'teal', 'navy', 'maroon', 'olive',
    'turquoise', 'lavender', 'peach', 'coral', 'indigo',
    'violet', 'lime', 'mint', 'chocolate', 'tan',
    'cream', 'ivory', 'bronze', 'charcoal', 'burgundy',
    'plum', 'fuchsia', 'apricot', 'amber', 'emerald',
    'sapphire', 'ruby', 'topaz', 'pearl', 'onyx',
    'jade', 'aquamarine', 'crimson', 'orchid',
    'sepia', 'slate', 'taupe', 'blush', 'caramel',
    'mustard', 'cobalt', 'cerulean', 'chartreuse', 'periwinkle',
    'sienna', 'ash', 'smoke', 'chocolate', 'cinnamon',
    'copper', 'platinum', 'brass', 'sage', 'fern',
    'moss', 'spruce', 'pine', 'cedar', 'mahogany',
    'walnut', 'ebony', 'maple', 'birch', 'oak',
    'teak', 'bamboo', 'driftwood'
];
export const CLOTHING_PATTERNS = [
    'solid', 'striped', 'plaid', 'checkered', 'polka dot',
    'floral', 'paisley', 'geometric', 'animal print', 'camouflage',
    'tie-dye', 'argyle', 'herringbone', 'houndstooth', 'chevron',
    'gingham', 'batik', 'ikat', 'damask', 'brocade',
    'embroidery', 'lace', 'sequin', 'glitter', 'metallic',
    'ombre', 'gradient', 'color block', 'abstract', 'tropical',
    'bohemian', 'tribal', 'vintage', 'retro', 'art deco',
    'tartan', 'celtic', 'nautical', 'western', 'gothic',
    'punk', 'grunge', 'steampunk', 'futuristic'
];

/**
 * This helper wraps @huggingface/transformers pipeline models.
 */
export const PIPELINE_MODELS = {
    'image-classification': {
        name: 'image-classification',
        model: null,
        progress_callback: (progress) => {
            if (progress.progress) {
                console.log(`Loading classifier (${progress.file}): ${progress.progress.toFixed(2)}%`);
            }
        }
    },
    'zero-shot-image-classification': {
        name: 'zero-shot-image-classification',
        model: null,
        progress_callback: (progress) => {
            if (progress.progress) {
                console.log(`Loading 0-shot classifier (${progress.file}): ${progress.progress.toFixed(2)}%`);
            }
        }
    },
    'image-to-text': {
        name: 'image-to-text',
        model: 'Xenova/vit-gpt2-image-captioning',
        progress_callback: (progress) => {
            if (progress.progress) {
                console.log(`Loading captioner (${progress.file}): ${progress.progress.toFixed(2)}%`);
            }
        }
    }

};

const pipelines = {};

export async function loadPipelineModel(key) {
    if (!PIPELINE_MODELS[key]) {
        throw new Error(`Pipeline model ${key} is not defined`);
    }
    const modelConfig = PIPELINE_MODELS[key];
    pipelines[key] = await pipeline(modelConfig.name, modelConfig.model, {
        progress_callback: modelConfig.progress_callback || (() => {}),
    });
    console.log(`Pipeline model ${key} loaded successfully`);
    return pipelines[key];
}

export async function loadPipelineModels() {
    for (const key in PIPELINE_MODELS) {
        await loadPipelineModel(key);
    }
    return pipelines;
}

export async function getPipeline(name) {
    if (!pipelines[name]) {
        await loadPipelineModel(name);
    }
    if (!pipelines[name]) {
        throw new Error(`Pipeline model ${name} is not loaded`);
    }
    return pipelines[name];
}

const TASKS = {
    'image': async (blob, opts={}) => {
        const optTagLimit = opts.tagLimit || 100;
        const optTagMinScore = opts.tagMinScore || 0.0;

        const classifier = await getPipeline('image-classification');
        const zeroShotClassifier = await getPipeline('zero-shot-image-classification');
        const captioner = await getPipeline('image-to-text');

        const caption = await captioner(blob);
        const classification = await classifier(blob);
        const zTypes = await zeroShotClassifier(blob, CLOTHING_TYPES, {multi_label: true});
        const zColors = await zeroShotClassifier(blob, COLOR_NAMES, {multi_label: true});
        const zPatterns = await zeroShotClassifier(blob, CLOTHING_PATTERNS, {multi_label: true});

        const toTags = items => items
                .filter(item => item.score >= optTagMinScore)
                .sort((a, b) => b.score - a.score)
                .slice(0, optTagLimit);

        return {
            caption: caption[0]?.generated_text || 'No caption generated',
            classification: classification || [],
            tags: {
                types: toTags(zTypes),
                colors: toTags(zColors),
                patterns: toTags(zPatterns),
            }
        }
    }

};

export async function runTask(taskName, input, options = {}) {
    if (!TASKS[taskName]) {
        throw new Error(`Task ${taskName} is not defined`);
    }
    return await TASKS[taskName](input, options);
}