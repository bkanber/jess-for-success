import express from 'express';
import {authenticate} from '@google-cloud/local-auth';
import {google} from 'googleapis';
import path from 'path';
import fs from 'fs/promises';

const router = express.Router();

const SCOPES = ['https://www.googleapis.com/auth/gmail.readonly'];
const TOKEN_PATH = path.join(process.cwd(), '.gcp-token.json');
const CREDENTIALS_PATH = path.join(process.cwd(), '.gcp-credentials.json');

async function saveCredentials(client) {
    const content = await fs.readFile(CREDENTIALS_PATH);
    const keys = JSON.parse(content);
    const key = keys.installed || keys.web;
    const payload = JSON.stringify({
        type: 'authorized_user',
        client_id: key.client_id,
        client_secret: key.client_secret,
        refresh_token: client.credentials.refresh_token,
    });
    await fs.writeFile(TOKEN_PATH, payload);
}
async function loadSavedCredentialsIfExist() {
    try {
        const content = await fs.readFile(TOKEN_PATH);
        const credentials = JSON.parse(content);
        return google.auth.fromJSON(credentials);
    } catch (err) {
        return null;
    }
}
async function authorize() {
    let client = await loadSavedCredentialsIfExist();
    if (client) {
        return client;
    }
    client = await authenticate({
        scopes: SCOPES,
        keyfilePath: CREDENTIALS_PATH,
    });
    if (client.credentials) {
        await saveCredentials(client);
    }
    return client;
}
router.get('/authorize', async (req, res) => {
    console.log("CREDENTIALS_PATH:", CREDENTIALS_PATH);
    let client = await authorize();
    return res.json({
        success: true,
        message: 'Authorized successfully',
        client: {
            tokenPath: TOKEN_PATH,
            credentialsPath: CREDENTIALS_PATH,
            clientId: client._clientId,
            scopes: client._scopes,
            client: client
        },
    });
});
router.get('/emails', async (req, res) => {
    try {
        let output = [];
        const auth = await authorize();
        const gmail = google.gmail({version: 'v1', auth});
        const response = await gmail.users.messages.list({
            userId: 'me',
            maxResults: 10,
            labelIds: ['CATEGORY_PROMOTIONS']
        });
        const messages = response.data.messages || [];
        for (const message of messages) {
            const msg = await gmail.users.messages.get({
                userId: 'me',
                id: message.id,
                format: 'full'
            });
            const headers = msg.data.payload.headers || [];
            const subjectHeader = headers.find(h => h.name === 'Subject');
            const fromHeader = headers.find(h => h.name === 'From');
            output.push({
                id: message.id,
                threadId: message.threadId,
                subject: subjectHeader ? subjectHeader.value : 'No Subject',
                from: fromHeader ? fromHeader.value : 'Unknown Sender',
                snippet: msg.data.snippet,
            });
        }
        return res.json(output);
    } catch (error) {
        console.error('Error fetching emails:', error);
        return res.status(500).json({error: 'Failed to fetch emails'});
    }
});
router.get('/labels', async (req, res) => {
    try {
        const auth = await authorize();
        const gmail = google.gmail({version: 'v1', auth});
        const response = await gmail.users.labels.list({
            userId: 'me',
        });
        const labels = response.data.labels || [];
        return res.json(labels);
    } catch (error) {
        console.error('Error fetching labels:', error);
        return res.status(500).json({error: 'Failed to fetch labels'});
    }
});
export default router;