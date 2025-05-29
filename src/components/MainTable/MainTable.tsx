import React, { useCallback, useRef } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchRecords } from "../../api/recordsApi"
import { Table } from "antd";
import "./MainTable.css";
import type { ColumnsType } from "antd/es/table";
import { Record } from "../../types/Record";

const PAGE_SIZE = 20;

const InfiniteTable: React.FC = () => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useInfiniteQuery({
    queryKey: ["records"],
    queryFn: ({ pageParam = 0 }) => fetchRecords(pageParam, PAGE_SIZE),
    initialPageParam: 0, 
    getNextPageParam: (lastPage, allPages) =>
      lastPage.length === PAGE_SIZE ? allPages.length * PAGE_SIZE : undefined,
  });

  const records = data?.pages.flat() || [];

  const columns: ColumnsType<Record> = React.useMemo(() => (
    Object.keys(records[0] || {}).map(key => ({
      title: key,
      dataIndex: key,
      key,
    }))
  ), [records]);

  const divRef = useRef<HTMLDivElement>(null);

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, clientHeight, scrollHeight } = e.currentTarget;
    if (scrollHeight - scrollTop <= clientHeight + 20 && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  return (
    <div
      ref={divRef}
      className="main-table-container"
      onScroll={handleScroll}
    >
      <Table
        dataSource={records}
        columns={columns}
        rowKey="id"
        pagination={false}
        size="small"
      />
      {isFetchingNextPage && <div className="loading-row">Загрузка...</div>}
    </div>
  );
};

export default InfiniteTable;