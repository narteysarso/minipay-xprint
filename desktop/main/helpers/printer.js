const ptp = require("pdf-to-printer");
const fs = require("fs");
const path = require("path");
const fetch = require("node-fetch");

const defaultOptions = {
    monochrome: true,
    paperSize: "A4",
    copies: 1,
    printDialog: false,
    scale: "fit",
    orientation: "portrait"
};

export const print = async (url, options) => {
    try {
        console.log(__dirname, url, options);
        // return;

        const tmpFilePath = path.join(__dirname, `tmp/${Math.random().toString(36).substr(7)}.pdf`);
        console.log(tmpFilePath);

        const res = await fetch(url);

        // const data = blob.stream();
        const fileStream = fs.createWriteStream(tmpFilePath);
        await new Promise((resolve, reject) => {
            res.body.pipe(fileStream);
            res.body.on("error", reject);
            fileStream.on("finish", resolve);
        });

        // fs.writeFileSync(tmpFilePath, data, 'binary');

        await ptp.print(tmpFilePath, {...defaultOptions, ...options});
        fs.unlinkSync(tmpFilePath);
    } catch (error) {
        console.log(error);
    }

}

export const getPrinters = async () => await ptp.getPrinters()
export const getDefaultPrinter = async () => await ptp.getDefaultPrinter()
