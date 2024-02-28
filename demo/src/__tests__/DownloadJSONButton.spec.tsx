import React from "react";
import { render, screen } from "@testing-library/react";
import DownloadJSONButton from "../DownloadJSONButton";

describe("DownloadJSONButton", () => {
    const mockJsonStr = "[{}]";
    beforeEach(() => {
        render(<DownloadJSONButton jsonResult={mockJsonStr} />);
    });

    test("renders with correct text", () => {
        const downloadButton = screen.getByText("Download This JSON");
        expect(downloadButton).toBeDefined();
    });
});
