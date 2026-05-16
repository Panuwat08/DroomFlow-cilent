import * as React from "react";

import { cn } from "@/src/lib/utils";

function Card({
  className,
  size = "default",
  ...props
}) {

  return (
    <div
      data-slot="card"
      data-size={size}
      className={cn(
        "group/card flex flex-col gap-4 overflow-hidden rounded-xl bg-white text-black shadow-md border border-gray-100 py-4",
        className
      )}
      {...props}
    />
  );
}

function CardHeader({
  className,
  ...props
}) {

  return (
    <div
      data-slot="card-header"
      className={cn(
        "flex flex-col gap-1 px-4",
        className
      )}
      {...props}
    />
  );
}

function CardTitle({
  className,
  ...props
}) {

  return (
    <div
      data-slot="card-title"
      className={cn(
        "text-xl font-black text-gray-900",
        className
      )}
      {...props}
    />
  );
}

function CardDescription({
  className,
  ...props
}) {

  return (
    <div
      data-slot="card-description"
      className={cn(
        "text-sm text-gray-500",
        className
      )}
      {...props}
    />
  );
}

function CardContent({
  className,
  ...props
}) {

  return (
    <div
      data-slot="card-content"
      className={cn(
        "px-4",
        className
      )}
      {...props}
    />
  );
}

function CardFooter({
  className,
  ...props
}) {

  return (
    <div
      data-slot="card-footer"
      className={cn(
        "px-4 py-3 border-t",
        className
      )}
      {...props}
    />
  );
}

export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
};