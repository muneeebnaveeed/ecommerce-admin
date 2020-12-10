import { useCallback, useMemo } from 'react';

const usePagination = ({ context, data }) => {
    const { currentPage } = context;
    const pagesLength = useMemo(() => data?.pages || 1, [data]);

    const isFirstPage = useMemo(() => currentPage.value <= 1, [currentPage]);
    const isLastPage = useMemo(() => currentPage.value >= pagesLength, [currentPage, pagesLength]);
    const incrementPage = useCallback(() => {
        if (!isLastPage) currentPage.increment();
    }, [currentPage, isLastPage]);
    const decrementPage = useCallback(() => {
        if (!isFirstPage) currentPage.decrement();
    }, [currentPage, isFirstPage]);

    return {
        firstPage: () => context.currentPage.set(1),
        incrementPage,
        decrementPage,
        lastPage: () => context.currentPage.set(pagesLength || context.currentPage.value),
        currentPage: context.currentPage.value,
        pageSize: context.pageSize.value,
        setPageSize: context.pageSize.set,
        pages: pagesLength,
        isFirstPage,
        isLastPage,
    };
};

export default usePagination;
