const fetch = require("node-fetch"); // do wysyłania zapytań HTTP
const crypto = require("crypto");    // do generowania podpisu SHA384

exports.handler = async (event) => {
  try {
    // 📩 Odbierz dane z frontendu (koszyk i suma)
    const { cart, total } = JSON.parse(event.body);

    // 🔹 Dane testowe Przelewy24 (weź z panelu Sandbox)
    const merchantId = 12345; // ID sprzedawcy
    const posId = 12345;      // POS ID (zwykle takie samo)
    const crc = "TWÓJ_CRC_TESTOWY"; // CRC z panelu
    const sessionId = `sess_${Date.now()}`; // unikalny ID transakcji
    const amount = Math.round(total * 100); // kwota w groszach

    // 🔹 Generowanie podpisu SHA384 (zgodnie z dokumentacją P24)
    const sign = crypto
      .createHash("sha384")
      .update(`${sessionId}|${merchantId}|${amount}|PLN|${crc}`)
      .digest("hex");

    // 🔹 Wyślij żądanie do API Przelewy24
    const response = await fetch("https://sandbox.przelewy24.pl/api/v1/transaction/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Basic " + Buffer.from(`${posId}:${crc}`).toString("base64")
      },
      body: JSON.stringify({
        merchantId,
        posId,
        sessionId,
        amount,
        currency: "PLN",
        description: "Zakupy w sklepie",
        email: "klient@test.pl",
        country: "PL",
        language: "pl",
        sign,
        urlReturn: "https://twojastrona.pl/sukces",
        urlStatus: "https://twojastrona.pl/status"
      })
    });

    const data = await response.json();

    return {
      statusCode: 200,
      body: JSON.stringify({
        redirectUrl: `https://sandbox.przelewy24.pl/trnRequest/${data.data.token}`
      })
    };

  } catch (error) {
    console.error(error);
    return { statusCode: 500, body: JSON.stringify({ error: "Błąd płatności" }) };
  }
};
