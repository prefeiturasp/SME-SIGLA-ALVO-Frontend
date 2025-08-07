import { type TableProps } from 'antd';
import { type FilterValue, type SorterResult,type  TablePaginationConfig } from 'antd/es/table/interface';
import { useCallback, useState } from 'react';
import { type IListRequest } from '../types/IListRequest';
import { type IFullListRequest } from '../types/IListRequest';
 
const useListRequest = <T,>(defaultState: IListRequest<T>) => {
  const [listRequest, setListRequest] = useState(defaultState);
  const onAntTableChange: TableProps<any>['onChange'] = useCallback(
    (pagination: TablePaginationConfig,
      filters: Record<string, FilterValue | null>,
      sorter: SorterResult<T> | SorterResult<T>[]) =>
      setListRequest((prev) => ({
        pagination: {
          pageNumber: pagination.current || prev.pagination.pageNumber,
          pageSize: pagination.pageSize || prev.pagination.pageSize,
        },
        filters: { ...prev.filters, ...Object(filters) },
        ...(!!(sorter as SorterResult<any>).order && {
          sort: ((sorter as SorterResult<any>).columnKey as string) || prev.sort,
          order:
            (sorter as SorterResult<any>).order === 'ascend' ? 'asc' : 'desc',
        }),
      })),
    []
  );


  const backToPreviusPage = useCallback(
    () =>
      setListRequest((prevListRequest) => ({
        ...prevListRequest,
        pagination: {
          ...prevListRequest.pagination,
          pageNumber: prevListRequest.pagination.pageNumber - 1,
        },
      })),
    []
  );
  return {
    listRequest,
    setListRequest,
    onAntTableChange,
    backToPreviusPage,
  };
};

export const useFullListRequest = <Filter, Type>(
  defaultState: IFullListRequest<Filter> = {}
) => {
  const [listRequest, setListRequest] = useState(defaultState);
  const onAntTableChange: TableProps<Type>['onChange'] = useCallback(
    (_: TablePaginationConfig,
      filters: Record<string, FilterValue | null>,
      sorter: SorterResult<any> | SorterResult<any>[]) =>
      setListRequest((prev) => ({
        filters: { ...prev.filters, ...Object(filters) },
        ...(!!(sorter as SorterResult<any>).order && {
          sort: ((sorter as SorterResult<any>).columnKey as string) || prev.sort,
          order:
            (sorter as SorterResult<any>).order === 'ascend' ? 'asc' : 'desc',
        }),
      })),
    []
  );


 
  return {
    listRequest,
    setListRequest,
    onAntTableChange,
  };
};

export default useListRequest;
