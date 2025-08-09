import Models from './index.js';

describe("Account Model", () => {
    test("throws exception when trying to create with password", async () => {
        expect(() => {
            Models.Account.build({
                login: "testuser",
                password: "plaintextpassword",
            });
        }).toThrow("Use setPassword method to set password");
    });
    test("throws exception when setting password directly", async () => {
        const account = Models.Account.build({
            login: "testuser",
        });
        expect(() => {
            account.password = "plaintextpassword";
        }).toThrow("Use setPassword method to set password");
    });
    test("sets password using setPassword method", async () => {
        const account = Models.Account.build({
            login: "testuser",
        });
        await account.setPassword("plaintextpassword");
        expect(account.password).toBeDefined();
        expect(account.password).not.toBe("plaintextpassword"); // Should be hashed
    });
    test("setting password creates an $argon2id hash", async () => {
        const account = Models.Account.build({
            login: "testuser",
        });
        await account.setPassword("plaintextpassword");
        expect(account.password).toMatch(/^\$argon2id\$/); // Check if it starts with $argon2id$
    });
    test("verifyPassword returns true for correct password", async () => {
        const account = Models.Account.build({
            login: "testuser",
        });
        await account.setPassword("plaintextpassword");
        const isValid = await account.verifyPassword("plaintextpassword");
        expect(isValid).toBe(true);
    });
    test("verifyPassword returns false for incorrect password", async () => {
        const account = Models.Account.build({
            login: "testuser",
        });
        await account.setPassword("plaintextpassword");
        const isValid = await account.verifyPassword("wrongpassword");
        expect(isValid).toBe(false);
    });
    test("verifyPassword returns false if password is not set", async () => {
        const account = Models.Account.build({
            login: "testuser",
        });
        const isValid = await account.verifyPassword("plaintextpassword");
        expect(isValid).toBe(false);
    });
});