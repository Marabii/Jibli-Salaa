type Flatten<T, Prefix extends string = ""> = {
  [K in keyof T]: T[K] extends object
    ? Flatten<T[K], `${Prefix}${string & K}.`>
    : `${Prefix}${string & K}`;
}[keyof T];

export type Errors<T> = Partial<Record<Flatten<T>, string>> &
  Partial<Record<keyof T, string>> & {
    global?: string;
  };
