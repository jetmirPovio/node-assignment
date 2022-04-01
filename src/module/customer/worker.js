const { parentPort } = require('worker_threads');
const { PDFDocument } = require('pdf-lib');

const fontKit = require('@pdf-lib/fontkit');
const fs = require('fs');

(async () => {
  const pdfDoc = await PDFDocument.create();
  pdfDoc.registerFontkit(fontKit);

  const font = await pdfDoc.embedFont(
    fs.readFileSync(`${process.cwd()}/Roboto-Regular.ttf`),
  );
  const page = pdfDoc.addPage();
  const fontSize = 12;
  const customerList = JSON.parse(
    fs.readFileSync(`${process.cwd()}/customers.json`, {
      encoding: 'utf-8',
    }),
  );

  customerList.forEach((c, i) => {
    page.drawText(`${c.CustomerId} ${c.FirstName} ${c.LastName}`, {
      x: 5,
      y: i * fontSize * 2,
      size: fontSize,
      font,
    });
  });
  const pdf = await pdfDoc.save();

  parentPort.postMessage(pdf);
})();
