"use client";

import { useState, useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AgGridReact } from "ag-grid-react";
import { ColDef, themeMaterial } from "ag-grid-community";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import { useAppSelector } from "~/store/hooks";

// Register all Community features
ModuleRegistry.registerModules([AllCommunityModule]);

export const Route = createFileRoute("/grid")({
  component: ShowGrid,
  head: () => ({
    title: "ag-grid Demo",
    meta: [
      {
        name: "description",
        content: "Test the ag-grid functionality",
      },
    ],
  }),
});

function ShowGrid() {
  // Get theme mode from Redux store
  const { mode } = useAppSelector((state) => state.theme);

  // Create light and dark themes
  const lightTheme = useMemo(() => {
    return themeMaterial.withParams({
      backgroundColor: "rgb(255, 255, 255)",
      foregroundColor: "rgb(33, 43, 54)",
      headerTextColor: "rgb(33, 43, 54)",
      headerBackgroundColor: "rgb(244, 246, 248)",
      oddRowBackgroundColor: "rgb(0, 0, 0, 0.02)",
      headerColumnResizeHandleColor: "rgb(180, 180, 180)",
    });
  }, []);

  const darkTheme = useMemo(() => {
    return themeMaterial.withParams({
      backgroundColor: "rgb(22, 28, 36)",
      foregroundColor: "rgb(255, 255, 255)",
      headerTextColor: "rgb(255, 255, 255)",
      headerBackgroundColor: "rgb(33, 43, 54)",
      oddRowBackgroundColor: "rgb(255, 255, 255, 0.05)",
      headerColumnResizeHandleColor: "rgb(100, 100, 100)",
    });
  }, []);

  // Row Data: The data to be displayed.
  const [rowData, setRowData] = useState([
    { make: "Tesla", model: "Model Y", price: 64950, electric: true },
    { make: "Ford", model: "F-Series", price: 33850, electric: false },
    { make: "Toyota", model: "Corolla", price: 29600, electric: false },
  ]);

  // Column Definitions: Defines the columns to be displayed.
  const [colDefs, setColDefs] = useState<ColDef[]>([
    { field: "make" },
    { field: "model" },
    { field: "price" },
    { field: "electric" },
  ]);

  // Choose the appropriate theme based on the Redux theme state
  const currentTheme = mode === "dark" ? darkTheme : lightTheme;

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">ag-grid Demo</h1>
      <div className="ag-theme-alpine h-[500px]">
        <AgGridReact
          rowData={rowData}
          columnDefs={colDefs}
          theme={currentTheme}
        />
      </div>
    </div>
  );
}
