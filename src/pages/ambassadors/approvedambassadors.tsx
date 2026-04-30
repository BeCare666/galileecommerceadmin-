import { useRouter } from 'next/router';
import Card from '@/components/common/card';
import Layout from '@/components/layouts/admin';
import Search from '@/components/common/search';
import { useState, useEffect } from 'react';
import ErrorMessage from '@/components/ui/error-message';
import Loader from '@/components/ui/loader/loader';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { adminOnly } from '@/utils/auth-utils';
import { GetStaticProps } from 'next';
import PageHeading from '@/components/common/page-heading';
import AmbassadorList from '@/components/ambassador/approuved';

export default function Approvedambassadors() {
    const { t } = useTranslation();

    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(1);

    const [data, setData] = useState<any[]>([]);
    const [paginatorInfo, setPaginatorInfo] = useState<any>({
        total: 0,
        currentPage: 1,
        perPage: 10,
    }); // ✅ FIX (plus null)

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<any>(null);

    useEffect(() => {
        fetchApproved();
    }, [searchTerm, page]);

async function fetchApproved() {
    try {
        setLoading(true);

        const res = await fetch(
            `${process.env.NEXT_PUBLIC_REST_API_ENDPOINT}/ambassadors?search=${searchTerm}&page=${page}`
        );

        const result = await res.json();

        const filtered = result.data.filter(
            (item: any) => item.status === 'approved'
        );

        setData(filtered);

        setPaginatorInfo({
            total: filtered.length,
            currentPage: result.page,
            perPage: result.limit,
        });

    } catch (err) {
        setError(err);
    } finally {
        setLoading(false);
    }
}

    if (loading) return <Loader text={t('common:text-loading')} />;
    if (error) return <ErrorMessage message="Erreur chargement" />;

    return (
        <>
            <Card className="mb-8 flex flex-col items-center md:flex-row">
                <div className="mb-4 md:mb-0 md:w-1/4">
                    <PageHeading title={t('common:text-ambassadors')} />
                </div>

                <div className="flex w-full md:w-1/2 ms-auto">
                    <Search
                        onSearch={({ searchText }) => {
                            setSearchTerm(searchText);
                            setPage(1); // ✅ FIX UX
                        }}
                        placeholderText={t('common:input-placeholder-search-name')}
                    />
                </div>
            </Card>

            <AmbassadorList
                ambassadors={data}
                paginatorInfo={paginatorInfo}
                onPagination={setPage}
            />
        </>
    );
}

Approvedambassadors.authenticate = {
    permissions: adminOnly,
};

Approvedambassadors.Layout = Layout;

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
    props: {
        ...(await serverSideTranslations(locale!, ['form', 'common', 'table'])),
    },
});