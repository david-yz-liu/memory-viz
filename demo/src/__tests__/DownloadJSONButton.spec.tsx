import React from "react";
import { render, screen } from "@testing-library/react";
import DownloadJSONButton from "../DownloadJSONButton";

describe("DownloadJSONButton", () => {
    const mockJsonStr = "[{}]";
    const mockSx = {};
    beforeEach(() => {
        render(<DownloadJSONButton textData={mockJsonStr} />);
    });

    test("renders with correct text", () => {
        const downloadButton = screen.getByText("Download JSON");
        expect(downloadButton).toBeDefined();
    });

    // Test that the download is an actual button
    test("download button uses onClick instead of href", () => {
        const button = screen.getByTestId("download-json-btn");
        expect(button.getAttribute("href")).toBeNull();
    });
});
