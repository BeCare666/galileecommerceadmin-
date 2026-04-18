import Pagination from '@/components/ui/pagination';
import { Table } from '@/components/ui/table';
import { useTranslation } from 'next-i18next';
import { useState } from 'react';
import TitleWithSort from '@/components/ui/title-with-sort';
import { SortOrder } from '@/types';
import { useIsRTL } from '@/utils/locals';
import { NoDataFound } from '@/components/icons/no-data-found';
import Avatar from '@/components/common/avatar';
import {
    CheckCircle,
    XCircle,
    Clock,
    Eye,
} from 'lucide-react';

type Props = {
    ambassadors: any[];
    paginatorInfo: any;
    onPagination: (page: number) => void;
};

const Pending = ({ ambassadors, paginatorInfo, onPagination }: Props) => {
    const { t } = useTranslation();
    const { alignLeft } = useIsRTL();

    type SortingType = {
        sort: SortOrder;
        column: string;
    };

    const [sortingObj, setSortingObj] = useState<SortingType>({
        sort: SortOrder.Desc,
        column: 'id',
    });

    const [selected, setSelected] = useState<any>(null); // 🔥 modal

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
                status: value ? true : false, // 🔥 respect backend boolean
            }),
        });

        location.reload();
    }

    async function approve(id: number) {
        await fetch(`${process.env.NEXT_PUBLIC_REST_API_ENDPOINT}/ambassadors/${id}/approve`, {
            method: 'PATCH',
        });
        location.reload();
    }

    async function reject(id: number) {
        await fetch(`${process.env.NEXT_PUBLIC_REST_API_ENDPOINT}/ambassadors/${id}/reject`, {
            method: 'PATCH',
        });
        location.reload();
    }

    const renderStatus = (status: string) => {
        if (status === 'approved') {
            return <CheckCircle className="text-green-500 w-5 h-5" />;
        }
        if (status === 'rejected') {
            return <XCircle className="text-red-500 w-5 h-5" />;
        }
        return <Clock className="text-yellow-500 w-5 h-5" />;
    };

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
            width: 80,
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
                <div className="flex items-center gap-3">
                    <Avatar
                        name={name}
                        src={record?.image?.thumbnail || '/placeholder.png'}
                    />
                    <span className="font-medium">{name}</span>
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
            width: 150,
        },
        {
            title: t('common:table-item-status'),
            dataIndex: 'status',
            key: 'status',
            align: 'center',
            width: 120,
            render: (status: string) => (
                <div className="flex justify-center">
                    {renderStatus(status)}
                </div>
            ),
        },
        {
            title: 'Action',
            key: 'actions',
            align: 'center',
            width: 160,
            render: (_: any, record: any) => (
                <div className="flex items-center justify-center gap-3">
                    {/* VIEW */}
                    <button onClick={() => setSelected(record)}>
                        <Eye className="w-5 h-5 text-gray-600 hover:text-black" />
                    </button>

                    {/* APPROVE */}
                    <button onClick={() => approve(record.id)}>
                        <CheckCircle className="w-5 h-5 text-green-500 hover:scale-110" />
                    </button>

                    {/* REJECT */}
                    <button onClick={() => reject(record.id)}>
                        <XCircle className="w-5 h-5 text-red-500 hover:scale-110" />
                    </button>
                </div>
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
                    scroll={{ x: 1000 }}
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

            {/* 🔥 MODAL PREMIUM DARK */}
            {selected && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
                    <div className="bg-[#111] text-white rounded-2xl p-6 w-[500px] shadow-2xl">
                        <h2 className="text-xl font-semibold mb-4">
                            Détails de l’ambassadeur
                        </h2>

                        <div className="space-y-3 text-sm">
                            <p><strong>ID:</strong> #{selected.id}</p>
                            <p><strong>Nom:</strong> {selected.name}</p>
                            <p><strong>Email:</strong> {selected.email}</p>
                            <p><strong>Type:</strong> {selected.ambassador_type}</p>
                            <p><strong>Status:</strong> {selected.status}</p>
                        </div>

                        <div className="flex justify-end mt-6">
                            <button
                                onClick={() => setSelected(null)}
                                className="px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600"
                            >
                                Fermer
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Pending;