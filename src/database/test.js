"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const supabase_1 = require("../config/supabase");
async function test() {
    const { data, error } = await supabase_1.supabase
        .from("customers")
        .insert([
        {
            name: "Harshith",
            phone: "919999999999",
            language: "ENGLISH"
        }
    ])
        .select();
    console.log("DATA:", data);
    console.log("ERROR:", error);
}
test();
//# sourceMappingURL=test.js.map