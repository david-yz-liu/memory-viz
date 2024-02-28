// jsdom issue. Usable solution from https://stackoverflow.com/a/74063955
if (typeof window.URL.createObjectURL === "undefined") {
    window.URL.createObjectURL = jest.fn();
}
