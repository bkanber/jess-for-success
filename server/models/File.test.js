import Models from './index.js';
import sharp from 'sharp';

describe("File model", () => {

    test("data setter should convert string to buffer", async () => {
        const file = await Models.File.build({});
        const data = "This is a test string";
        file.data = data;
        expect(file.data).toBeInstanceOf(Buffer);
        expect(file.data.toString('utf8')).toBe(data);
    });

    test("data setter should handle blobs", async () => {
        const file = await Models.File.build({});
        const img = sharp({
            create: {
                width: 10,
                height: 10,
                channels: 3,
                background: { r: 255, g: 0, b: 0 }
            }
        }).png();
        const buffer = await img.toBuffer();
        file.data = buffer;
        expect(file.data).toBeInstanceOf(Buffer);
        expect(file.data.equals(buffer)).toBe(true);
    });

    test("File.upload should correctly read png data", async () => {
        const img = sharp({
            create: {
                width: 10,
                height: 10,
                channels: 3,
                background: { r: 255, g: 0, b: 0 }
            }
        }).png();
        const account = await Models.Account.create({
            login: 'testuser',
        });
        const buffer = await img.toBuffer();
        const file = await Models.File.upload(buffer, { accountId: account.id });
        expect(file).toBeDefined();
        expect(file.name).toMatch(/\.png$/);
        expect(file.size).toBeGreaterThan(0);
        expect(file.type).toBe('image/png');
        expect(file.data).toBeInstanceOf(Buffer);
        const fileData = file.data;
        const metadata = await sharp(fileData).metadata();
        expect(metadata.format).toBe('png');
    });

});