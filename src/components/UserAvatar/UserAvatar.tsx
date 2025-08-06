import { Avatar, Space, Typography } from 'antd';
import type { IProcessoConvocacao } from '../../services/resources/convocacao/IConvocacao';
import { DownOutlined, UserOutlined } from '@ant-design/icons';
const { Text } = Typography;


export interface INewProductModalData extends IProcessoConvocacao {
  description: string;
}

export type TitleItem = 
  | { title: string }
  | { title: React.ReactElement };


 



export const UserAvatar: React.FC = ( ) => {
 
  
  return (
    <Space size="middle">
      <Avatar size="default" icon={<UserOutlined />} />     
      <Text>João Pedro  <DownOutlined style={{ fontSize: 10, marginLeft: 4 }} /></Text>  
    </Space>
  );
};



