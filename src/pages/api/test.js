const fs = require('fs');
const path = require('path');

try {
  // Use path.join to create the path to the files
  const awsServicesPath = path.join(__dirname, '../../../templates/aws_services.json');
  const serviceOptionsPath = path.join(__dirname, '../../../templates/service_options.json');

  // Use fs.readFileSync to read the files
  const awsServices = JSON.parse(fs.readFileSync(awsServicesPath, 'utf8'));
  const serviceOptions = Object.values(JSON.parse(fs.readFileSync(serviceOptionsPath, 'utf8')));

  // Create a string that lists all the service options
  let serviceOptionsString = 'Service Options:\n';
  for (let i = 0; i < serviceOptions.length; i++) {
    serviceOptionsString += `${i + 1}. ${serviceOptions[i].name}\n`;
  }

  // Create a string that lists all the AWS services
  let awsServicesString = 'AWS Services:\n';
  for (let i = 0; i < awsServices.length; i++) {
    awsServicesString += `${i + 1}. ${awsServices[i].name}, Description: ${awsServices[i].description}\n`;
  }

  console.log(serviceOptionsString);
  console.log(awsServicesString);
} catch (err) {
  console.error('Failed to read the files:', err);
}

/*
const fs = require('fs');
const path = require('path');

try {
  // Use path.join to create the path to the files
  const awsServicesPath = path.join(__dirname, '../../../templates/aws_services.json');
  const serviceOptionsPath = path.join(__dirname, '../../../templates/service_options.json');

  // Use fs.readFileSync to read the files
  const awsServices = JSON.parse(fs.readFileSync(awsServicesPath, 'utf8'));
  const serviceOptions = Object.values(JSON.parse(fs.readFileSync(serviceOptionsPath, 'utf8')));

  // Create a string that lists all the service options
  let serviceOptionsString = 'Service Options:\n';
  for (let i = 0; i < serviceOptions.length; i++) {
    serviceOptionsString += `${i + 1}. ${serviceOptions[i].name}, Description: ${serviceOptions[i].description}\n`;
  }

  // Create a string that lists all the AWS services
  let awsServicesString = 'AWS Services:\n';
  for (let i = 0; i < awsServices.length; i++) {
    awsServicesString += `${i + 1}. ${awsServices[i].name}, Description: ${awsServices[i].description}\n`;
  }

  console.log(serviceOptionsString);
  console.log(awsServicesString);
} catch (err) {
  console.error('Failed to read the files:', err);
}
*/