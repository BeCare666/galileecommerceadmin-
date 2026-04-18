import Pagination from '@/components/ui/pagination';
import { Table } from '@/components/ui/table';
import { useTranslation } from 'next-i18next';
import { useState } from 'react';
import TitleWithSort from '@/components/ui/title-with-sort';
import { SortOrder } from '@/types';
import { useIsRTL } from '@/utils/locals';
import { NoDataFound } from '@/components/icons/no-data-found';
import Avatar from '@/components/common/avatar';
import { Switch } from '@headlessui/react';

type Props = {
    ambassadors: any[];
    paginatorInfo: any;
    onPagination: (page: number) => void;
};

const AmbassadorList = ({ ambassadors, paginatorInfo, onPagination }: Props) => {
    const { t } = useTranslation();
    const { alignLeft } = useIsRTL();

    type SortingType = {
        sort: SortOrder;
        column: string; // ✅ FIX (plus de null)
    };

    const [sortingObj, setSortingObj] = useState<SortingType>({
        sort: SortOrder.Desc,
        column: 'id', // ✅ FIX (valeur par défaut)
    });

    function onHeaderClick(column: string) {
        setSortingObj({
            sort:
                sortingObj.column === column && sortingObj.sort === SortOrder.Desc
                    ? SortOrder.Asc
                    : SortOrder.Desc,
            column,
        });
    }

    async function handleStatus(id: number, value: boolean) {
        await fetch(`${process.env.NEXT_PUBLIC_REST_API_ENDPOINT}/ambassadors/${id}/status`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                status: value ? 'approved' : 'pending', // ✅ FIX backend string
            }),
        });

        location.reload(); // (tu peux optimiser plus tard)
    }

    const columns = [
        {
            title: (
                <TitleWithSort
                    title={t('common:table-item-id')}
                    ascending={sortingObj.sort === SortOrder.Asc}
                    isActive={sortingObj.column === 'id'}
                />
            ),
            onHeaderCell: () => ({
                onClick: () => onHeaderClick('id'),
            }),
            dataIndex: 'id',
            key: 'id',
            align: alignLeft,
            width: 100,
            render: (id: number) => `#${id}`,
        },
        {
            title: (
                <TitleWithSort
                    title={t('common:table-item-name')}
                    ascending={sortingObj.sort === SortOrder.Asc}
                    isActive={sortingObj.column === 'name'}
                />
            ),
            onHeaderCell: () => ({
                onClick: () => onHeaderClick('name'),
            }),
            dataIndex: 'name',
            key: 'name',
            align: alignLeft,
            width: 250,
            render: (name: string, record: any) => (
                <div className="flex items-center">
                    <Avatar
                        name={name}
                        src={record?.image?.thumbnail || '/placeholder.png'}
                    />
                    <span className="ms-3">{name}</span>
                </div>
            ),
        },
        {
            title: t('common:table-item-email'),
            dataIndex: 'email',
            key: 'email',
            align: alignLeft,
            width: 250,
        },
        {
            title: t('common:table-item-type'),
            dataIndex: 'ambassador_type',
            key: 'type',
            align: 'center',
        },
        {
            title: t('common:table-item-status'),
            dataIndex: 'status',
            key: 'status',
            align: 'center',
            render: (status: string, record: any) => ( // ✅ FIX type string
                <Switch
                    checked={status === 'approved'} // ✅ FIX logique
                    onChange={(value: boolean) => handleStatus(record.id, value)}
                />
            ),
        },
    ];

    return (
        <>
            <div className="mb-6 overflow-hidden rounded shadow">
                <Table
                    //@ts-ignore
                    columns={columns}
                    data={ambassadors}
                    rowKey="id"
                    emptyText={() => (
                        <div className="flex flex-col items-center py-7">
                            <NoDataFound className="w-52" />
                            <div className="pt-6 text-base font-semibold">
                                {t('common:empty-table-data')}
                            </div>
                        </div>
                    )}
                    scroll={{ x: 900 }}
                />
            </div>

            {!!paginatorInfo?.total && (
                <div className="flex justify-end">
                    <Pagination
                        total={paginatorInfo.total}
                        current={paginatorInfo.currentPage}
                        pageSize={paginatorInfo.perPage}
                        onChange={onPagination}
                    />
                </div>
            )}
        </>
    );
};

export default AmbassadorList;