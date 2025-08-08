import { pipeline } from '@huggingface/transformers';

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