import React from "react";
import classNames from "classnames";

export const ColumnHeader = ({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick?: () => void;
}) => (
  <TableCell
    onClick={onClick}
    className={classNames("p-[1em]", "text-2xl", {
      [`cursor-pointer`]: onClick !== undefined,
    })}
  >
    {children}
  </TableCell>
);

export const TableCell = ({
  children,
  onClick,
  className,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}) => (
  <td
    className={"p-[1em] text-md border-2 border-white " + className ?? ""}
    onClick={onClick}
  >
    {children}
  </td>
);
