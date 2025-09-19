export type Variant = {
  key: string;
};

export type Language = {
  key: string;
  label: string;
  syntax_mode: string;
  variants: Variant[];
};

export type ConvertOptions = {
  indentType?: number;
  indentCount?: number;
  requestTimeout?: number;
  trimRequestBody?: boolean;
  addCacheHeader?: boolean;
  followRedirect?: boolean;
};

export type CallbackErr<T> = (err: Error | string | null, result?: T) => void;
