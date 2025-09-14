declare module 'postman-code-generators' {
  import { Request } from 'postman-collection';

  export interface Options {
    indentCount?: number;
    indentType?: 'Space' | 'Tab';
    trimRequestBody?: boolean;
    followRedirect?: boolean;
  }

  export function convert(
    language: string,
    variant: string,
    request: Request,
    options: Options,
    callback: (error: Error | null, snippet?: string) => void
  ): void;

  export function getLanguageList(): Language[];

  export function getOptions(
    language: string,
    variant: string,
    callback: CallbackErr<object>
  ): void;
}
