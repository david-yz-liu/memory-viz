import default_layout_config from "./default-layout/config";
import default_layout_data from "./default-layout/data";
import blanks_config from "./blanks/config";
import blanks_data from "./blanks/data";
import manual_layout_config from "./manual-layout/config";
import manual_layout_data from "./manual-layout/data";
import simple_config from "./simple/config";
import simple_data from "./simple/data";
import styling_config from "./styling/config";
import styling_data from "./styling/data";

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
        name: "Default Layout",
        nameKey: "samples.defaultLayout",
        data: default_layout_data,
        config: default_layout_config,
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
