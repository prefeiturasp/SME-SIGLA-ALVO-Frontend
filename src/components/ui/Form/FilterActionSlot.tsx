import type { ReactNode } from "react";
import { AppFormItem } from "./AppFormItem";

const hiddenFilterLabel = <span aria-hidden style={{ visibility: "hidden" }}>_</span>;

/** Reserva o espaço do label para alinhar botões à base dos campos na mesma linha. */
export function FilterActionSlot({ children }: { children: ReactNode }) {
  return (
    <AppFormItem label={hiddenFilterLabel} labelCol={{ span: 24 }}>
      {children}
    </AppFormItem>
  );
}
