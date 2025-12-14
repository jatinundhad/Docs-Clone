const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const cors = require("cors");
const { PromptTemplate } = require("@langchain/core/prompts");
const { TogetherAI } = require("@langchain/community/llms/togetherai")

dotenv.config({ path: path.join(__dirname, ".env") });
const app = express();

const { PORT, PROMPT, GENERIC_RESPONSE, LLM_MODEL } = require(path.join(__dirname, "constants"));

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// All routes
app.post("/suggestion", async(req, res) => {
    try{
        // return res.json({status: false, response: "Temp"});
        const content = req.body.content;
        const prompt = PromptTemplate.fromTemplate(PROMPT);
        const llm = new TogetherAI({
            model: LLM_MODEL
        });
        const chain = prompt.pipe(llm);
        const response = await chain.invoke({
            content
        });
        return res.json(GENERIC_RESPONSE(true, response));
    }
    catch(err){
        console.log(err);
        return res.json(GENERIC_RESPONSE(false, "Error in getting AI suggestion"));
    }
});

app.listen(PORT, error => {
    if(!error){
        console.log("Server is successfully running at port: " + PORT);
    }
    else{
        console.log("Error occured, server can't start ", error);
    }
})