import blanks_config from "./blanks/config.json" with { type: "json" };
import blanks_data from "./blanks/data.json" with { type: "json" };
import manual_layout_config from "./manual-layout/config.json" with { type: "json" };
import manual_layout_data from "./manual-layout/data.json" with { type: "json" };
import simple_config from "./simple/config.json" with { type: "json" };
import simple_data from "./simple/data.json" with { type: "json" };
import styling_config from "./styling/config.json" with { type: "json" };
import styling_data from "./styling/data.json" with { type: "json" };

export const SAMPLES = [
    {
        name: "Simple",
        nameKey: "samples.simple",
        data: simple_data,
        config: simple_config,
    },
    {
        name: "Manual Layout",
        nameKey: "samples.manualLayout",
        data: manual_layout_data,
        config: manual_layout_config,
    },
    {
        name: "Blank spaces",
        nameKey: "samples.blankSpaces",
        data: blanks_data,
        config: blanks_config,
    },
    {
        name: "Custom styling",
        nameKey: "samples.customStyling",
        data: styling_data,
        config: styling_config,
    },
];
