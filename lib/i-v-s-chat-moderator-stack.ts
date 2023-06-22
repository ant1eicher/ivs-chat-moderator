import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { ChatStack } from "./chat-stack";
import * as secretsmanager from "aws-cdk-lib/aws-secretsmanager";
import { WebsiteStack } from "./website-stack";

export class IVSChatModeratorStack extends cdk.Stack {
  constructor (scope: Construct, id: string, props: cdk.StackProps) {
    super(scope, id, {
      stackName: props.stackName,
      env: props.env,
    });

    const secretName = "gptApiKey";
    const secret = secretsmanager.Secret.fromSecretNameV2(this,
      "ImportedSecret", secretName);
    const gptApiKey = secret.secretValue.unsafeUnwrap();

    new ChatStack(this, "ChatStack", {
      ...props,
      gptApiKey,
    });

    new WebsiteStack(this, "WebsiteStack", props);

  }
}
