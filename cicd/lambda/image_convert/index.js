const AWS = require('aws-sdk');
const util = require('util');
const sharp = require('sharp');

const s3 = new AWS.S3();

const s3conf = [
    {
        dir: "extra-small",
        width: 320
    },
    {
        dir: "small",
        width: 640
    },
    {
        dir: "middle",
        width: 1024
    },
    {
        dir: "large",
        width: 1920
    }
];

exports.handler = async (event) => {
    console.log("Reading options from event:\n", util.inspect(event, {depth: 5}));
    const srcBucket = event.Records[0].s3.bucket.name;
    const srcKey = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, " "));
    const dstBucket = "s3-20161611";

    const typeMatch = srcKey.match(/\.([^.]*)$/);
    if (!typeMatch) {
        console.log("Could not determine the image type.");
        return;
    }

    const imageType = typeMatch[1].toLowerCase();
    if (imageType != "jpg" && imageType != "png") {
        console.log(`Unsupported image type: ${imageType}`);
        return;
    }

    try {
        const params = {
            Bucket: srcBucket,
            Key: srcKey
        };
        const origimage = await s3.getObject(params).promise();

        for (let config of s3conf) {
            const buffer = await sharp(origimage.Body)
                .resize(config.width)
                .toFormat('webp', { quality: 100 })
                .toBuffer();

            const fileName = srcKey.split('/').pop().replace(/\.[^/.]+$/, ".webp"); // Remove original extension and add .webp
            const dstKey = `${config.dir}/${fileName}`;

            await s3.putObject({
                Bucket: dstBucket,
                Key: dstKey,
                Body: buffer,
                ContentType: 'image/webp'
            }).promise();

            console.log(`Successfully resized ${srcBucket}/${srcKey} and uploaded to ${dstBucket}/${dstKey}`);
        }
    } catch (error) {
        console.log(error);
        return;
    }
};
