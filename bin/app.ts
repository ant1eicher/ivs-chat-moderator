#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { IVSChatModeratorStack } from "../lib/i-v-s-chat-moderator-stack";

const app = new cdk.App();
new IVSChatModeratorStack(app, "IVSChatModeratorStack", {});
