const AWS = require('aws-sdk')
const async = require('async')
const path = require('path')
const fs = require('fs')


function randomInt() {
	return Math.floor(Math.random() * (9999 - 1000) + 1000)
};

let pathParams, image, imageName;
const bucketName = '';
const spacesEndpoint = new AWS.Endpoint('');
const s3 = new AWS.S3({ 
	endpoint: spacesEndpoint, 
	accessKeyId: '', 
	secretAccessKey: ''
});

const createMainBucket = (callback) => {
	// Create the parameters for calling createBucket
	const bucketParams = {
	   Bucket : bucketName
	};                    
	s3.headBucket(bucketParams, function(err, data) {
	   if (err) {
	      	s3.createBucket(bucketParams, function(err, data) {
			   if (err) {
			   		callback(err, null)
			   } else {
			      callback(null, data)
			   }
			});
	   } else {
	      callback(null, data)
	   }
	})                             
}

const createItemObject = (callback) => {
  	const params = { 
		Bucket: bucketName, 
        Key: `${imageName}`, 
        ACL: 'public-read',
        Body: image
    };
	s3.putObject(params, function (err, data) {
		if (err) {
	    	console.log("Error uploading image: ", err);
	    	callback(err, null)
	    } else {
	    	console.log("Successfully uploaded image on S3", data);
	    	callback(null, data)
	    }
	})  
}

const getSignedUrl = () => {
	var params = {Bucket:  bucketName, Key: imageName};
	return s3.getSignedUrl('putObject', params, function (err, url) {
		return url;
	});
}

const getS3FilePath = () => {
	return `https://${bucketName}.s3.${awsRegion}.amazonaws.com/${imageName}`;
}

const uploadFileToS3 = async (req, res, next) => {
	console.log('---user avatar upload request---')
	try {
		const files = req.files;
		var tmp_path = files.photo.path;
		console.log(tmp_path, req.type)

		let times=new Date().toISOString()
							.replace(/T/, ' ')
							.replace(/\..+/, '')
							.replace(' ', '-')
							.replace(':', '_')
							.replace(':', '_');

		image = fs.createReadStream(tmp_path);		
		imageName = 'avatar/avatar-' + files.photo.name + times.toString();
	
		console.log(image, imageName)
		var data = await async.series([
			// createMainBucket,
			createItemObject
		]);
		console.log('upload file', data)
		return imageName;
	} catch (e) {
		console.log('upload file error', e)
		return null;
	}
}

const uploadEmailAttachFileToS3 = async (_file) => {
	console.log('---user avatar upload request---')
	try {
		var tmp_path = _file.path;

		let times=new Date().toISOString()
							.replace(/T/, ' ')
							.replace(/\..+/, '')
							.replace(' ', '-')
							.replace(':', '_')
							.replace(':', '_');

		image = fs.createReadStream(tmp_path);		
		imageName = 'email/attach-' + _file.name + times.toString();
	
		console.log(image, imageName)
		var data = await async.series([
			// createMainBucket,
			createItemObject
		]);
		console.log('upload file', data)
		return imageName;
	} catch (e) {
		console.log('upload file error', e)
		return null;
	}
}


const uploadFile = async (num, next) => {
	// Read content from the file
	var _tempName = './temps/invoice-' + num + '.pdf';
	const fileContent = fs.readFileSync(_tempName);

	var fileName = 'doc/invoice-' + num + '.pdf';

	// Setting up S3 upload parameters
	const params = {
		Bucket: bucketName,
		Key: `${fileName}`,
		ACL: 'public-read',
		Body: fileContent
	};

	// Uploading files to the bucket
	await s3.upload(params, function (err, data) {
		if (err) {
			throw err;
		}
		//console.log(`File uploaded successfully. ${data.Location}`);
		//return `https://${bucketName}.s3.${awsRegion}.amazonaws.com/${fileName}`;
	});
	try {
		await fs.unlinkSync(_tempName)
		//file removed
	} catch (err) {
		console.error(err)
	}
	return `https://${bucketName}.s3.${awsRegion}.amazonaws.com/${fileName}`;
};

module.exports = {
	uploadFileToS3,
	uploadEmailAttachFileToS3,
	getS3FilePath,
	getSignedUrl,
	uploadFile
};


