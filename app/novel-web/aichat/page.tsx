'use client'
import type React from 'react';
import { type ReactNode, useEffect, useState } from 'react'
import { Input, message, Modal } from 'antd';
import { ArrowLeftOutlined, CheckCircleTwoTone, EditTwoTone, FileImageTwoTone, ReloadOutlined } from '@ant-design/icons';
import { type ChatItemProps, type ChatListProps, ProChat, ProChatProvider, useProChat } from '@ant-design/pro-chat';
import TextArea from 'antd/es/input/TextArea';
import { chatApi, extractKeywordsAndTranslateEnglishApi, mifyApi, text2imgApi } from './api/chat';
import Text2ImgIcon from './icon/Text2ImgIcon';
import BxBxsErrorIcon from './icon/BxBxsErrorIcon';
import { ModelSelect, Text2ImageModelSelect } from './ModelSelect';
import { useRouter, useSearchParams } from 'next/navigation';
import { edgesAtom, nodesAtom } from '../xyflow/nodes-edges';
import { useAtom } from 'jotai';
import { getMarkdownImgUrl, toMarkdownImgUrl } from './utils';
import { Background } from '@xyflow/react';
import { ArrowLeftIcon } from '@radix-ui/react-icons';
import BranchIcon from '../xyflow/icons/OptionIcon';
import { Button } from './ui/button';
import { findAllParentNodeIds } from '../xyflow/BaseNode';

const AiChatPage: React.FC = () => {
  const params = useSearchParams()
  const nodeid = params.get('nodeid')
  return (
    <ProChatProvider>
      <Chat nodeid={nodeid ?? ''} />
    </ProChatProvider>
  )
}

let text2ImgModelValueG = 'nd-text2img';

