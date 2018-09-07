(() => {
    var_dump("Hello");
    (() => {
        var_dump("world!");
    })();
})();