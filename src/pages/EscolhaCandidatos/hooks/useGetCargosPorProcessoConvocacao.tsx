import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { API } from "../../../services";
import type { CargoProcesso } from "./types";

export const useGetCargosPorProcessoConvocacao = (
  processoUuid?: string,
  enabled: boolean = true
) => {
  const queryEnabled = enabled && Boolean(processoUuid);

  const {
    data: cargosData,
    isLoading: cargosIsLoading,
    error: cargosError,
    refetch: refetchCargos,
  } = useQuery({
    queryKey: ["getCargosPorProcessoConvocacao", processoUuid],
    queryFn: ({ signal }) =>
      API.Convocacao.getCargosProcesso(processoUuid!, { signal }).response as Promise<
        CargoProcesso[]
      >,
    enabled: queryEnabled,
    staleTime: 1000 * 60 * 5,
    retry: 0,
  });

  const cargosList = useMemo(() => cargosData ?? [], [cargosData]);

  const cargoCodigoPorUuid = useMemo(() => {
    return cargosList.reduce<Record<string, string | number>>((acc, cargo) => {
      const cargoObj = cargo as CargoProcesso;

      const candidateIds = [
        cargoObj.cargo_uuid,
        cargoObj.uuid,
        cargoObj.cargo?.uuid,
        cargoObj.cargo?.id,
      ].filter(
        (value): value is string =>
          typeof value === "string" && value.trim().length > 0
      );

      if (candidateIds.length === 0) {
        return acc;
      }

      const nestedCargo =
        typeof cargoObj.cargo === "object" && cargoObj.cargo !== null
          ? (cargoObj.cargo as { codigo?: string | number; codigo_cargo?: string | number })
          : undefined;

      const codigo =
        cargoObj.cargo_codigo ??
        cargoObj.codigo_cargo ??
        cargoObj.codigo ??
        nestedCargo?.codigo ??
        nestedCargo?.codigo_cargo ??
        cargoObj.id;

      if (codigo !== undefined && codigo !== null) {
        candidateIds.forEach((id) => {
          if (!acc[id]) {
            acc[id] = codigo as string | number;
          }
        });
      }

      return acc;
    }, {});
  }, [cargosList]);

  return {
    cargosData,
    cargosList,
    cargoCodigoPorUuid,
    cargosIsLoading,
    cargosError,
    refetchCargos,
  };
};


