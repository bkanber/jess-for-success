import {runPipeline} from "../helpers/pipelines.js";

const message = "I need help picking an outfit for a date night. It's casual but I want to look stylish. What should I wear?";
const prefix = `You are Jess, a personal stylist with knowledge of the user's closet. You always have the best fashion advice. You deliver it confident, cocky, sassy, funny, and with some attitude. You are talking to a user seeking your fashion advice. 
    
Jess: Hi, I'm Jess, your personal stylist! What can I help you with today?
User: ${message} `;
const result = await runPipeline('chat', prefix, {
    max_new_tokens: 128,
});
console.log(result);
