import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as s3 from "aws-cdk-lib/aws-s3";
import { BlockPublicAccess, BucketAccessControl } from "aws-cdk-lib/aws-s3";
import * as s3deploy from "aws-cdk-lib/aws-s3-deployment";

export class WebsiteStack extends cdk.Stack {
  constructor (scope: Construct, id: string, props: cdk.StackProps) {
    super(scope, id, {
      stackName: props.stackName,
      env: props.env,
    });

    const websiteBucket = new s3.Bucket(this, 'WebsiteBucket', {
      versioned: false,
      publicReadAccess: true,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      websiteIndexDocument: 'index.html',
      blockPublicAccess: BlockPublicAccess.BLOCK_ACLS,
      accessControl: BucketAccessControl.BUCKET_OWNER_FULL_CONTROL,
    });

    new s3deploy.BucketDeployment(this, 'DeployWebsite', {
      sources: [s3deploy.Source.asset('./website')],
      destinationBucket: websiteBucket,
    });

    new cdk.CfnOutput(this, 'BucketURL', {
      value: websiteBucket.bucketWebsiteUrl,
      description: 'The URL of the Demo website',
    });

  }
}
