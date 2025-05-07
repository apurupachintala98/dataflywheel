import React, { useEffect, useState, useRef } from 'react';

interface MyDataType {
    data: Record<string, any>[];
}

const PAGE_SIZE = 5;

const PaginatedTable: React.FC<{ data: MyDataType[] }> = ({ data }) => {
    const [visibleData, setVisibleData] = useState<MyDataType[]>([]);
    const [page, setPage] = useState(1);
    const tableRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const loadMore = () => {
            const nextPageData = data.slice(0, page * PAGE_SIZE);
            setVisibleData(nextPageData);
        };

        loadMore();
    }, [page, data]);

    const handleScroll = () => {
        if (!tableRef.current) return;

        const { scrollTop, scrollHeight, clientHeight } = tableRef.current;

        if (scrollTop + clientHeight >= scrollHeight - 5) {
            if (visibleData.length < data.length) {
                setPage((prev) => prev + 1);
            }
        }
    };

    // return (
    //     <div
    //         ref={tableRef}
    //         onScroll={handleScroll}
    //         className="custom-scroll"
    //         style={{ height: '430px', overflowY: 'auto', border: '1px solid #ccc' }}
    //     >
    //         <table style={{ width: '100%', borderCollapse: 'collapse' }}>
    //             <thead>
    //                 <tr>
    //                     {Object.keys(data[0]).map((key) => (
    //                         <th
    //                             key={key}
    //                             style={{
    //                                 border: '1px solid black',
    //                                 padding: '8px',
    //                                 textAlign: 'left',
    //                                 backgroundColor: '#5d5d5d',
    //                                 color: '#fff',
    //                             }}
    //                         >
    //                             {key}
    //                         </th>
    //                     ))}
    //                 </tr>
    //             </thead>
    //             <tbody>
    //                 {visibleData.map((row, rowIndex) => (
    //                     <tr key={rowIndex}>
    //                         {Object.values(row).map((value, colIndex) => (
    //                             <td key={colIndex} style={{ border: '1px solid black', padding: '8px' }}>
    //                                 {typeof value === 'object' ? JSON.stringify(value) : String(value)}
    //                             </td>
    //                         ))}
    //                     </tr>
    //                 ))}
    //             </tbody>
    //         </table>
    //     </div>
    // );

    return (
        <div style={{ border: '1px solid #ccc', width: '100%' }}>
            {/* Table header stays fixed */}
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr>
                        {Object.keys(data[0]).map((key) => (
                            <th
                                key={key}
                                style={{
                                    border: '1px solid black',
                                    padding: '8px',
                                    textAlign: 'left',
                                    backgroundColor: '#5d5d5d',
                                    color: '#fff',
                                    position: 'sticky',
                                    top: 0,
                                    zIndex: 2,
                                }}
                            >
                                {key}
                            </th>
                        ))}
                    </tr>
                </thead>
            </table>

            {/* Scrollable table body */}
            <div
                ref={tableRef}
                onScroll={handleScroll}
                className="custom-scroll"
                style={{
                    maxHeight: '430px',
                    overflowY: 'auto',
                    overflowX: 'auto',
                    width: '100%',
                }}
            >
                <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
                    <tbody>
                        {visibleData.map((row, rowIndex) => (
                            <tr key={rowIndex}>
                                {Object.values(row).map((value, colIndex) => (
                                    <td key={colIndex} style={{ border: '1px solid black', padding: '8px' }}>
                                        {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

};

export default PaginatedTable;