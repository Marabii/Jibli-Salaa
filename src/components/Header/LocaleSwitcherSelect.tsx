"use client";

import clsx from "clsx";
import { usePathname, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { Locale } from "@/i18n/routing";
import { useRouter } from "@/i18n/navigation";

import { CheckIcon, LanguageIcon } from "@heroicons/react/24/solid";
import * as Select from "@radix-ui/react-select";

type Props = {
  defaultValue: string;
  items: Array<{ value: string; label: string }>;
  label: string;
};

export default function LocaleSwitcherSelect({
  defaultValue,
  items,
  label,
}: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const pathname = usePathname();
  const searchParams = useSearchParams(); // Get current query parameters

  function onSelectChange(nextLocale: Locale) {
    // Convert searchParams to a plain object
    const query = Object.fromEntries(searchParams.entries());

    // pathname might be "/ar/negotiate", "/en/negotiate", etc.
    // We remove the old locale segment (defaultValue) so Next-Intl can prepend the new one.
    const routeWithoutLocale = pathname.replace(`/${defaultValue}`, "");

    startTransition(() => {
      router.replace(
        { pathname: routeWithoutLocale, query },
        { locale: nextLocale }
      );
    });
  }

  return (
    <div className="relative z-50">
      <Select.Root defaultValue={defaultValue} onValueChange={onSelectChange}>
        <Select.Trigger
          aria-label={label}
          className={clsx(
            "rounded-sm p-2 transition-colors hover:bg-slate-200",
            isPending && "pointer-events-none opacity-60"
          )}
        >
          <Select.Icon>
            <LanguageIcon className="h-6 w-6 text-white transition-colors hover:text-slate-900" />
          </Select.Icon>
        </Select.Trigger>
        <Select.Portal>
          <Select.Content
            align="end"
            className="min-w-[8rem] z-50 overflow-hidden rounded-sm bg-white py-1 shadow-md"
            position="popper"
          >
            <Select.Viewport>
              {items.map((item) => (
                <Select.Item
                  key={item.value}
                  className="flex cursor-default items-center px-3 py-2 text-base data-[highlighted]:bg-slate-100"
                  value={item.value}
                >
                  <div className="mr-2 w-[1rem]">
                    {item.value === defaultValue && (
                      <CheckIcon className="h-5 w-5 text-slate-600" />
                    )}
                  </div>
                  <span className="text-slate-900">{item.label}</span>
                </Select.Item>
              ))}
            </Select.Viewport>
            <Select.Arrow className="fill-white text-white" />
          </Select.Content>
        </Select.Portal>
      </Select.Root>
    </div>
  );
}
