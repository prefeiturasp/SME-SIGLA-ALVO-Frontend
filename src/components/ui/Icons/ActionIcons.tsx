import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import type { AntdIconProps } from "@ant-design/icons/lib/components/AntdIcon";
import {
  deleteIcon,
  deleteIconEnabled,
  editIcon,
  editIconEnabled,
  settingsIcon,
  viewIcon,
} from "./actionIcons";

export type EditActionIconProps = AntdIconProps & {
  disabled?: boolean;
};

export function EditActionIcon({
  disabled,
  style,
  ...props
}: EditActionIconProps) {
  return (
    <EditOutlined
      style={{ ...(disabled ? editIcon : editIconEnabled), ...style }}
      {...props}
    />
  );
}

export type ViewActionIconProps = AntdIconProps;

export function ViewActionIcon({ style, ...props }: ViewActionIconProps) {
  return <EyeOutlined style={{ ...viewIcon, ...style }} {...props} />;
}

export type DeleteActionIconProps = AntdIconProps & {
  disabled?: boolean;
};

export function DeleteActionIcon({
  disabled,
  style,
  ...props
}: DeleteActionIconProps) {
  return (
    <DeleteOutlined
      style={{ ...(disabled ? deleteIcon : deleteIconEnabled), ...style }}
      {...props}
    />
  );
}

export type SettingsActionIconProps = AntdIconProps;

export function SettingsActionIcon({ style, ...props }: SettingsActionIconProps) {
  return <SettingOutlined style={{ ...settingsIcon, ...style }} {...props} />;
}
