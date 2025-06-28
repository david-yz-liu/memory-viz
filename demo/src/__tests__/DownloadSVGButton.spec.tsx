import React from "react";
import { render, screen } from "@testing-library/react";
import DownloadSVGButton from "../DownloadSVGButton";

describe("DownloadSVGButton", () => {
    const mockSvgStr = "<svg>...</svg>";
    beforeEach(() => {
        render(<DownloadSVGButton svgResult={mockSvgStr} />);
    });

    test("renders with correct text", () => {
        const downloadButton = screen.getByText("Download SVG");
        expect(downloadButton).toBeDefined();
    });

    // Test that the download is an actual button
    test("download button uses onClick instead of href", () => {
        const button = screen.getByTestId("download-svg-btn");
        expect(button.getAttribute("href")).toBeNull();
    });
});
