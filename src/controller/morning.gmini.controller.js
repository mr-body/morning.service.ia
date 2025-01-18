"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.morning = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const morning_gmini_service_1 = __importDefault(require("../service/morning.gmini.service"));
const knowledge_json_1 = __importDefault(require("../../knowledge.json"));
dotenv_1.default.config();
const morning = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userInput = req.body.prompt;
    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) {
        res.status(500).json({ error: "API key is not defined" });
        return;
    }
    const generateAIResponse = new morning_gmini_service_1.default(apiKey);
    try {
        const response = yield generateAIResponse.question(userInput, knowledge_json_1.default);
        console.log(response);
        res.status(200).json({ response });
    }
    catch (error) {
        res.status(500).json({ error: "Failed to generate AI response" });
    }
});
exports.morning = morning;
