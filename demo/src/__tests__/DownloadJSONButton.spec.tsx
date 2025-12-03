import React from "react";
import { render, screen } from "@testing-library/react";
import DownloadJSONButton from "../DownloadJSONButton.js";
import { renderWithI18n } from "./i18n-test-utils";

describe("DownloadJSONButton", () => {
    const mockJsonStr = "[{}]";
    const mockSx = {};
    beforeEach(() => {
        render(
            renderWithI18n(
                <DownloadJSONButton jsonResult={mockJsonStr} sx={mockSx} />
            )
        );
    });

    test("renders with correct text", () => {
        const downloadButton = screen.getByText("Download JSON");
        expect(downloadButton).toBeDefined();
    });
});
