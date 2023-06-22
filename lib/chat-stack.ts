import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ivschat from 'aws-cdk-lib/aws-ivschat';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Architecture, AssetCode, Function, Runtime } from 'aws-cdk-lib/aws-lambda';

interface ChatStackProps extends cdk.StackProps {
  gptApiKey: string;
}

export class ChatStack extends cdk.Stack {
  constructor (scope: Construct, id: string, props: ChatStackProps) {
    super(scope, id, {
      stackName: props.stackName,
      env: props.env,
    });

    const reviewFn = new Function(this, `IVSChatReviewHandler`, {
      code: new AssetCode('./lambdas/cmd/review-handler'),
      functionName: `ivs-chat-review-handler`,
      handler: 'main',
      timeout: cdk.Duration.seconds(5),
      memorySize: 128,
      runtime: Runtime.GO_1_X,
      architecture: Architecture.X86_64,
      environment: {
        API_KEY: props.gptApiKey,
      },
    });

    reviewFn.grantInvoke(new iam.ServicePrincipal('ivschat.amazonaws.com'))

    const room = new ivschat.CfnRoom(this, 'ChatRoom', {
      name: "moderated-chatroom",
      messageReviewHandler: {
        fallbackResult: "ALLOW",
        uri: reviewFn.functionArn
      }
    })

    new cdk.CfnOutput(this, 'ChatRoomArn', {
      value: room.attrArn,
      description: 'The ARN of the chat room',
    });

  }
}