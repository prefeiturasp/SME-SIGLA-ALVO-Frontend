import { Space } from 'antd';
import { UserLabel, StyledUserAvatar, UserAvatarIcon } from '../pages/Base/styles';

 

export type TitleItem = 
  | { title: string }
  | { title: React.ReactElement };


 

 
export const UserAvatar: React.FC = () => {
  return (
    <Space size="small">
      <UserLabel>
        Seja bem vindo(a), Janaina
      </UserLabel>
      
      <StyledUserAvatar size="default" icon={<UserAvatarIcon />} />            
    </Space>
  );
};



