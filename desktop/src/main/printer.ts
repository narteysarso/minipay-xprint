import { getPrinters,getDefaultPrinter, print } from "pdf-to-printer2";
import fs  from "fs";
import path  from "path";

const defaultOptions = {
    monochrome: true,
    paperSize: "A4",
    copies: 1,
    printDialog: false,
    scale: "fit",
    orientation: "portrait"
};

export const printLocal = async (url, options) => {
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

        await print(tmpFilePath, {...defaultOptions, ...options});
        fs.unlinkSync(tmpFilePath);
    } catch (error) {
        console.log(error);
    }

}

export const getLocalPrinters = async () => await getPrinters()
export const getLocalDefaultPrinter = async () => await getDefaultPrinter()
