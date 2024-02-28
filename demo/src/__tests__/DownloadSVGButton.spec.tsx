import React from "react";
import { render, screen } from "@testing-library/react";
import DownloadSVGButton from "../DownloadSVGButton";

describe("DownloadSVGButton", () => {
    const mockSvgStr = "<svg>...</svg>";
    beforeEach(() => {
        render(<DownloadSVGButton svgResult={mockSvgStr} />);
    });

    test("renders with correct text", () => {
        const downloadButton = screen.getByText("Download This SVG");
        expect(downloadButton).toBeDefined();
    });
});
