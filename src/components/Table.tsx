import React from "react";
import classNames from "classnames";

export const ColumnHeader = ({
  children,
  onClick,
  active = false,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  active?: boolean;
}) => (
  <TableCell
    onClick={onClick}
    className={classNames("p-[0.5em]", "text-2xl", {
      [`cursor-pointer`]: onClick !== undefined,
      ["bg-slate-700"]: active,
    })}
  >
    {children}
  </TableCell>
);

export const TableCell = ({
  children,
  onClick,
  className,
  active = false,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  active?: boolean;
}) => (
  <td
    className={classNames(
      "p-[1em]",
      "text-md",
      "border-2",
      "border-white",
      className ?? "",
      {
        ["bg-slate-700"]: active,
      }
    )}
    onClick={onClick}
  >
    {children}
  </td>
);
