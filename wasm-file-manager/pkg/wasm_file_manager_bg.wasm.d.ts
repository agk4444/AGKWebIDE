/* tslint:disable */
/* eslint-disable */
export const memory: WebAssembly.Memory;
export const __wbg_filemanager_free: (a: number, b: number) => void;
export const filemanager_new: () => number;
export const filemanager_set_current_path: (a: number, b: number, c: number) => void;
export const filemanager_get_current_path: (a: number) => [number, number];
export const filemanager_validate_file_path: (a: number, b: number, c: number) => number;
export const filemanager_get_file_extension: (a: number, b: number, c: number) => [number, number];
export const filemanager_is_text_file: (a: number, b: number, c: number) => number;
export const filemanager_sanitize_filename: (a: number, b: number, c: number) => [number, number];
export const filemanager_get_language_from_path: (a: number, b: number, c: number) => [number, number];
export const filemanager_format_file_size: (a: number, b: bigint) => [number, number];
export const process_file_content: (a: number, b: number, c: number, d: number) => [number, number];
export const __wbindgen_export_0: WebAssembly.Table;
export const __wbindgen_malloc: (a: number, b: number) => number;
export const __wbindgen_realloc: (a: number, b: number, c: number, d: number) => number;
export const __wbindgen_free: (a: number, b: number, c: number) => void;
export const __wbindgen_start: () => void;
