import automated_layout_config from "./automated-layout/config";
import automated_layout_data from "./automated-layout/data";
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
        data: simple_data,
        config: simple_config,
    },
    {
        name: "Manual Layout",
        data: manual_layout_data,
        config: manual_layout_config,
    },
    {
        name: "Automated Layout",
        data: automated_layout_data,
        config: automated_layout_config,
    },
    {
        name: "Blank spaces",
        data: blanks_data,
        config: blanks_config,
    },
    {
        name: "Custom styling",
        data: styling_data,
        config: styling_config,
    },
];
