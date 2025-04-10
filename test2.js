const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;

app.post("/ussd", (req, res) => {
    let { text } = req.body;

    // Handle back and main menu logic
    const originalInput = text.split("*");
    let input = [...originalInput];

    // Main menu (00) → reset to no input
    if (input[input.length - 1] === "00") {
        input = [];
    }
    // Back (0) → remove last entry
    else if (input[input.length - 1] === "0") {
        input.pop(); // remove the '0'
        input.pop(); // remove previous selection
    }

    const lang = input[0];
    let response = "";

    if (input.length === 0) {
        response = `CON Welcome to LocalLang\nChoose Language:
1. Kiswahili
2. Kikuyu
3. Luo
4. Kamba`;
    }

    // Language selected
    else if (input.length === 1) {
        switch (lang) {
            case "1":
                response = `CON Karibu LocalLang\nChagua Huduma:
1. Fedha
2. Afya
3. Kilimo
4. Usafiri
0. Rudi
00. Mwanzo`;
                break;
            case "2":
                response = `CON Wîhîî LocalLang\nTogora Mûtugo:
1. Wîra wa Mbeca
2. Mûtugo wa Thibitari
3. Wîra wa Mbembe
4. Mûtugo wa Mathîna
0. Rîa
00. Rîa rwa mbere`;
                break;
            case "3":
                response = `CON Bwakeni e LocalLang\nYer wach mar tich:
1. Mbesa
2. Chenro
3. Weche mag pokoth
4. Yiengni
0. Dwar Duto
00. Chako Duto`;
                break;
            case "4":
                response = `CON Wîî Kîla LocalLang\nTavanya Mbesa:
1. Mbesa
2. Muthee
3. Kilimo
4. Usafiri
0. Kîvî
00. Mûsyau wa Mbee`;
                break;
            default:
                response = `END Invalid language choice.`;
        }
    }

    // Service selected
    else if (input.length === 2) {
        const service = input[1];

        if (lang === "1") {
            switch (service) {
                case "1":
                    response = `CON Huduma za Fedha:\n1. Tuma Pesa\n2. Toa Pesa\n3. Nunua Airtime\n0. Rudi\n00. Mwanzo`;
                    break;
                case "2":
                    response = `CON Huduma za Afya:\n1. Panga Kliniki\n2. Angalia NHIF\n3. Vidokezo vya Dharura\n0. Rudi\n00. Mwanzo`;
                    break;
                case "3":
                    response = `CON Kilimo:\n1. Bei Sokoni\n2. Mbinu za Kupanda\n3. Hali ya Hewa\n0. Rudi\n00. Mwanzo`;
                    break;
                case "4":
                    response = `CON Usafiri:\n1. Nauli\n2. Ramani ya Njia\n3. Leseni ya Kuendesha\n0. Rudi\n00. Mwanzo`;
                    break;
                default:
                    response = `END Chaguo si sahihi.`;
            }
        } else if (lang === "2") {
            switch (service) {
                case "1":
                    response = `CON Wîra wa Mbeca:\n1. Tuma Mbeca\n2. Tora Mbeca\n3. Gura Airtime\n0. Rîa\n00. Rîa rwa mbere`;
                    break;
                case "2":
                    response = `CON Thibitari:\n1. Andîkîra Clinic\n2. Thîna wa NHIF\n3. Maitho ma Ng'endo\n0. Rîa\n00. Rîa rwa mbere`;
                    break;
                case "3":
                    response = `CON Mbembe:\n1. Bei ya Cîrîa\n2. Mîhûgo ya Kûmenya\n3. Wendo wa Ngai\n0. Rîa\n00. Rîa rwa mbere`;
                    break;
                case "4":
                    response = `CON Mathîna:\n1. Kîrîa Matatu\n2. Rûgendo Map\n3. Leseni ya Driver\n0. Rîa\n00. Rîa rwa mbere`;
                    break;
                default:
                    response = `END Togora tawe.`;
            }
        } else if (lang === "3") {
            switch (service) {
                case "1":
                    response = `CON Mbesa:\n1. Oro Mbesa\n2. Ng'ado Mbesa\n3. Nyuolo Airtime\n0. Dwar Duto\n00. Chako Duto`;
                    break;
                case "2":
                    response = `CON Chenro:\n1. Yiero Clinic\n2. Ango NHIF\n3. Konyru e Thoth\n0. Dwar Duto\n00. Chako Duto`;
                    break;
                case "3":
                    response = `CON Weche mag Pokoth:\n1. Ratiro Margi\n2. Tim Kodo\n3. Wek Higni\n0. Dwar Duto\n00. Chako Duto`;
                    break;
                case "4":
                    response = `CON Yiengni:\n1. Pesa Matatu\n2. Map Mar Yo\n3. Jariso Janyiero\n0. Dwar Duto\n00. Chako Duto`;
                    break;
                default:
                    response = `END Nyiso ma ok en adier.`;
            }
        } else if (lang === "4") {
            switch (service) {
                case "1":
                    response = `CON Mbesa:\n1. Tuma Mbesa\n2. Twaa Mbesa\n3. Nunua Airtime\n0. Kîvî\n00. Mûsyau wa Mbee`;
                    break;
                case "2":
                    response = `CON Muthee:\n1. Ita Kliniki\n2. Angalia NHIF\n3. Maelezo ya Dharura\n0. Kîvî\n00. Mûsyau wa Mbee`;
                    break;
                case "3":
                    response = `CON Kilimo:\n1. Bei ya Soko\n2. Mbinu za Kupanda\n3. Hali ya Anga\n0. Kîvî\n00. Mûsyau wa Mbee`;
                    break;
                case "4":
                    response = `CON Usafiri:\n1. Nauli\n2. Ramani ya Njia\n3. Leseni ya Kuendesha\n0. Kîvî\n00. Mûsyau wa Mbee`;
                    break;
                default:
                    response = `END Chaguo sî chîa.`;
            }
        } else {
            response = `END Invalid language.`;
        }
    }

    // Final instruction
    else if (input.length === 3) {
        response = `END Asante! Maelezo/Instructions zimetumwa kulingana na huduma uliyopokea.`;
    }

    // Fallback
    else {
        response = `END Invalid input. Try again.`;
    }

    res.set("Content-Type", "text/plain");
    res.send(response);
});

app.listen(PORT, () => {
    console.log(`USSD server running on port ${PORT}`);
});
