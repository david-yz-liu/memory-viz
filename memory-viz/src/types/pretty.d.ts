declare module "pretty" {
    interface PrettyOptions {
        indent_size?: number;
        indent_char?: string;
        wrap_line_length?: number;
        brace_style?: "collapse" | "expand" | "end-expand" | "none";
        indent_scripts?: "keep" | "separate" | "normal";
        wrap_attributes?:
            | "auto"
            | "force"
            | "force-aligned"
            | "force-expand-multiline";
        wrap_attributes_indent_size?: number;
        preserve_newlines?: boolean;
        max_preserve_newlines?: number;
        unformatted?: string[];
        content_unformatted?: string[];
        extra_liners?: string[];
    }

    function pretty(html: string, options?: PrettyOptions): string;

    export = pretty;
}
