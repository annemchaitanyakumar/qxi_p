const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } = require("docx");
const fs = require("fs");
const path = require("path");

async function generateDOCX() {
    const doc = new Document({
        sections: [{
            properties: {},
            children: [
                new Paragraph({
                    children: [
                        new TextRun({
                            text: "Hi There, Friend!",
                            color: "CC9A06",
                            size: 72, // 36pt
                            font: "Caveat",
                        }),
                    ],
                    heading: HeadingLevel.HEADING_1,
                    alignment: AlignmentType.CENTER,
                    spacing: { after: 400 },
                }),
                new Paragraph({
                    children: [
                        new TextRun({
                            text: "Welcome to our super cool digital playground! Here is a little guide to help you play with our giant robot Panda.",
                            font: "Caveat",
                            size: 32, // 16pt
                        }),
                    ],
                    spacing: { after: 200 },
                }),
                new Paragraph({
                    children: [
                        new TextRun({
                            text: "What can this Panda do?",
                            font: "Caveat",
                            size: 36, // 18pt
                            bold: true,
                        }),
                    ],
                    spacing: { before: 200, after: 200 },
                }),
                new Paragraph({
                    children: [
                        new TextRun({
                            text: "-> Magic Fur: Our Panda has the softest fur in the digital world! If you click on him, your phone will even buzz to say hi!",
                            font: "Caveat",
                            size: 32,
                        }),
                    ],
                    spacing: { after: 150 },
                }),
                new Paragraph({
                    children: [
                        new TextRun({
                            text: "-> Copycat Mode: If you click the 'Neural Cam' button and say 'Yes' to the camera, the Panda will become your twin! If you look left, he looks left. If you wave your hand, HE WAVES BACK!",
                            font: "Caveat",
                            size: 32,
                        }),
                    ],
                    spacing: { after: 150 },
                }),
                new Paragraph({
                    children: [
                        new TextRun({
                            text: "-> Move the World: On your phone, you can tilt your screen like a steering wheel to make him look around. On your computer, he just loves to follow your mouse cursor everywhere!",
                            font: "Caveat",
                            size: 32,
                        }),
                    ],
                    spacing: { after: 150 },
                }),
                new Paragraph({
                    children: [
                        new TextRun({
                            text: "-> Super Privacy: Even though he uses the camera to play with you, he is a very private Panda. He doesn't save any videos and never sends them anywhere. He just watches your moves and forgets them instantly!",
                            font: "Caveat",
                            size: 32,
                        }),
                    ],
                    spacing: { after: 150 },
                }),
                new Paragraph({
                    children: [
                        new TextRun({
                            text: "We built this because we love making things that feel like magic. Have fun exploring!",
                            font: "Caveat",
                            size: 32,
                        }),
                    ],
                    spacing: { before: 200, after: 400 },
                }),
                new Paragraph({
                    children: [
                        new TextRun({
                            text: "With Love,\nThe Quinzex Team",
                            font: "Caveat",
                            size: 36,
                            bold: true,
                        }),
                    ],
                    alignment: AlignmentType.RIGHT,
                }),
            ],
        }],
    });

    const buffer = await Packer.toBuffer(doc);
    const outPath = path.join(__dirname, "public", "Panda_Guide.docx");
    fs.writeFileSync(outPath, buffer);

    console.log("DOCX generated at: " + outPath);
}

generateDOCX().catch(console.error);
