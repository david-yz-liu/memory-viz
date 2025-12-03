import React from "react";
import { render, screen } from "@testing-library/react";
import DownloadSVGButton from "../DownloadSVGButton";
import { renderWithI18n } from "./i18n-test-utils";

describe("DownloadSVGButton", () => {
    const mockSvgStr = "<svg>...</svg>";
    beforeEach(() => {
        render(renderWithI18n(<DownloadSVGButton svgResult={mockSvgStr} />));
    });

    test("renders with correct text", () => {
        const downloadButton = screen.getByText("Download SVG");
        expect(downloadButton).toBeDefined();
    });
});
