import { useState } from 'react';

const CollectionsContext = () => {
    const [reviewCurrentPage, setReviewCurrentPage] = useState(1);
    const [reviewPageSize, setReviewPageSize] = useState(5);

    const [tableCurrentPage, setTableCurrentPage] = useState(1);
    const [tablePageSize, setTablePageSize] = useState(15);

    return {
        reviewContext: {
            currentPage: {
                value: reviewCurrentPage,
                increment: () => setReviewCurrentPage((prevState) => prevState + 1),
                decrement: () => setReviewCurrentPage((prevState) => prevState - 1),
            },
            pageSize: {
                value: reviewPageSize,
                set: setReviewPageSize,
            },
            getQueryKey: function () {
                return ['collections', { page: this.currentPage.value, pageSize: this.pageSize.value }];
            },
            getReviewData: function () {
                return { page: this.currentPage.value, pageSize: this.pageSize.value, queryKey: this.getQueryKey() };
            },
        },
        tableContext: {
            currentPage: {
                value: tableCurrentPage,
                increment: () => setTableCurrentPage((prevState) => prevState + 1),
                decrement: () => setTableCurrentPage((prevState) => prevState - 1),
            },
            pageSize: {
                value: tablePageSize,
                set: setTablePageSize,
            },
            getQueryKey: function () {
                return ['collections', { page: this.currentPage.value, pageSize: this.pageSize.value }];
            },
            getTableData: function () {
                return { page: this.currentPage.value, pageSize: this.pageSize.value, queryKey: this.getQueryKey() };
            },
        },
    };
};

export default CollectionsContext;
