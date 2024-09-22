import { useState } from 'react';

export const useRowSelection = () => {
  const [selectedRows, setSelectedRows] = useState([]);
  const [lastClickedRow, setLastClickedRow] = useState(null);

  const handleRowClick = (params, event, store) => {
    const { id } = params.row;
    const rows = store || [];

    if (event.shiftKey && lastClickedRow !== null) {
      const lastIndex = rows.findIndex((row) => row.id === lastClickedRow);
      const currentIndex = rows.findIndex((row) => row.id === id);

      const start = Math.min(lastIndex, currentIndex);
      const end = Math.max(lastIndex, currentIndex);

      const newSelection = rows.slice(start, end + 1).map((row) => row.id);
      setSelectedRows(newSelection);
    } else {
      setSelectedRows((prevSelected) => {
        if (prevSelected.includes(id)) {
          return prevSelected.filter((rowId) => rowId !== id);
        } else {
          return [...prevSelected, id];
        }
      });
    }

    setLastClickedRow(id);
  };

  return { selectedRows, handleRowClick };
};