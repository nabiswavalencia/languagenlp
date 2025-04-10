const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;

// Track user session state
const sessions = {};

app.post("/ussd", (req, res) => {
    const { sessionId, phoneNumber, text } = req.body;
    let response = "";
    
    // Initialize or get session
    if (!sessions[sessionId]) {
        sessions[sessionId] = {
            phoneNumber,
            history: []
        };
    }
    
    const session = sessions[sessionId];
    const input = text ? text.split("*") : [];
    
    // Handle navigation commands
    if (input.length > 0) {
        const lastInput = input[input.length - 1];
        
        // Go back
        if (lastInput === "0") {
            if (session.history.length > 0) {
                session.history.pop(); // Remove current level
                input.pop(); // Remove the back command
                if (session.history.length > 0) {
                    session.history.pop(); // Remove previous level
                }
            }
        }
        // Go to main menu
        else if (lastInput === "00") {
            session.history = [];
            input.length = 0;
        }
    }
    
    // Store current navigation level
    session.history.push(input.join("*"));
    
    // Main menu when no input
    if (input.length === 0) {
        response = `CON Welcome to LocalLang\nChoose Language:
1. Kiswahili
2. Kikuyu
3. Luo
4. Kamba

0. Exit`;
    }
    
    // -------- Language Menu Logic --------
    else if (input.length === 1) {
        const lang = input[0];
        
        // Handle exit
        if (lang === "0") {
            response = "END Asante kwa kutumia huduma zetu.";
            delete sessions[sessionId];
        } 
        // Handle language selection
        else {
            switch (lang) {
                case "1":
                    response = `CON Karibu LocalLang\nChagua Huduma:
1. Fedha
2. Afya
3. Kilimo
4. Usafiri

0. Rudi
00. Menu Kuu`;
                    break;
                case "2":
                    response = `CON Wîhîî LocalLang\nTogora Mûtugo:
1. Wîra wa Mbeca
2. Mûtugo wa Thibitari
3. Wîra wa Mbembe
4. Mûtugo wa Mathîna

0. Gûcoka
00. Menyu Thîinî`;
                    break;
                case "3":
                    response = `CON Karibu e LocalLang\nYer wach mar tich:
1. Mbesa
2. Chenro
3. Weche mag pokoth
4. Yiengni

0. Dog
00. Menyu Maduong'`;
                    break;
                case "4":
                    response = `CON Wîî Kîla LocalLang\nTavanya Mbesa:
1. Mbesa
2. Muthee
3. Kilimo
4. Usafiri

0. Syoka
00. Menyu Mbee`;
                    break;
                default:
                    response = `END Invalid language choice.`;
            }
        }
    }
    
    // -------- Service Menu --------
    else if (input.length === 2) {
        const lang = input[0];
        const service = input[1];
        
        // Kiswahili
        if (lang === "1") {
            switch (service) {
                case "1":
                    response = `CON Huduma za Fedha:\n1. Tuma Pesa\n2. Toa Pesa\n3. Nunua Airtime\n\n0. Rudi\n00. Menu Kuu`;
                    break;
                case "2":
                    response = `CON Huduma za Afya:\n1. Panga Kliniki\n2. Angalia NHIF\n3. Vidokezo vya Dharura\n\n0. Rudi\n00. Menu Kuu`;
                    break;
                case "3":
                    response = `CON Kilimo:\n1. Bei Sokoni\n2. Mbinu za Kupanda\n3. Hali ya Hewa\n\n0. Rudi\n00. Menu Kuu`;
                    break;
                case "4":
                    response = `CON Usafiri:\n1. Nauli\n2. Ramani ya Njia\n3. Leseni ya Kuendesha\n\n0. Rudi\n00. Menu Kuu`;
                    break;
                default:
                    response = `END Chaguo si sahihi.`;
            }
        }
        // Kikuyu
        else if (lang === "2") {
            switch (service) {
                case "1":
                    response = `CON Wîra wa Mbeca:\n1. Tuma Mbeca\n2. Tora Mbeca\n3. Gura Airtime\n\n0. Gûcoka\n00. Menyu Thîinî`;
                    break;
                case "2":
                    response = `CON Thibitari:\n1. Andîkîra Clinic\n2. Thîna wa NHIF\n3. Maitho ma Ng'endo\n\n0. Gûcoka\n00. Menyu Thîinî`;
                    break;
                case "3":
                    response = `CON Mbembe:\n1. Bei ya Cîrîa\n2. Mîhûgo ya Kûmenya\n3. Wendo wa Ngai\n\n0. Gûcoka\n00. Menyu Thîinî`;
                    break;
                case "4":
                    response = `CON Mathîna:\n1. Kîrîa Matatu\n2. Rûgendo Map\n3. Leseni ya Driver\n\n0. Gûcoka\n00. Menyu Thîinî`;
                    break;
                default:
                    response = `END Togora tawe.`;
            }
        }
        // Luo
        else if (lang === "3") {
            switch (service) {
                case "1":
                    response = `CON Mbesa:\n1. Oro Mbesa\n2. Ng'ado Mbesa\n3. Nyuolo Airtime\n\n0. Dog\n00. Menyu Maduong'`;
                    break;
                case "2":
                    response = `CON Chenro:\n1. Yiero Clinic\n2. Ango NHIF\n3. Konyru e Thoth\n\n0. Dog\n00. Menyu Maduong'`;
                    break;
                case "3":
                    response = `CON Weche mag Pokoth:\n1. Ratiro Margi\n2. Tim Kodo\n3. Wek Higni\n\n0. Dog\n00. Menyu Maduong'`;
                    break;
                case "4":
                    response = `CON Yiengni:\n1. Pesa Matatu\n2. Map Mar Yo\n3. Jariso Janyiero\n\n0. Dog\n00. Menyu Maduong'`;
                    break;
                default:
                    response = `END Nyiso ma ok en adier.`;
            }
        }
        // Kamba
        else if (lang === "4") {
            switch (service) {
                case "1":
                    response = `CON Mbesa:\n1. Tuma Mbesa\n2. Twaa Mbesa\n3. Nunua Airtime\n\n0. Syoka\n00. Menyu Mbee`;
                    break;
                case "2":
                    response = `CON Muthee:\n1. Ita Kliniki\n2. Angalia NHIF\n3. Maelezo ya Dharura\n\n0. Syoka\n00. Menyu Mbee`;
                    break;
                case "3":
                    response = `CON Kilimo:\n1. Bei ya Soko\n2. Mbinu za Kupanda\n3. Hali ya Anga\n\n0. Syoka\n00. Menyu Mbee`;
                    break;
                case "4":
                    response = `CON Usafiri:\n1. Nauli\n2. Ramani ya Njia\n3. Leseni ya Kuendesha\n\n0. Syoka\n00. Menyu Mbee`;
                    break;
                default:
                    response = `END Chaguo sî chîa.`;
            }
        }
        else {
            response = `END Invalid language.`;
        }
    }
    
    // -------- Final Instruction Selection --------
    else if (input.length === 3) {
        response = `END Asante! Maelezo/Instructions zimetumwa kulingana na huduma uliyopokea.`;
        delete sessions[sessionId];
    }
    
    // -------- Fallback --------
    else {
        response = `END Invalid input. Try again.`;
        delete sessions[sessionId];
    }
    
    res.set("Content-Type", "text/plain");
    res.send(response);
});

app.listen(PORT, () => {
    console.log(`USSD server running on port ${PORT}`);
});