import { AntdRegistry } from '@ant-design/nextjs-registry';

export default function NovelWebLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AntdRegistry>
      {children}
    </AntdRegistry>
  )
}