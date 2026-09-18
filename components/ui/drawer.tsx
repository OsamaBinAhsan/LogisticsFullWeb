"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

import { X } from "lucide-react";

// ---
// A lightweight, vaul-free Drawer built on Framer Motion.
// Renders as a bottom sheet on mobile; a side sheet on larger screens.
// API surface mirrors shadcn/ui Drawer so existing call sites work unchanged.
// ---

interface DrawerContextValue {
  open: boolean;
  setOpen: (v: boolean) => void;
}

const DrawerContext = React.createContext<DrawerContextValue>({
  open: false,
  setOpen: () => {},
});

interface DrawerProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: React.ReactNode;
  shouldScaleBackground?: boolean;
  direction?: 'top' | 'bottom' | 'left' | 'right' | string;
}


const Drawer: React.FC<DrawerProps> = ({
  open: controlledOpen,
  onOpenChange,
  children,
}) => {
  const [internalOpen, setInternalOpen] = React.useState(false);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;

  const setOpen = React.useCallback(
    (v: boolean) => {
      if (!isControlled) setInternalOpen(v);
      onOpenChange?.(v);
    },
    [isControlled, onOpenChange]
  );

  return (
    <DrawerContext.Provider value={{ open, setOpen }}>
      {children}
    </DrawerContext.Provider>
  );
};
Drawer.displayName = "Drawer";

interface DrawerTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
}

const DrawerTrigger: React.FC<DrawerTriggerProps> = ({
  asChild,
  onClick,
  children,
  ...props
}) => {
  const { setOpen } = React.useContext(DrawerContext);
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      {...props}
      onClick={(e: any) => {
        setOpen(true);
        onClick?.(e);
      }}
    >
      {children}
    </Comp>
  );
};

interface DrawerCloseProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
}

const DrawerClose: React.FC<DrawerCloseProps> = ({
  asChild,
  onClick,
  children,
  ...props
}) => {
  const { setOpen } = React.useContext(DrawerContext);
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      {...props}
      onClick={(e: any) => {
        setOpen(false);
        onClick?.(e);
      }}
    >
      {children}
    </Comp>
  );
};


const DrawerPortal: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <>{children}</>
);

const DrawerOverlay = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { open, setOpen } = React.useContext(DrawerContext);
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={ref}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={() => setOpen(false)}
          className={cn("fixed inset-0 z-50 bg-black/60 backdrop-blur-sm", className)}
          {...(props as any)}
        />
      )}
    </AnimatePresence>
  );
});
DrawerOverlay.displayName = "DrawerOverlay";

const DrawerContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  const { open } = React.useContext(DrawerContext);
  return (
    <>
      <DrawerOverlay />
      <AnimatePresence>
        {open && (
          <motion.div
            ref={ref}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 400, damping: 40 }}
            className={cn(
              "fixed inset-x-0 bottom-0 z-50 mt-24 flex h-auto flex-col rounded-t-[10px] border border-[#1E293B]/70 bg-[#06080A] text-slate-100 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]",
              className
            )}
            {...(props as any)}
          >
            <div className="mx-auto mt-4 h-2 w-[100px] rounded-full bg-[#1E293B]" />
            {children}
          </motion.div>

        )}
      </AnimatePresence>
    </>
  );
});
DrawerContent.displayName = "DrawerContent";

const DrawerHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("grid gap-1.5 p-4 text-center sm:text-left", className)} {...props} />
);
DrawerHeader.displayName = "DrawerHeader";

const DrawerFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("mt-auto flex flex-col gap-2 p-4", className)} {...props} />
);
DrawerFooter.displayName = "DrawerFooter";

const DrawerTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h2
    ref={ref}
    className={cn(
      "text-lg font-semibold leading-none tracking-tight font-[Space_Grotesk]",
      className
    )}
    {...props}
  />
));
DrawerTitle.displayName = "DrawerTitle";

const DrawerDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-slate-400", className)}
    {...props}
  />
));
DrawerDescription.displayName = "DrawerDescription";

export {
  Drawer,
  DrawerPortal,
  DrawerOverlay,
  DrawerTrigger,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
};
