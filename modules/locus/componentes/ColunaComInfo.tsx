import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { Tooltip } from "antd";
import { CabecalhoColunaInfo } from "@locus/estilos";

export interface ColunaComInfoProps {
  titulo: string;
  dica: string;
}

export function ColunaComInfo({ titulo, dica }: ColunaComInfoProps) {
  return (
    <CabecalhoColunaInfo>
      {titulo}
      <Tooltip title={dica}>
        <span role="img" aria-label={dica} style={{ display: "inline-flex" }}>
          <InfoOutlinedIcon fontSize="inherit" />
        </span>
      </Tooltip>
    </CabecalhoColunaInfo>
  );
}

export default ColunaComInfo;
