import React, { useEffect, useRef } from 'react';
import JSONEditor, { JSONEditorOptions } from 'jsoneditor';
import 'jsoneditor/dist/jsoneditor.min.css';

interface JSONEditorProps<T> {
    data: T;
    schema: any;
    onChange: (data: T) => void;
    height: string;
}

const JSONEditorComponent = <T,>({
    data,
    schema,
    onChange,
    height
}: JSONEditorProps<T>) => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (containerRef.current) {
            const options: JSONEditorOptions = {
                theme: 'tailwind',
                onChange: () => {
                    if (editor) {
                        onChange(editor.get());
                    }
                }
            };
            const editor = new JSONEditor(containerRef.current, options);
            editor.setSchema(schema);
            editor.set(data);

            return () => {
                editor.destroy();
            };
        }
    }, [schema, data, onChange]);

    return <div ref={containerRef} className="rounded p-2 border border-gray-300" style={{ height }}></div>;
};

export default JSONEditorComponent;
