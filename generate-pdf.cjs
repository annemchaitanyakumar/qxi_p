const { jsPDF } = require("jspdf");
const fs = require("fs");
const path = require("path");

async function generatePDF() {
    const doc = new jsPDF();

    // Load font
    const fontPath = path.join(__dirname, "public", "Caveat.ttf");
    const fontData = fs.readFileSync(fontPath).toString("base64");

    doc.addFileToVFS("Caveat.ttf", fontData);
    doc.addFont("Caveat.ttf", "Caveat", "normal");
    doc.setFont("Caveat");

    // Title
    doc.setFontSize(36);
    doc.setTextColor(204, 154, 6); // Gold
    doc.text("Hi There, Friend!", 20, 30);

    // Body
    doc.setFontSize(18);
    doc.setTextColor(0, 0, 0); // Black for PDF text

    const lines = [
        `🐼👋`,
        `Hi There, Friend!`,
        `Welcome to our super cool digital playground! Here is a little guide to help you play with our giant robot Panda.`,
        ``,
        `What can this Panda do?`,
        ``,
        `Magic Fur: Our Panda has the softest fur in the digital world! If you click on him, your phone will even buzz to say hi!`,
        `Copycat Mode: If you click the "Neural Cam" button and say "Yes" to the camera, the Panda will become your twin! If you look left, he looks left.If you wave your hand, HE WAVES BACK!`,
        `Move the World: On your phone, you can tilt your screen like a steering wheel to make him look around.On your computer, he just loves to follow your mouse cursor everywhere!`,
        `Super Privacy: Even though he uses the camera to play with you, he is a very private Panda.He doesn't save any videos and never sends them anywhere. He just watches your moves and forgets them instantly!`,
        `We built this because we love making things that feel like magic.Have fun exploring!`,
        ``,
        `With Love,`,
        `The Quinzex Team`
    ];

    let y = 50;
    lines.forEach(line => {
        doc.text(line, 20, y);
        y += 8;
    });

    const outPath = path.join(__dirname, "public", "Panda_Guide.pdf");
    const pdfData = doc.output();
    fs.writeFileSync(outPath, pdfData, "binary");

    console.log("PDF generated at: " + outPath);
}

generatePDF().catch(console.error);
