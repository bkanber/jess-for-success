import { pipeline } from '@huggingface/transformers';
import {CLOTHING_TYPES, COLOR_NAMES, CLOTHING_PATTERNS} from '../../shared/taxonomy.js';

/**
 * This helper wraps @huggingface/transformers pipeline models.
 */
export const PIPELINE_MODELS = {
    'image-classification': {
        pipeline: 'image-classification',
        model: null,
    },
    'zero-shot-image-classification': {
        pipeline: 'zero-shot-image-classification',
        model: null,
    },
    'image-tagger': {
        pipeline: 'zero-shot-image-classification',
        model: null,
    },
    'image-to-text': {
        pipeline: 'image-to-text',
        model: 'Xenova/vit-gpt2-image-captioning',
    },
    'chat': {
        pipeline: 'text-generation',
        model: 'onnx-community/gemma-3-1b-it-ONNX',
    }
};

const pipelines = {};

export async function loadPipelineModel(key) {
    if (!PIPELINE_MODELS[key]) {
        throw new Error(`Pipeline model ${key} is not defined`);
    }
    const modelConfig = PIPELINE_MODELS[key];
    pipelines[key] = await pipeline(
        modelConfig.pipeline,
        modelConfig.model,
        {
            progress_callback: modelConfig.progress_callback ? modelConfig.progress_callback : ((progress) => {
                if (progress.progress) {
                    console.log(`Loading pipeline model (${modelConfig.model}): ${progress.progress.toFixed(2)}%`);
                }
            })
        }
    );
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

export async function runPipeline(name, input, options = {}) {
    const pipeline = await getPipeline(name);
    if (!pipeline) {
        throw new Error(`Pipeline ${name} is not loaded`);
    }
    return await pipeline(input, options);
}

const TASKS = {
    'image': async (blob, opts={}) => {
        const optTagLimit = opts.tagLimit || 100;
        const optTagMinScore = opts.tagMinScore || 0.0;

        const caption = await runPipeline('image-to-text', blob);
        const classification = await runPipeline('image-classification', blob);
        const zTypes = await runPipeline('image-tagger', blob, CLOTHING_TYPES);
        const zColors = await runPipeline('image-tagger', blob, COLOR_NAMES);
        const zPatterns = await runPipeline('image-tagger', blob, CLOTHING_PATTERNS);

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