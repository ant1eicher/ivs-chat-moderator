#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { IvsChatModeratorStack } from "../lib/ivs-chat-moderator-stack";

const app = new cdk.App();
new IvsChatModeratorStack(app, "IVSChatModeratorStack", {});
