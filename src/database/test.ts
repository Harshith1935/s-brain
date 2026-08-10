import dotenv from "dotenv";
dotenv.config();

import { supabase } from "../config/supabase";

async function test() {
  const { data, error } = await supabase
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