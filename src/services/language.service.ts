import { saveLanguage } from "./customer.service";

export function detectLanguage(message: string) {

    const text = message.trim().toLowerCase();

    // English options
    if (
        text === "english" ||
        text === "eng" ||
        text === "e" ||
        text === "1"
    ) {
        return "english";
    }

    // Kannada options
    if (
        text === "kannada" ||
        text === "ಕನ್ನಡ" ||
        text === "kan" ||
        text === "k" ||
        text === "2"
    ) {
        return "kannada";
    }

    return null;
}

export function setCustomerLanguage(
    phone: string,
    language: "english" | "kannada"
) {

    saveLanguage(phone, language);

}