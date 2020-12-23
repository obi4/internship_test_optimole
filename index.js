//here you can require you dependencies or external functions
const sharp = require("sharp");
const sizeOf = require("image-size");
const fs = require("fs");
const path = require("path"); // I will use this in order to iterate through the images folder

exports.handler = async function (event) {
  //here you will add your code
  function rescaleImage(image, destination, width, height) {
    let r = 0.75;
    let res1 = width * height;

    while (width * height >= 250000) {
      width *= r;
      height *= r;

      if (width * height >= 250000) {
        rez = width * height;
      }
    }

    if (rez - 250000 < 250000 - width * height) {
      width /= 0.75;
      height /= 0.75;
    }

    sharp(image)
      .resize(Math.floor(width), Math.floor(height))
      .toFile(destination)
      .catch((err) => console.log(err));

    let res2 = width * height;

    return 100 - Math.floor((res2 / res1) * 100);
  }

  const secret = event["optimoleKey"];
  const buff = Buffer.from(secret, "base64");
  const str = buff.toString("utf-8");
  const destinationArray = [];

  const finalObject = { pass: str };

  const images = fs.readdirSync("./images/");
  images.forEach((image) => {
    const imageLocation = "./images/" + image;
    const destination = "./optimized/" + image.split(".")[0] + ".jpg";

    let dimensions1 = sizeOf(imageLocation);
    procent = rescaleImage(
      imageLocation,
      destination,
      dimensions1.width,
      dimensions1.height
    );

    destinationArray.push({
      filePath: destination,
      procent: Math.floor(procent),
    });
  });

  finalObject["optimized"] = destinationArray;
  return finalObject;
};
