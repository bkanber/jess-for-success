import {clampImage, makePayloadFromFile} from './autoImageTagger';
import sharp from 'sharp';


describe("clampImage", () => {
    test("should throw error for invalid buffer", async () => {
        await expect(clampImage(null)).rejects.toThrow('Invalid buffer provided');
        await expect(clampImage("not a buffer")).rejects.toThrow('Invalid buffer provided');
    });
    test("should clamp large images", async () => {
        const input = sharp({
            create: {
                width: 2000,
                height: 1600,
                channels: 3,
                background: { r: 255, g: 0, b: 0 },
            },
        }).png();
        const buffer = await input.toBuffer();
        const clampedBuffer = await clampImage(buffer, 1024);
        const metadata = await sharp(clampedBuffer).metadata();
        expect(metadata.width).toBeLessThanOrEqual(1024);
        expect(metadata.height).toBeLessThanOrEqual(1024);
    });
    test("should not modify small images", async () => {
        const input = sharp({
            create: {
                width: 800,
                height: 600,
                channels: 3,
                background: { r: 0, g: 255, b: 0 },
            },
        }).png();
        const buffer = await input.toBuffer();
        const clampedBuffer = await clampImage(buffer, 1024);
        const metadata = await sharp(clampedBuffer).metadata();
        expect(metadata.width).toBe(800);
        expect(metadata.height).toBe(600);
    });
});

describe("makePayloadFromFile", () => {
    test("it should contain a data url of the clamped image", async () => {
        const input = sharp({
            create: {
                width: 2000,
                height: 1600,
                channels: 3,
                background: { r: 255, g: 0, b: 0 },
            },
        }).png();
        const buffer = await input.toBuffer();
        const file = { buffer, mimetype: 'image/png' };

        const payload = await makePayloadFromFile(file);

        expect(payload).toBeDefined();
        expect(payload.input[0].content[1].image_url).toMatch(/^data:image\/png;base64,/);
    });
});