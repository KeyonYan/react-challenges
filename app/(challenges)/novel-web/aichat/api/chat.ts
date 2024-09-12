import { createOpenAI } from "@ai-sdk/openai";
import { generateText, streamText } from "ai";
import type { ChatMessage } from "@ant-design/pro-chat";
import uploadBase64Img from "./oss";
import {
  generate_background,
  generate_ending_scene,
  generate_plot,
} from "../prompt";

const openai = createOpenAI({
  apiKey: "", // your openai key
  baseURL: "https://cn2us02.opapi.win/v1", // if u dont need change baseUrl，you can delete this line
  compatibility: "compatible",
});

const ohmyGptKey = "";
const mifyApiKey = "";

export async function mifyApi(userInput: string) {
  const stream = fetch(`/mify/chat-message`, {
    method: "POST",
    body: JSON.stringify({
      query: userInput,
      response_mode: "streaming",
      user: "mystory-user",
    }),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${mifyApiKey}`,
    },
  });
  return stream;
}

export async function chatApi(
  messages: ChatMessage<Record<string, any>>[],
  prompt: string,
  modelValue: string
) {
  const pickMessages = [
    {
      role: "user",
      content: "你是Mystory，是严格遵循指令执行任务的小说家",
    },
  ];
  // 识别对话意图
  const intent = await generateText({
    model: openai(modelValue),
    messages: [
      {
        role: "user",
        content: `请判断用户意图是生成小说背景、角色、剧情还是结局，请输出其中之一，不要携带其他文本。用户输入：${
          messages[messages.length - 1].content as string
        }`,
      },
    ],
  });
  // 根据意图追加不同的Prompt
  if (intent.text.includes("背景")) {
    pickMessages.push({
      role: "user",
      content: generate_background(
        messages[messages.length - 1].content as string
      ),
    });
  } else if (intent.text.includes("剧情")) {
    pickMessages.push({
      role: "user",
      content: generate_plot(
        prompt,
        messages[messages.length - 1].content as string
      ),
    });
  } else if (intent.text.includes("结局")) {
    pickMessages.push({
      role: "user",
      content: generate_ending_scene(
        prompt,
        messages[messages.length - 1].content as string
      ),
    });
  } else {
    pickMessages.push({
      role: "user",
      content: prompt,
    });
  }

  for (const message of messages) {
    // 只选择用户和助手的消息
    if (message.role === "user" || message.role === "assistant") {
      pickMessages.push({
        role: message.role,
        content: message.content as string,
      });
    }
  }
  const stream = streamText({
    model: openai(modelValue),
    messages: pickMessages as any,
  });
  return stream;
}

export async function extractKeywordsAndTranslateEnglishApi(content: string) {
  const pickMessages = [
    {
      role: "user",
      content: `提取能够代表该段文本信息的关键词，翻译成英文并用逗号分隔: ${content}`,
    },
  ];
  return generateText({
    model: openai("gpt-3.5-turbo"),
    messages: pickMessages as any,
  });
}

export const text2imgApi = async (params: {
  prompt: string;
  modelValue: string;
}): Promise<any> => {
  console.log("文生图modelValue", params.modelValue);
  if (params.modelValue === "mitv-text2img") {
    const resp = await fetch(`/api/v1/model/mitv/text2img`, {
      method: "POST",
      body: JSON.stringify(params),
      headers: {
        "Content-Type": "application/json",
      },
    });
    return resp.json();
  }
  if (params.modelValue === "nd-text2img") {
    const resp = await fetch(
      `https://cn2us02.opapi.win/api/v1/ai/draw/nd/imagine`,
      {
        method: "POST",
        body: JSON.stringify({
          prompt: params.prompt,
          negative_prompt: "sexy, violence, bloody, scantily clad",
          model: "nd-imagine-v3",
          size: "1024x1024",
        }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${ohmyGptKey}`,
        },
      }
    );
    const datajson = await resp.json();
    const uploadResp = await uploadBase64Img(datajson.data[0].url);
    console.log("uploadResp", uploadResp);
    return uploadResp;
  }
};
