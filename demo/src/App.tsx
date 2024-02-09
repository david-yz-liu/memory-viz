import React, { useState } from "react";
import SvgDisplay from "./SvgDisplay";
import MemoryModelsUserInput from "./MemoryModels";
import { ErrorBoundary } from "react-error-boundary";

export default function App() {
    const [formData, setFormData] = useState("");
    const [jsonResult, setJsonResult] = useState(null);

    const onSubmit = async (event) => {
        event.preventDefault();
        try {
            setJsonResult(JSON.parse(formData));
        } catch (error) {
            console.error("Error parsing inputted JSON: ", error);
            setJsonResult(null);
        }
    };

    return (
        <>
            <MemoryModelsUserInput
                formData={formData}
                setFormData={setFormData}
                onSubmit={onSubmit}
            />
            <section>
                <h2>Output</h2>
                <ErrorBoundary fallback={<div>Something went wrong</div>}>
                    <SvgDisplay jsonResult={jsonResult} />
                </ErrorBoundary>
            </section>
        </>
    );
}