const Chat = ({ nodeid }: { nodeid: string }) => {
  const router = useRouter()
  const [nodes, setNodes] = useAtom(nodesAtom)
  const [edges, setEdges] = useAtom(edgesAtom)
  const node = nodes.find(node => node.id === nodeid)
  const [title, setTitle] = useState('');
  const proChat = useProChat();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editMessage, setEditMessage] = useState({
    id: '',
    value: '',
  });
  const [initMessage, setInitMessage] = useState('');
  const [messageApi, contextHolder] = message.useMessage();
  const image2TextMap = new Map<string, string>();
  const [modelValue, setmodelValue] = useState('gpt-3.5-turbo');
  const [text2ImgModelValue, setText2ImgModelValue] = useState('nd-text2img');

  useEffect(() => {
    text2ImgModelValueG = text2ImgModelValue;
  }, [text2ImgModelValue])

  const saveChatItem = (props: ChatItemProps<Record<string, any>>) => {
    console.log('saveChatItem: ', props);
    if (props.originData?.role === 'image') {
      const imgMessage = getMarkdownImgUrl(props.originData?.content);
      const newNodes = nodes.map(node => {
        if (node.id === nodeid) {
          return {
            ...node,
            data: {
              ...node.data,
              image: imgMessage,
            }
          }
        }
        return node
      })
      setNodes(newNodes)
    } else {
      const content = props.originData?.content;
      const newNodes = nodes.map(node => {
        if (node.id === nodeid) {
          return {
            ...node,
            data: {
              ...node.data,
              content,
            }
          }
        }
        return node
      })
      setNodes(newNodes)
    }

    messageApi.success('采纳成功');
  }

  const editChatItem = (props: ChatItemProps<Record<string, any>>) => {
    setEditMessage({
      id: (props as any)['data-id'],
      value: props.originData?.content ?? '',
    });
    setIsEditModalOpen(true);
  }

  const text2img = async (props: ChatItemProps<Record<string, any>>) => {
    console.log('text2img modelValue: ', text2ImgModelValueG);
    const loadingMessageId = new Date().getTime().toString()
    proChat.pushChat({
      id: loadingMessageId,
      content: '正在生成图片...',
      role: 'image',
    })
    console.log('text2img: ', props);
    let content = props.originData?.content;
    // 如果是重新生成，使用原消息对应文本
    if (image2TextMap.has(props as any['data-id'])) {
      content = image2TextMap.get(props as any['data-id']);
    }
    const contentPromise = extractKeywordsAndTranslateEnglishApi(content);
    contentPromise.catch((err) => {
      messageApi.error('提取关键词失败，请稍后重试')
      proChat.deleteMessage(loadingMessageId);
      proChat.pushChat({
        id: new Date().getTime().toString(),
        content: '提取关键词失败，请稍后重试',
        role: 'error',
      })
      console.log("err:", err)
    })
    content = (await contentPromise).text;
    console.log('english content: ', content);

    const text2imgPromise = text2imgApi({ prompt: content, modelValue: text2ImgModelValueG });
    text2imgPromise.catch((err) => {
      messageApi.error('生成图片失败，请稍后重试')
      proChat.deleteMessage(loadingMessageId);
      proChat.pushChat({
        id: new Date().getTime().toString(),
        content: '生成图片失败，请稍后重试',
        role: 'error',
      })
      console.log("err:", err)
    })
    const imgResp = await text2imgPromise;
    proChat.deleteMessage(loadingMessageId);
    const imageMsgId = new Date().getTime().toString()
    console.log("img", imgResp.data)
    proChat.pushChat({
      id: imageMsgId,
      // content: '![img](https://www.stablediffusion-cn.com/wp-content/uploads/2023/10/76819d8b2dee212c82c1542ba00184dc.png)',
      content: toMarkdownImgUrl(imgResp.data),
      role: 'image',
    })
    image2TextMap.set(imageMsgId, content);
  }

  const handleEditOk = () => {
    proChat.setMessageContent(editMessage.id, editMessage.value);
    setIsEditModalOpen(false);
  }

  const onChangeEditMessage = (e: any) => {
    setEditMessage({
      ...editMessage,
      value: e.target.value,
    });
  }

  useEffect(() => {
    setTitle(node?.data.title ?? '');
    proChat.pushChat({
      id: new Date().getTime().toString(),
      content: node?.data.content ?? '',
      role: 'assistant',
    })
    if (node?.data.image) {
      proChat.pushChat({
        id: (new Date().getTime() + 1).toString(),
        content: toMarkdownImgUrl(node?.data.image),
        role: 'image',
      })
    }

  }, [node?.data.content, node?.data.title, node?.data.image, proChat]);

  const changeTitle = (e: any) => {
    setTitle(e.target.value);
    const newNodes = nodes.map(node => {
      if (node.id === nodeid) {
        return {
          ...node,
          data: {
            ...node.data,
            title: e.target.value,
          }
        }
      }
      return node
    })
    setNodes(newNodes)
  }

  function toPrompt() {
    if (!node) return ''
    const rootNode = nodes.find((node) => node.type === 'rootNode')
    const background = rootNode?.data.content ?? ''
    const context: string[] = []
    const parentNodeIds = findAllParentNodeIds(node.id, nodes, edges)
    for (const id of parentNodeIds) {
      const node = nodes.find((node) => node.id === id)
      if (node) {
        context.push(node.data.content)
      }
    }
    const prompt = []
    prompt.push(`背景：${background}`)
    if (context.length > 0) {
      prompt.push(`前文：${context.join('\n')}\n`)
    }
    return prompt.join('\n')
  }

  const chatItemRenderConfig: ChatListProps['chatItemRenderConfig'] = {
    contentRender: (props: ChatItemProps<Record<string, any>>, defaultDom: ReactNode) => {

      const AssistantOptions = () => {
        return (
          <div className='mt-1 flex'>
            <Button variant='outline' className='gap-1 m-1' onClick={() => saveChatItem(props)}>
              <CheckCircleTwoTone twoToneColor="#52c41a" />
              采纳
            </Button>
            <Button variant='outline' className='gap-1 m-1' onClick={() => editChatItem(props)}>
              <EditTwoTone />
              编辑
            </Button>
            {
              <Button variant='outline' className='gap-1 m-1' onClick={() => text2img(props)}>
                <FileImageTwoTone
                  twoToneColor="#E69B54" />
                生图
              </Button>}
          </div>
        )
      }
      const ImageOptions = () => {
        return (
          <div>
            <Button variant='outline' className='gap-1 m-1' onClick={() => saveChatItem(props)}>
              <CheckCircleTwoTone twoToneColor="#52c41a" />
              采纳
            </Button>
            <Button variant='outline' className='gap-1 m-1' onClick={() => text2img(props)}>
              <ReloadOutlined />
              重新生成
            </Button>
          </div>
        )
      }

      return (
        <div>
          <div className='shadow-md m-1 bg-white rounded-md'>
            {defaultDom}
          </div>
          {props.originData?.role === 'assistant' && <AssistantOptions />}
          {props.originData?.role === 'image' && props.originData?.content !== '正在生成图片...' && <ImageOptions />}
        </div>
      );
    },
    avatarRender: (props: ChatItemProps<Record<string, any>>) => {
      if (props.originData?.role === 'image') {
        return (
          <div>
            <span>
              <Text2ImgIcon className='w-6 h-6' />
            </span>
          </div>
        )
      }
      if (props.originData?.role === 'error') {
        return (
          <div>
            <span>
              <BxBxsErrorIcon className='w-6 h-6' />
            </span>
          </div>
        )
      }
      return null;
    }
  }

  const backToHome = () => {
    const title = node?.data.title
    if (!title || title === undefined || title === '') {
      const newNodes = nodes.map(node => {
        if (node.id === nodeid) {
          return {
            ...node,
            data: {
              ...node.data,
              title: '未命名',
            }
          }
        }
        return node
      })
      setNodes(newNodes)
    }
    router.push('/novel-web/xyflow')
  }

  return (
    <div className='relative flex flex-col h-[100vh]'>
      {contextHolder}
      <div className='flex flex-col p-4 gap-2 bg-[#F8FAFC] border-b border-slate-900/10'>
        <div className='flex flex-row items-center gap-2'>
          <ArrowLeftIcon className='w-5 h-5' onClick={backToHome} />
          <span className='flex flex-row items-center gap-2 text-lg font-bold'>
            <BranchIcon className='w-5 h-5' />
            <span>节点 AI 创作</span>
          </span>
        </div>
        <Input
          className='text-lg'
          prefix={<span className='text-[#6F6F6F]'>标题：</span>}
          placeholder="输入标题"
          size='large'
          value={title}
          onChange={changeTitle}
        />
      </div>

      <ProChat
        helloMessage={initMessage}
        chatItemRenderConfig={chatItemRenderConfig}
        className='h-[100vh] bg-[#F8FAFC]'
        actions={{
          render: (defaultDoms) => {
            return [
              <div className='flex flex-col gap-2' key={new Date().getTime()}>
                <ModelSelect value={modelValue} onChange={(v) => setmodelValue(v)} />
                <Text2ImageModelSelect value={text2ImgModelValue} onChange={(v) => setText2ImgModelValue(v)} />
              </div>,
              ...defaultDoms,
            ]
          },
          flexConfig: {
            gap: 2,
            direction: 'horizontal',
            justify: 'space-between',
          }
        }}
        request={async (msg) => {
          const prompt = toPrompt()
          console.log('prompt: ', prompt);
          if (modelValue === 'mify') {
            const streamPromise = mifyApi(`${prompt}\n${msg[msg.length - 1].content}`)
            streamPromise.catch((err) => {
              messageApi.error('Mify接口调用失败，请稍后重试')
              console.log("err:", err)
              if (proChat.getChatLoadingId()) {
                // biome-ignore lint/style/noNonNullAssertion: <explanation>
                proChat.deleteMessage(proChat.getChatLoadingId()!);
                proChat.pushChat({
                  id: new Date().getTime().toString(),
                  content: '模型接口调用失败，请稍后重试',
                  role: 'error',
                })
              }
            })
            return (await streamPromise)
          }
          const streamPromise = chatApi(msg, prompt, modelValue)
          streamPromise.catch((err) => {
            messageApi.error('模型接口调用失败，请稍后重试')
            if (proChat.getChatLoadingId()) {
              // biome-ignore lint/style/noNonNullAssertion: <explanation>
              proChat.deleteMessage(proChat.getChatLoadingId()!);
              proChat.pushChat({
                id: new Date().getTime().toString(),
                content: '模型接口调用失败，请稍后重试',
                role: 'error',
              })
            }
            console.log("err:", err)
          })
          return (await streamPromise).toTextStreamResponse();
        }}
      />
      <Modal
        open={isEditModalOpen}
        onOk={handleEditOk}
        title="编辑"
        onCancel={() => setIsEditModalOpen(false)}
        okText="保存"
        cancelText="取消"
      >
        <TextArea
          rows={22}
          value={editMessage.value}
          onChange={onChangeEditMessage} />
      </Modal>
    </div>
  );
};

export default AiChatPage;
