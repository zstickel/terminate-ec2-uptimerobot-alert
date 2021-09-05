/**
 * A Lambda function that terminates an EC2 instance (based on tag passed as environment variable) and sends an SNS notification in response
 * to an uptime robot POST message to API gateway
 */
const AWS = require('aws-sdk');
const ec2 = new AWS.EC2();
const sns = new AWS.SNS();
exports.terminateEC2UptimerobotHandler = async () => {
      const paramsforInstances = {
        Filters: [
          {
            Name: 'tag:Name',
            Values: [`${process.env.EC2TagName}`]
          }
        ]
      };
      
    try{
       let data = await ec2.describeInstances(paramsforInstances).promise();
       let instanceID = data.Reservations[0].Instances[0].InstanceId;
       let params = {
            InstanceIds: [instanceID]
        }
    
        let ec2result = await ec2.terminateInstances(params).promise();
        console.log(ec2result);
   
       console.log(instanceID);
        let response = {
            "isBase64Encoded": true,
            "statusCode": 200,
            "body": `Terminated ID ${instanceID}`
        }
        
        console.log(process.env.SNStopic);
        let snsparams = {
            Message: `Instance was shut down in response to an uptime robot notification`,
            Subject: 'AWS action in response to uptime robot',
            TopicArn: process.env.SNStopic
        }
        let snsresult = await sns.publish(snsparams).promise();
        console.log(snsresult);
        return response;
    }
    catch (error){
        console.log(error);
        let response = {
            "isBase64Encoded": true,
            "statusCode": 500,
            "body": `Internal error: ${error}`
        }
        return response;
    }
}
