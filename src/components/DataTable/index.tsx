import {
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Theme,
} from "@carbon/react";

import { PageSection, PageSectionHeading } from "pages/styled.components";

import { DataTableProps } from "interface";

function DataTable({ title, header, row }: DataTableProps) {
  return (
    <PageSection>
      <PageSectionHeading>{title}</PageSectionHeading>
      <Table>
        <TableHead className="tableHeader">
          <TableRow>
            {header.map((header: any) => (
              <TableHeader id={header.key} key={header}>
                {header}
              </TableHeader>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {row.map((row: any) => (
            <TableRow key={row.id}>
              {Object.keys(row)
                .filter((key) => key !== "id")
                .map((key) => {
                  return <TableCell key={key}>{row[key]}</TableCell>;
                })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Theme theme={"white"}>
        <Pagination
          page={1}
          pageSize={5}
          pageSizes={[5, 10, 15, 20, 25, 30]}
          size="lg"
          totalItems={10}
        />
      </Theme>
    </PageSection>
  );
}
export default DataTable;
