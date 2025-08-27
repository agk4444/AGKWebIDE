/* tslint:disable */
/* eslint-disable */
export function process_file_content(content: string, operation: string): string;
export class FileManager {
  free(): void;
  constructor();
  set_current_path(path: string): void;
  get_current_path(): string;
  validate_file_path(path: string): boolean;
  get_file_extension(filename: string): string;
  is_text_file(filename: string): boolean;
  sanitize_filename(filename: string): string;
  get_language_from_path(path: string): string;
  format_file_size(size: bigint): string;
}

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly __wbg_filemanager_free: (a: number, b: number) => void;
  readonly filemanager_new: () => number;
  readonly filemanager_set_current_path: (a: number, b: number, c: number) => void;
  readonly filemanager_get_current_path: (a: number) => [number, number];
  readonly filemanager_validate_file_path: (a: number, b: number, c: number) => number;
  readonly filemanager_get_file_extension: (a: number, b: number, c: number) => [number, number];
  readonly filemanager_is_text_file: (a: number, b: number, c: number) => number;
  readonly filemanager_sanitize_filename: (a: number, b: number, c: number) => [number, number];
  readonly filemanager_get_language_from_path: (a: number, b: number, c: number) => [number, number];
  readonly filemanager_format_file_size: (a: number, b: bigint) => [number, number];
  readonly process_file_content: (a: number, b: number, c: number, d: number) => [number, number];
  readonly __wbindgen_export_0: WebAssembly.Table;
  readonly __wbindgen_malloc: (a: number, b: number) => number;
  readonly __wbindgen_realloc: (a: number, b: number, c: number, d: number) => number;
  readonly __wbindgen_free: (a: number, b: number, c: number) => void;
  readonly __wbindgen_start: () => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;
/**
* Instantiates the given `module`, which can either be bytes or
* a precompiled `WebAssembly.Module`.
*
* @param {{ module: SyncInitInput }} module - Passing `SyncInitInput` directly is deprecated.
*
* @returns {InitOutput}
*/
export function initSync(module: { module: SyncInitInput } | SyncInitInput): InitOutput;

/**
* If `module_or_path` is {RequestInfo} or {URL}, makes a request and
* for everything else, calls `WebAssembly.instantiate` directly.
*
* @param {{ module_or_path: InitInput | Promise<InitInput> }} module_or_path - Passing `InitInput` directly is deprecated.
*
* @returns {Promise<InitOutput>}
*/
export default function __wbg_init (module_or_path?: { module_or_path: InitInput | Promise<InitInput> } | InitInput | Promise<InitInput>): Promise<InitOutput>;
