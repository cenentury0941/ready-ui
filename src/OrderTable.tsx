import React, { useEffect, useState } from 'react';
import { useTable, useSortBy, useFilters, Column } from 'react-table';

import { Order } from './types';
import { getUserIdToken } from './utils/authUtils';
import { useMsal } from '@azure/msal-react';

const OrderTable: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const { instance } = useMsal();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const idToken = await getUserIdToken(instance);
        const apiUrl = process.env.REACT_APP_API_URL;
        if (!apiUrl) {
          console.error('API URL is not configured');
          return;
        }
        const response = await fetch(`${apiUrl}/orders`, {
          headers: {
            'Authorization': `Bearer ${idToken}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setOrders(data);
        } else {
          console.error('Failed to fetch orders');
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchOrders();
  }, []);

  const columns: Column<Order>[] = React.useMemo(
    () => [
      {
        Header: 'Confirmation Number',
        accessor: 'confirmationNumber',
      },
      {
        Header: 'Status',
        accessor: 'status',
      },
      {
        Header: 'Created At',
        accessor: 'createdAt',
      },
    ],
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable<Order>({ columns, data: orders }, useFilters, useSortBy);

  return (
    <table {...getTableProps()} style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        {headerGroups.map(headerGroup => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map(column => (
              <th
                {...column.getHeaderProps((column as any).getSortByToggleProps())}
                style={{ borderBottom: 'solid 3px red', background: 'aliceblue', fontWeight: 'bold' }}
              >
                {column.render('Header')}
                <span>
                  {(column as any).isSorted
                    ? (column as any).isSortedDesc
                      ? ' 🔽'
                      : ' 🔼'
                    : ''}
                </span>
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map(row => {
          prepareRow(row);
          return (
            <tr {...row.getRowProps()}>
              {row.cells.map(cell => {
                return (
                  <td
                    {...cell.getCellProps()}
                    style={{
                      padding: '10px',
                      border: 'solid 1px gray',
                      background: 'papayawhip',
                    }}
                  >
                    {cell.render('Cell')}
                  </td>
                );
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default OrderTable;
