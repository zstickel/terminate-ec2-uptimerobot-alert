/**
 * A Lambda function that returns a static string
 */
const AWS = require('aws-sdk');
exports.restartTimeandTideHandler = async () => {
    // If you change this message, you will need to change hello-from-lambda.test.js
    
   

/*tag: - The key/value combination of a tag assigned to the 
resource. Use the tag key in the filter name and the tag value 
as the filter value. For example, to find all resources that 
have a tag with the key Owner and the value TeamA, specify 
tag:Owner for the filter name and TeamA for the filter value.
*/


    let ec2 = new AWS.EC2();
    let sns = new AWS.SNS();
 
      
      var paramsforInstances = {
        Filters: [
          {
            Name: 'tag:Name',
            Values: ['WaypointcounselingStack/ASG']
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
    // All log statements are written to CloudWatch
    //console.info(`${message}`);
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
