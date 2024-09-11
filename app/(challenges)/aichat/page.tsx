'use client'
import type React from 'react';
import { type ReactNode, useEffect, useState } from 'react'
import { Button, Input, message, Modal } from 'antd';
import { ArrowLeftOutlined, CheckCircleTwoTone, EditTwoTone, FileImageTwoTone, ReloadOutlined } from '@ant-design/icons';
import styles from './index.module.css';
import { type ChatItemProps, type ChatListProps, ProChat, ProChatProvider, useProChat } from '@ant-design/pro-chat';
import TextArea from 'antd/es/input/TextArea';
import { chatApi, extractKeywordsAndTranslateEnglishApi, mifyApi, text2imgApi } from './api/chat';
import Text2ImgIcon from './icon/Text2ImgIcon';
import BxBxsErrorIcon from './icon/BxBxsErrorIcon';
import { ModelSelect, Text2ImageModelSelect } from './ModelSelect';
import { useSearchParams } from 'next/navigation';
import { nodesAtom } from '../../novel-web/xyflow/nodes-edges';
import { useAtom } from 'jotai';
import { getMarkdownImgUrl, toMarkdownImgUrl } from './utils';

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
  const [nodes, setNodes] = useAtom(nodesAtom)
  const node = nodes.find(node => node.id === nodeid)
  const [header, setHeader] = useState('');
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
    setHeader('AI对话');
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

  // function toPrompt(node: D3TreeNode) {
  //   const prompts = [];
  //   while (node) {
  //     const { title, content } = node.data;
  //     prompts.unshift(`${title}：${content}`);
  //     node = node.parent;
  //   }
  //   return prompts.join(' ');
  // }

  const chatItemRenderConfig: ChatListProps['chatItemRenderConfig'] = {
    contentRender: (props: ChatItemProps<Record<string, any>>, defaultDom: ReactNode) => {

      const AssistantOptions = () => {
        return (
          <div className={styles.operButtons}>
            <Button onClick={() => saveChatItem(props)}>
              <CheckCircleTwoTone twoToneColor="#52c41a" />
              采纳
            </Button>
            <Button onClick={() => editChatItem(props)}>
              <EditTwoTone />
              编辑
            </Button>
            {
              <Button onClick={() => text2img(props)}>
                <FileImageTwoTone
                  twoToneColor="#E69B54" />
                生图
              </Button>}
          </div>
        )
      }
      const ImageOptions = () => {
        return (
          <div className={styles.operButtons}>
            <Button onClick={() => saveChatItem(props)}>
              <CheckCircleTwoTone twoToneColor="#52c41a" />
              采纳
            </Button>
            <Button onClick={() => text2img(props)}>
              <ReloadOutlined />
              重新生成
            </Button>
          </div>
        )
      }

      return (
        <div>
          {defaultDom}
          {props.originData?.role === 'assistant' && <AssistantOptions />}
          {props.originData?.role === 'image' && props.originData?.content !== '正在生成图片...' && <ImageOptions />}
        </div>
      );
    },
    avatarRender: (props: ChatItemProps<Record<string, any>>) => {
      if (props.originData?.role === 'image') {
        return (
          <div className={styles.avatar}>
            <span className={styles.imageAvatar}>
              <Text2ImgIcon className='w-6 h-6' />
            </span>
          </div>
        )
      }
      if (props.originData?.role === 'error') {
        return (
          <div className={styles.avatar}>
            <span className={styles.imageAvatar}>
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
      messageApi.error('标题不能为空')
    }
    //  else {
    //   // router.push('/')
    // }
  }

  return (
    <div className={styles.container}>
      {contextHolder}
      <div className={styles.header}>
        <Button
          type="text"
          icon={<ArrowLeftOutlined />}
          onClick={backToHome}
          className={styles.backButton}
        />
        <span className={styles.back}>
          {header}
        </span>
      </div>
      <div className={styles.title}>
        <div className={styles.titleLabel}>标题：</div>
        <Input
          className={styles.titleInput}
          placeholder="输入标题"
          value={title}
          onChange={changeTitle}
        />
      </div>

      <div className={styles.contentBox}>
        <div className={styles.dialogue}>
          <ProChat
            helloMessage={initMessage}
            chatItemRenderConfig={chatItemRenderConfig}
            className={styles.chat}
            actions={{
              render: (defaultDoms) => {
                return [
                  <div key={new Date().getTime()} className={styles.modelSelectContainer}>
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
              console.log('modelValue: ', modelValue);
              // const prompt = toPrompt(treeData.currentNode);
              const prompt = ''
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
      </div>
    </div>
  );
};

export default AiChatPage;
