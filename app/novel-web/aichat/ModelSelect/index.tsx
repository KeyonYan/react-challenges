import { Select } from "antd";
import styles from './index.module.css';

interface SelectProps {
  value: string,
  onChange: (value: string) => void
}

export const ModelSelect = ({ value, onChange }: SelectProps) => {
  return (
    <div className={styles.selectModel}>
      <div>选择文生文模型：</div>
      <Select
        value={value}
        defaultValue='gpt-3.5-turbo'
        onChange={onChange}
        options={[
          { label: 'GPT3.5', value: 'gpt-3.5-turbo' },
          { label: 'GPT4o', value: 'gpt-4o' },
          { label: 'GPT4-turbo', value: 'gpt-4-turbo-2024-04-09' },
          { label: 'Claude3', value: 'claude-3-haiku' },
          // { label: '豆包', value: 'ep-20240823235725-ßwpq74' },
          // { label: 'Mify', value: 'mify' },
        ]} />
    </div>
  )
}

export const Text2ImageModelSelect = ({ value, onChange }: SelectProps) => {
  return (
    <div className={styles.selectModel}>
      <div>选择文生图模型：</div>
      <Select
        value={value}
        onChange={onChange}
        options={[
          { label: '漫画风格', value: 'nd-text2img' },
          { label: '写实风格', value: 'mitv-text2img' },
        ]} />
    </div>
  )
}