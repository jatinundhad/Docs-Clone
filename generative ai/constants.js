const PORT = 3002;

const PROMPT = `You are an assistant that helps users by continuing their content. The following is a snippet of text:

---
{content}
---

Based on this, please suggest the next part of the content that logically follows. Make sure the tone, style, and structure match the given text.
Make sure that you directly continue writing your next sentence in your response without writing irrelevant statements
Also note that no need to type the long text, please make the continuation very small
Continue writing:
`
const LLM_MODEL = "meta-llama/Llama-3.3-70B-Instruct-Turbo"

const GENERIC_RESPONSE = (status, response) => {
    return {
        status, response
    }
}

module.exports = {
    PORT,
    PROMPT,
    GENERIC_RESPONSE,
    LLM_MODEL
}