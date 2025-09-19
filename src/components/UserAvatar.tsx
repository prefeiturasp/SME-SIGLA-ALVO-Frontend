import { Avatar, Space } from 'antd';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';
import { useTheme } from "styled-components";
import { CustomLabel } from '../pages/Base/styles';

 

export type TitleItem = 
  | { title: string }
  | { title: React.ReactElement };


 

 
export const UserAvatar: React.FC = () => {
  const theme = useTheme();
  return (
    <Space size="small" >
      <Avatar size="default"  style={{ background: 'none' }}  icon={<AccountCircleRoundedIcon sx={{ fontSize :"2.5rem", color: theme.token.colorPrimary }}/>} />            
      
      <CustomLabel>
        João Pedro <ArrowDropDownIcon />
      </CustomLabel>
    </Space>
  );
};



