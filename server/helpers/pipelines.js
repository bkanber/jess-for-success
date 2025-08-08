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
        const classifier = await getPipeline('image-classification');
        const zeroShotClassifier = await getPipeline('zero-shot-image-classification');
        const captioner = await getPipeline('image-to-text');

        const caption = await captioner(blob);
        const classification = await classifier(blob);
        const zeroShotClassification = await zeroShotClassifier(blob, CLOTHING_TYPES, {multi_label: true});

        return {
            caption: caption[0]?.generated_text || 'No caption generated',
            classification: classification || [],
            zeroShotClassification: zeroShotClassification || []
        }
    }

};

export async function runTask(taskName, input, options = {}) {
    if (!TASKS[taskName]) {
        throw new Error(`Task ${taskName} is not defined`);
    }
    return await TASKS[taskName](input, options);
}