import React, { useState } from 'react';
import { Box, Button } from '@mui/material';

type PaginatedTableProps = {
  data: Record<string, any>[];
};

const PaginatedTable: React.FC<PaginatedTableProps> = ({ data }) => {
  const [page, setPage] = useState(0);
  const rowsPerPage = 5;

  const totalPages = Math.ceil(data.length / rowsPerPage);
  const paginatedData = data.slice(page * rowsPerPage, (page + 1) * rowsPerPage);

  const handlePrev = () => setPage((prev) => Math.max(prev - 1, 0));
  const handleNext = () => setPage((prev) => Math.min(prev + 1, totalPages - 1));

  return (
    <Box sx={{ width: '100%', overflowX: 'auto' }}>
         {data.length > rowsPerPage && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2, gap: 2 }}>
          <Button onClick={handlePrev} disabled={page === 0}>
            Previous
          </Button>
          <span>Page {page + 1} of {totalPages}</span>
          <Button onClick={handleNext} disabled={page === totalPages - 1}>
            Next
          </Button>
        </Box>
      )}
      <table style={{ borderCollapse: 'collapse', width: '100%' }}>
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
                }}
              >
                {key}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((row, rowIndex) => (
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
    </Box>
  );
};

export default PaginatedTable;
