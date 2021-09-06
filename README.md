# terminate-ec2-uptimerobot-alert

This project contains source code and supporting files for a serverless application to be deployed with the AWS Serverless Application Model (AWS SAM) command line interface (CLI). The application is designed to terminate a single EC2 instance and publish to an SNS topic in response to an API gateway post request. The use case for this application is to respond to an Uptime Robot Alert webhook in order to reboot a single instance web application running on AWS. This was originally built to handle a Wordpress "critical" error. In this use case, Uptime Robot webhook would send a post request to the AWS API gateway endpoint when a problem is detected with a monitored website. API gateway would invoke the lambda function to terminate the instance running the website. The instance is identified by a parameter tag passed during the SAM build process. If this single instance is part of an autoscaling group with a minimum, maximum, and desired capacity of one, then a new instance would be launched to replace the failing web server and an SNS notification would be sent to the created SNS topic. The new instance would inherit the "name" tag of the autoscaling group, which would enable the new instance to be shutdown by the application in the future. This project includes the following files and folders:

- `src` - Code for the application's Lambda function which is fired in response to an API gateway POST event which is intended to be invoked by Uptime Robot or any other monitoring service. It terminates a tagged instance and sends an SNS notification to a topic created by the SAM template. It is presumed that an autoscaling group would then launch a new instance to replace the terminated instance. 
- `__tests__` - Unit tests for the application code, currently empty
- `template.yml` - A template that defines the application's AWS resources.

Resources for this project are defined in the `template.yml` file in this project. 

This project presumes that the user has an existing deployed single instance web application behind an autoscaling group that is capable of launching an EC2 image with a stable version of the website when the running instance is terminated. The project also presumes that the user has set up a webhook in Uptime Robot to send a post to the API gateway endpoint created by this application. The user must also separatly subscribe to the SNS topic created by this application to receive alerts.

## To Deploy the sample application

The AWS SAM CLI is an extension of the AWS CLI that adds functionality for building and testing Lambda applications. It uses Docker to run your functions in an Amazon Linux environment that matches Lambda. It can also emulate your application's build environment and API.

To use the AWS SAM CLI, you need the following tools:

* AWS SAM CLI - [Install the AWS SAM CLI](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-install.html).
* Node.js - [Install Node.js 14](https://nodejs.org/en/), including the npm package management tool.
* Docker - [Install Docker community edition](https://hub.docker.com/search/?type=edition&offering=community).

To build and deploy your application for the first time, run the following in your shell:

```bash
sam build
sam deploy --guided
```

The first command will build the source of the application. The second command will package and deploy your application to AWS, with a series of prompts:

* **Stack Name**: The name of the stack to deploy to CloudFormation. This should be unique to your account and region, and a good starting point would be something similar to the project name.
* **AWS Region**: The AWS region you want to deploy your app to.
* **Confirm changes before deploy**: If set to yes, any change sets will be shown to you before execution for manual review. If set to no, the AWS SAM CLI will automatically deploy application changes.
* **Allow SAM CLI IAM role creation**: This project creates AWS IAM roles required for the AWS Lambda function included to access AWS services. By default, these are scoped down to minimum required permissions. To deploy an AWS CloudFormation stack which creates or modifies IAM roles, the `CAPABILITY_IAM` value for `capabilities` must be provided. If permission isn't provided through this prompt, to deploy this example you must explicitly pass `--capabilities CAPABILITY_IAM` to the `sam deploy` command.
* **Save arguments to samconfig.toml**: If set to yes, your choices will be saved to a configuration file inside the project, so that in the future you can just re-run `sam deploy` without parameters to deploy changes to your application.

## Use the AWS SAM CLI to build locally

Build your application by using the `sam build` command.

```bash
my-application$ sam build
```

The AWS SAM CLI installs dependencies that are defined in `package.json`, creates a deployment package, and saves it in the `.aws-sam/build` folder.

Deploy the updated application.

```bash
my-application$ sam deploy
```

## Unit tests

Tests are defined in the `__tests__` folder in this project. Use `npm` to install the [Jest test framework](https://jestjs.io/) and run unit tests. There are currently no unit tests for this application but may be added in the future.

```bash
my-application$ npm install
my-application$ npm run test
```

## Cleanup

To delete the sample application that you created, use the AWS CLI. Assuming you used your project name for the stack name, you can run the following:

```bash
aws cloudformation delete-stack --stack-name projectname
```

