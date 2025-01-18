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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.morning = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const morning_ollama_service_1 = __importDefault(require("../service/morning.ollama.service"));
const knowledge_json_1 = __importDefault(require("../../knowledge.json"));
dotenv_1.default.config();
const morning = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, e_1, _b, _c;
    const userInput = req.body.prompt;
    const ollamaUrl = process.env.OLLAMA_API_HOST;
    console.log(`Received request with input: ${userInput}`);
    console.log("here ", ollamaUrl);
    if (!ollamaUrl) {
        res.status(500).json({ error: "Ollama URL is not defined" });
        return;
    }
    const ollama = new morning_ollama_service_1.default(ollamaUrl);
    try {
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Transfer-Encoding', 'chunked');
        try {
            for (var _d = true, _e = __asyncValues(ollama.generate(userInput, knowledge_json_1.default)), _f; _f = yield _e.next(), _a = _f.done, !_a; _d = true) {
                _c = _f.value;
                _d = false;
                const chunk = _c;
                console.log(`Sending chunk: ${chunk} Chunk length: ${chunk.length}`);
                res.write(chunk);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (!_d && !_a && (_b = _e.return)) yield _b.call(_e);
            }
            finally { if (e_1) throw e_1.error; }
        }
        res.end();
    }
    catch (error) {
        res.status(500).json({ error: "Failed to stream AI response" });
    }
});
exports.morning = morning;
